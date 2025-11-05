# LinkedIn Scraper Guide

Complete guide for using the automated LinkedIn follower count scraper.

## ⚠️ Important Disclaimers

### Legal & Terms of Service

**WARNING:** Web scraping LinkedIn may violate their Terms of Service. Use at your own risk.

- LinkedIn's ToS prohibits automated data collection
- Your account may be suspended or banned
- Legal action is possible in some jurisdictions
- This tool is for educational/personal use only

**Recommendations:**
- Use a separate LinkedIn account for scraping (not your personal/professional account)
- Respect rate limits and delays
- Consider using official LinkedIn API or third-party services instead
- Only scrape publicly available information

### Ethical Use

- Only collect publicly visible data
- Respect privacy
- Don't use data for spam or harassment
- Provide attribution to profiles
- Honor removal requests

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `puppeteer` - Browser automation
- `node-cron` - Task scheduling
- `tsx` - TypeScript execution

### 2. Configure Profiles

Edit `scripts/scraper/config.ts` and add profiles to monitor:

```typescript
export const PROFILES_TO_MONITOR: ProfileConfig[] = [
  {
    id: '1',
    name: 'John Doe',
    linkedinUsername: 'johndoe',
    linkedinUrl: 'https://www.linkedin.com/in/johndoe/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'QA Engineer',
    company: 'Tech Company',
    enabled: true,
  },
  // Add more profiles...
];
```

### 3. Test Scraper

Test with a single profile (browser visible):

```bash
npm run scrape:test
```

This will:
- Open a visible browser
- Scrape the first enabled profile
- Show results in console
- Close browser

### 4. Run Full Scrape

Scrape all enabled profiles (headless):

```bash
npm run scrape
```

This will:
- Scrape all enabled profiles
- Save results to `data/qa-professionals.json`
- Create snapshot in `data/snapshots/`
- Log to `logs/scraper.log`
- Show ranking changes

### 5. Schedule Automatic Scraping

Enable scheduling in `scripts/scraper/config.ts`:

```typescript
export const SCHEDULE_CONFIG = {
  enabled: true,
  cronExpression: '0 0 * * 0', // Every Sunday at midnight
  timezone: 'America/Sao_Paulo',
};
```

Then run:

```bash
npm run scrape:schedule
```

Keep this process running (use PM2 or systemd for production).

---

## 📁 File Structure

```
scripts/scraper/
├── config.ts              # Configuration (profiles, settings)
├── types.ts               # TypeScript types
├── linkedin-scraper.ts    # Main scraper class
├── logger.ts              # Logging system
├── data-storage.ts        # Data saving/loading
├── run-scraper.ts         # Main execution script
├── scheduler.ts           # Cron scheduler
└── test-scraper.ts        # Test script

data/
├── qa-professionals.json  # Main data file (used by website)
└── snapshots/             # Historical snapshots
    ├── snapshot_2025-11-04T10-30-00.json
    ├── snapshot_2025-11-11T10-30-00.json
    └── ...

logs/
├── scraper.log            # Scraper logs
└── screenshots/           # Error screenshots
    └── error_1_1730123456.png
```

---

## ⚙️ Configuration

### Profile Configuration

**`scripts/scraper/config.ts`**

```typescript
{
  id: 'unique-id',           // Unique identifier
  name: 'Full Name',         // Person's name
  linkedinUsername: 'user',  // From URL: linkedin.com/in/USER
  linkedinUrl: 'https://...',// Full LinkedIn URL
  location: {
    country: 'Country Name',
    countryCode: 'US',       // ISO code
    state: 'State Name',     // Optional
    stateCode: 'CA',         // Optional
  },
  title: 'Job Title',        // Optional
  company: 'Company Name',   // Optional
  enabled: true,             // false to skip
}
```

### Scraper Settings

```typescript
export const SCRAPER_CONFIG = {
  headless: true,              // Show browser? (false for debugging)
  timeout: 30000,              // Page load timeout (ms)
  delayBetweenProfiles: 5000,  // Delay between profiles (ms)
  randomizeDelay: true,        // Add random delay
  maxRetries: 3,               // Retry failed scrapes
  retryDelay: 10000,           // Delay between retries (ms)
  screenshotOnError: true,     // Save screenshot on error
  screenshotPath: './logs/screenshots',
};
```

### Schedule Configuration

```typescript
export const SCHEDULE_CONFIG = {
  enabled: false,                 // Enable scheduling
  cronExpression: '0 0 * * 0',   // Cron expression
  timezone: 'America/Sao_Paulo', // Your timezone
};
```

**Cron Expression Examples:**

```
'0 0 * * *'    = Every day at midnight
'0 0 * * 0'    = Every Sunday at midnight
'0 0 1 * *'    = First day of every month
'0 */6 * * *'  = Every 6 hours
'0 9 * * 1-5'  = Weekdays at 9 AM
'*/30 * * * *' = Every 30 minutes
```

---

## 🔧 How It Works

### 1. Browser Automation

The scraper uses Puppeteer to:
- Launch a headless Chrome browser
- Navigate to LinkedIn profiles
- Extract follower count from page
- Extract profile information

### 2. Follower Count Extraction

Multiple strategies to find follower count:

1. **Text search**: Look for "X followers" text
2. **Section search**: Look in specific page sections
3. **Regex search**: Pattern match in page text
4. **Parse formats**: Handle "10K", "1.2M", "10,234"

### 3. Error Handling

- **3 retries** per profile (configurable)
- **10-second delay** between retries
- **Screenshots** on error (saved to `logs/screenshots/`)
- **Detailed logging** to `logs/scraper.log`

### 4. Rate Limiting

To avoid being blocked:
- **5-second delay** between profiles (configurable)
- **Random delays** (0-2 seconds added)
- **Human-like behavior** (scrolling, mouse movements can be added)
- **Realistic user agent**

### 5. Data Storage

#### Main Data File (`data/qa-professionals.json`)

```json
{
  "lastUpdate": "2025-11-04T10:30:00Z",
  "snapshots": [
    {
      "date": "2025-11-04T10:30:00Z",
      "type": "global",
      "professionals": [...],
      "totalCount": 10
    },
    {
      "date": "2025-10-28T10:30:00Z",
      "type": "global",
      "professionals": [...],
      "totalCount": 10
    }
  ]
}
```

- Keeps last **10 snapshots**
- Used by website for ranking display
- Automatically sorted by follower count

#### Snapshot Files (`data/snapshots/`)

Full scraping results including:
- All scraped profiles (success + failures)
- Errors and retry information
- Scraping duration and statistics

Kept for **50 most recent** runs (older ones auto-deleted).

---

## 📊 Output & Logs

### Console Output

```
============================================================
LinkedIn Scraper Started
============================================================
Profiles to scrape: 5
Delay between profiles: 5s
Max retries per profile: 3

[1/5] Processing: Angie Jones
  → Navigating to https://www.linkedin.com/in/angiejones/
  → Extracted: 250000 followers
✓ Successfully scraped: Angie Jones - 250000 followers
Waiting 5s before next profile...

[2/5] Processing: Bas Dijkstra
...

============================================================
Scraping Complete
============================================================
Total profiles: 5
Successful: 5 (100%)
Failed: 0
Duration: 45s
============================================================
```

### Log File (`logs/scraper.log`)

```
[2025-11-04T10:30:00.123Z] [INFO] LinkedIn Scraper Started
[2025-11-04T10:30:05.456Z] [INFO] Scraping profile: Angie Jones
[2025-11-04T10:30:08.789Z] [INFO] ✓ Successfully scraped: Angie Jones - 250000 followers
[2025-11-04T10:30:15.012Z] [ERROR] Attempt 1/3 failed for John Doe: Timeout
[2025-11-04T10:30:25.345Z] [INFO] ✓ Successfully scraped: John Doe - 15000 followers
```

### Ranking Changes

After each scrape, see ranking changes:

```
=== Ranking Changes ===
1. Angie Jones - ↑ +1 (250,000 followers, +2,000)
2. Bas Dijkstra - ↓ -1 (45,000 followers, +500)
3. Júlio de Lima - ─ 0 (38,000 followers, +1,200)
4. John Doe - NEW ENTRY (15,000 followers)
========================
```

---

## 🐛 Troubleshooting

### Problem: "Could not extract follower count"

**Causes:**
- LinkedIn changed their HTML structure
- Profile page not fully loaded
- Access blocked (captcha, login required)

**Solutions:**
1. Run with `headless: false` to see what's happening
2. Increase timeout in config
3. Check if you need to be logged in
4. Update selectors in `linkedin-scraper.ts`

### Problem: "Navigation timeout"

**Causes:**
- Slow internet connection
- LinkedIn servers slow
- Page redirected (login required)

**Solutions:**
1. Increase `timeout` in config
2. Check internet connection
3. Try with visible browser (`headless: false`)

### Problem: Profile URLs don't work

**Causes:**
- Invalid URL format
- Profile doesn't exist
- Profile visibility settings

**Solutions:**
1. Verify URL works in browser
2. Check profile is public
3. Use correct URL format: `https://www.linkedin.com/in/USERNAME/`

### Problem: Getting blocked by LinkedIn

**Causes:**
- Too many requests
- Suspicious activity detected
- No delays between requests

**Solutions:**
1. Increase `delayBetweenProfiles`
2. Enable `randomizeDelay`
3. Reduce number of profiles
4. Use different account
5. Consider using proxy/VPN

### Problem: Scraper crashes or hangs

**Solutions:**
1. Check logs: `tail -f logs/scraper.log`
2. View screenshots: `logs/screenshots/`
3. Run test: `npm run scrape:test`
4. Update dependencies: `npm update`
5. Restart with clean state

---

## 🔐 Best Practices

### Security

1. **Use Separate Account**
   - Don't use your personal LinkedIn
   - Create a scraping-only account
   - Accept risk of suspension

2. **Store Credentials Safely**
   - Never commit credentials to Git
   - Use environment variables
   - Use password manager

3. **Limit Access**
   - Don't expose publicly
   - Run on secure server
   - Restrict file permissions

### Performance

1. **Optimize Settings**
   - Balance speed vs. detection
   - 5-10 second delays recommended
   - Max 20-30 profiles per run

2. **Schedule Wisely**
   - Weekly is usually enough
   - Off-peak hours (midnight, Sunday)
   - Don't over-scrape

3. **Monitor Health**
   - Check logs regularly
   - Monitor success rate
   - Update selectors when needed

### Maintenance

1. **Keep Updated**
   - Update dependencies monthly
   - Check LinkedIn for changes
   - Update selectors if needed

2. **Clean Data**
   - Old snapshots auto-deleted (keep 50)
   - Old logs can be manually deleted
   - Check data quality regularly

3. **Backup**
   - Backup `data/` folder
   - Backup config files
   - Version control with Git

---

## 🚀 Production Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start scheduler
pm2 start npm --name "linkedin-scraper" -- run scrape:schedule

# Save PM2 config
pm2 save

# Auto-start on boot
pm2 startup
```

### Using Systemd

Create `/etc/systemd/system/linkedin-scraper.service`:

```ini
[Unit]
Description=LinkedIn Scraper Scheduler
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/rankingQA
ExecStart=/usr/bin/npm run scrape:schedule
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable linkedin-scraper
sudo systemctl start linkedin-scraper
sudo systemctl status linkedin-scraper
```

### Using Docker

Add to `docker-compose.yml`:

```yaml
services:
  scraper:
    build: .
    command: npm run scrape:schedule
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    restart: unless-stopped
```

---

## 📈 Monitoring

### Check Logs

```bash
# View recent logs
tail -n 100 logs/scraper.log

# Follow logs in real-time
tail -f logs/scraper.log

# Search for errors
grep ERROR logs/scraper.log
```

### Check Last Run

```bash
# View latest snapshot
cat data/snapshots/$(ls -t data/snapshots/ | head -1)

# Count snapshots
ls -1 data/snapshots/ | wc -l

# Check main data file
cat data/qa-professionals.json | jq '.lastUpdate'
```

### Success Rate

```bash
# From logs
grep "Successful:" logs/scraper.log | tail -10
```

---

## 🆘 Support

If you encounter issues:

1. Check logs: `logs/scraper.log`
2. Check screenshots: `logs/screenshots/`
3. Run test: `npm run scrape:test`
4. Update selectors in `linkedin-scraper.ts`
5. Consider using third-party service instead

---

## 📚 References

- [Puppeteer Documentation](https://pptr.dev/)
- [Node-Cron Documentation](https://www.npmjs.com/package/node-cron)
- [LinkedIn Terms of Service](https://www.linkedin.com/legal/user-agreement)
- [Cron Expression Generator](https://crontab.guru/)

---

**Remember:** Use responsibly and at your own risk! Consider using official APIs or third-party services for production use.
