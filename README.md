# Humanoid Network Bot

Automated bot for interacting with Humanoid Network Pre-launch Campaign with support for multi-account, proxy rotation, and concurrent processing.

> ⚠️**WARNING**⚠️ \
> **Code Obfuscation Notice**: This script will be obfuscated to prevent unauthorized code redistribution. The full source code will be shared publicly after the event ends.

> 💡 **Auto-Register Feature**: This bot supports automatic account registration with referral codes. For access to this feature, check our Telegram channel: [@NoDrops](https://t.me/NoDrops)

## ✨ Features

- 🔐 **Wallet Authentication** - Connect wallet and manage sessions automatically
- 🔑 **Token Caching** - Skip login when cached access token is still valid
- 🤖 **Auto Training** - Submit models and datasets from HuggingFace
- ✅ **Task Completion** - Auto-complete social tasks for bonus points
- � **Auto X Username** - Set X (Twitter) username for new accounts (configured or random)
- �👥 **Multi-Account** - Process multiple accounts concurrently
- 🚀 **Pool-Based Concurrency** - Proxies immediately reassigned when idle for max efficiency
- 🔄 **Proxy Support** - HTTP, HTTPS, SOCKS4, and SOCKS5 proxies with rotation
- 📊 **TUI Dashboard** - Real-time monitoring of all account activities
- ⏱️ **Smart Delays** - Random delays between accounts to avoid rate limiting
- 🔁 **Loop Mode** - Schedule automatic reruns at specified times

## 📋 Requirements

- **[Humanoid Network Pre-launch](https://prelaunch.humanoidnetwork.org/ref/TBE3HD)** accounts
- **Node.js** v18 or higher
- **npm** (Node Package Manager)
- **Private Keys** - Ethereum wallet private keys
- **Proxies** (Optional but recommended for multiple accounts)

## 🚀 Quick Start

### 1. Clone or Download the Repository

```bash
git clone https://github.com/itsnodrops/humanoid-bot.git
cd humanoid-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Accounts

Create a `.env` file with your private keys:

```env
# Private Keys (numbered format)
PK_1=0x...your_private_key_1
PK_2=0x...your_private_key_2
PK_3=0x...your_private_key_3

# X (Twitter) Usernames - Optional, for new accounts only
# Must match PK index (X_1 for PK_1, X_2 for PK_2, etc.)
# If not set, a random username will be generated
X_1=your_twitter_username
X_3=another_username
```

### 4. Add Proxies (Optional)

Edit `proxies.txt` to add your proxies (one per line):

```
http://user:pass@proxy1.com:8080
socks5://user:pass@proxy2.com:1080
socks4://proxy3.com:1080
```

**Supported formats:**
- HTTP: `http://user:pass@host:port` or `http://host:port`
- HTTPS: `https://user:pass@host:port` or `https://host:port`
- SOCKS5: `socks5://user:pass@host:port` or `socks5://host:port`
- SOCKS4: `socks4://user:pass@host:port` or `socks4://host:port`

### 5. Run the Bot

```bash
npm start
```

## 📊 How It Works

### Processing Flow

1. **Login** - Authenticates with Humanoid API (or uses cached token)
2. **Points Check** - Fetches current points balance
3. **Training** - Submits models and datasets from HuggingFace
4. **Tasks** - Completes available social tasks
5. **Summary** - Shows final points and stats
6. **Loop** - Waits until next scheduled run (if enabled)

### Token Caching

- Tokens are cached in `src/core/data/tokens.json`
- JWT expiration is parsed to determine validity
- Valid tokens skip the login API call entirely
- Tokens auto-refresh when expired

### Pool-Based Concurrency

The bot uses a **proxy pool** for maximum efficiency:
- **10 proxies, 50 accounts** → 10 accounts run concurrently
- When one account finishes, its proxy is **immediately** reassigned
- Random 3-10 second delay between account completions

## ⚙️ Configuration

Edit `config.js` to customize bot behavior:

```javascript
export default {
    // Set to true to run continuously, false for single run
    ENABLE_LOOP: true,
    
    // When to run next cycle (HH:MM, 24h format, local time)
    LOOP_TIME: '07:00'
};
```

## 💾 Data Storage

| Path | Purpose |
|------|---------|
| `.env` | Private keys (PK_N) and X usernames (X_N) |
| `proxies.txt` | Proxy list |
| `logs/process.log` | Activity logs |
| `src/core/data/tokens.json` | Cached auth tokens (gitignored) |

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| No accounts loaded | Check `.env` for PK_1, PK_2, etc. |
| Proxy connection failed | Verify proxy format includes protocol (http://, socks5://, etc.) |
| Login failed | Token may be expired, will auto-refresh on next run |
| Models: Limit Reached | Daily limit reached, wait 24 hours |
| All proxies blocked | Add more proxies or wait for cooldown |

## 🧰 Utility Scripts

Manage bot data and logs easily with these npm scripts:

```bash
npm start              # Run the bot
npm run clear-log      # Clear log file
npm run clear-data     # Clear token cache
npm run check-config   # Check configuration status
npm run check-log      # Check log file in real-time
```

## 📝 Notes

- **Daily Limits**: Training submissions are limited per day (3 per day)
- **Concurrency**: Based on proxy count (1 account at a time without proxies)
- **Delays**: Random 3-10s delay between accounts to avoid rate limiting
- **Token Cache**: Stored locally, never shared or uploaded

## 🤝 Contribution

Feel free to open pull requests, report bugs, or suggest features. Contributions are always welcome!

## 🛡️ Disclaimer

This tool is for educational and testing purposes only on the [Humanoid Network Pre-launch](https://prelaunch.humanoidnetwork.org/ref/TBE3HD). Use at your own risk. The authors are not responsible for any consequences resulting from the use of this software.

## 📄 License

This project is licensed under the [MIT © 2025](https://github.com/itsnodrops/humanoid-bot/blob/main/LICENSE).

