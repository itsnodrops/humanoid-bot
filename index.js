import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PATHS = {
    log: path.join(__dirname, 'logs', 'process.log'),
    tokens: path.join(__dirname, 'src', 'core', 'data', 'tokens.json'),
    env: path.join(__dirname, '.env'),
    proxies: path.join(__dirname, 'proxies.txt'),
    config: path.join(__dirname, 'config.js')
};

async function clearLog() {
    if (fs.existsSync(PATHS.log)) {
        fs.writeFileSync(PATHS.log, '');
        console.log('✓ Log file cleared');
    } else {
        console.log('Log file does not exist');
    }
}

async function clearData() {
    if (fs.existsSync(PATHS.tokens)) {
        fs.unlinkSync(PATHS.tokens);
        console.log('✓ Token cache cleared');
    } else {
        console.log('Token cache does not exist');
    }
}

async function watchLog() {
    if (!fs.existsSync(PATHS.log)) {
        console.log('Log file does not exist');
        return;
    }

    console.log('Watching log file... (Ctrl+C to stop)\n');

    let lastSize = 0;
    const interval = setInterval(() => {
        try {
            const stats = fs.statSync(PATHS.log);
            if (stats.size > lastSize) {
                const fd = fs.openSync(PATHS.log, 'r');
                const buffer = Buffer.alloc(stats.size - lastSize);
                fs.readSync(fd, buffer, 0, buffer.length, lastSize);
                fs.closeSync(fd);
                process.stdout.write(buffer.toString());
                lastSize = stats.size;
            }
        } catch (e) {
            // File may be temporarily unavailable
        }
    }, 500);

    process.on('SIGINT', () => {
        clearInterval(interval);
        console.log('\nStopped watching.');
        process.exit(0);
    });
}

async function checkConfig() {
    console.log('\n📋 Configuration Check\n');

    // Check .env
    if (fs.existsSync(PATHS.env)) {
        const envContent = fs.readFileSync(PATHS.env, 'utf-8');
        const pkCount = (envContent.match(/^PK_\d+=/gm) || []).length;
        console.log(`✓ .env found with ${pkCount} private key(s)`);
    } else {
        console.log('✗ .env not found');
    }

    // Check proxies
    if (fs.existsSync(PATHS.proxies)) {
        const proxyContent = fs.readFileSync(PATHS.proxies, 'utf-8');
        const proxyCount = proxyContent.split('\n').filter(l => l.trim() && !l.startsWith('#')).length;
        console.log(`✓ proxies.txt found with ${proxyCount} proxy(ies)`);
    } else {
        console.log('✗ proxies.txt not found');
    }

    // Check config
    if (fs.existsSync(PATHS.config)) {
        try {
            const configModule = await import('./config.js');
            const config = configModule.default;
            console.log(`✓ config.js found`);
            console.log(`  - ENABLE_LOOP: ${config.ENABLE_LOOP}`);
            console.log(`  - LOOP_TIME: ${config.LOOP_TIME || 'not set'}`);
        } catch (e) {
            console.log(`✗ config.js error: ${e.message}`);
        }
    } else {
        console.log('✗ config.js not found (using defaults)');
    }

    // Check tokens cache
    if (fs.existsSync(PATHS.tokens)) {
        try {
            const tokens = JSON.parse(fs.readFileSync(PATHS.tokens, 'utf-8'));
            const count = Object.keys(tokens).length;
            console.log(`✓ Token cache found with ${count} cached token(s)`);
        } catch {
            console.log('✗ Token cache is corrupted');
        }
    } else {
        console.log('○ Token cache not found (will be created on first run)');
    }

    console.log('');
}

async function runBot() {
    const { default: HumanoidBot } = await import('./src/app.js');
    const bot = new HumanoidBot();
    await bot.run();
}

// Parse CLI arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case '--clear-log':
        await clearLog();
        break;
    case '--clear-data':
        await clearData();
        break;
    case '--check-log':
        await watchLog();
        break;
    case '--check-config':
        await checkConfig();
        break;
    default:
        runBot().catch(console.error);
}
