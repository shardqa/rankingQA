# LinkedIn Scraper

Automated system for collecting LinkedIn follower counts.

## ⚠️ WARNING

**Web scraping LinkedIn may violate their Terms of Service. Use at your own risk.**

This tool is for educational/personal use only.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Profiles

Edit `config.ts` and add profiles to monitor.

### 3. Test

```bash
npm run scrape:test
```

### 4. Run

```bash
npm run scrape
```

### 5. Schedule (Optional)

Enable scheduling in `config.ts`, then:

```bash
npm run scrape:schedule
```

## Commands

- `npm run scrape` - Run scraper once
- `npm run scrape:test` - Test with single profile (visible browser)
- `npm run scrape:schedule` - Start scheduler (keeps running)

## Documentation

See [SCRAPER_GUIDE.md](../../docs/SCRAPER_GUIDE.md) for complete documentation.

## How It Works

1. Puppeteer opens LinkedIn profiles
2. Extracts follower count from page
3. Saves to `data/qa-professionals.json`
4. Creates snapshot in `data/snapshots/`
5. Logs to `logs/scraper.log`

## Configuration

### Profiles (`config.ts`)

```typescript
{
  id: '1',
  name: 'John Doe',
  linkedinUsername: 'johndoe',
  linkedinUrl: 'https://www.linkedin.com/in/johndoe/',
  enabled: true,
}
```

### Settings (`config.ts`)

```typescript
headless: true,              // Show browser?
timeout: 30000,              // Timeout (ms)
delayBetweenProfiles: 5000,  // Delay (ms)
maxRetries: 3,               // Retry count
```

### Schedule (`config.ts`)

```typescript
enabled: true,
cronExpression: '0 0 * * 0',  // Every Sunday at midnight
timezone: 'America/Sao_Paulo',
```

## Output

### Main Data File

`data/qa-professionals.json` - Used by website

### Snapshots

`data/snapshots/` - Historical data (last 50 runs)

### Logs

`logs/scraper.log` - Detailed logs
`logs/screenshots/` - Error screenshots

## Troubleshooting

### Can't extract follower count

- LinkedIn changed HTML structure
- Update selectors in `linkedin-scraper.ts`

### Getting blocked

- Increase delays
- Use separate account
- Reduce frequency

### Crashes or hangs

- Check logs: `tail -f logs/scraper.log`
- View screenshots: `logs/screenshots/`
- Run test: `npm run scrape:test`

## Alternatives

Instead of scraping, consider:

- **PhantomBuster** (~$30/month) - https://phantombuster.com
- **Apify** (~$49/month) - https://apify.com
- **Bright Data** (Enterprise) - https://brightdata.com
- **Manual updates** - Safest option

## Best Practices

1. ✅ Use separate LinkedIn account
2. ✅ Respect rate limits (5-10s delays)
3. ✅ Run weekly, not daily
4. ✅ Monitor logs regularly
5. ✅ Keep backups
6. ❌ Don't scrape personal account
7. ❌ Don't run too frequently
8. ❌ Don't scrape private data

## Support

Read the full guide: [SCRAPER_GUIDE.md](../../docs/SCRAPER_GUIDE.md)
