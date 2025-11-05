import puppeteer, { Browser, Page } from 'puppeteer';
import { ScrapedProfile, ScraperOptions, LinkedInSelectors } from './types';
import { ProfileConfig, SCRAPER_CONFIG } from './config';
import { log, error as logError } from './logger';
import * as fs from 'fs';
import * as path from 'path';

/**
 * LinkedIn Selectors
 * Note: These may change as LinkedIn updates their UI
 * Update these if scraping stops working
 */
const LINKEDIN_SELECTORS: LinkedInSelectors = {
  // Try multiple selectors (LinkedIn often changes these)
  followerCount: [
    'span.text-body-small:has-text("followers")',
    '.pv-recent-activity-section__follower-count',
    '[data-test-id="follower-count"]',
    'span:has-text("followers")',
    '.pvs-header__subtitle .text-body-small',
  ],
  profilePicture: [
    'img.pv-top-card-profile-picture__image',
    'img[data-test-id="profile-photo"]',
    '.pv-top-card__photo img',
  ],
  name: [
    'h1.text-heading-xlarge',
    '.pv-top-card--list li:first-child',
    '[data-test-id="profile-name"]',
  ],
  title: [
    '.text-body-medium.break-words',
    '.pv-top-card--list li:nth-child(2)',
  ],
  location: [
    '.text-body-small.inline.t-black--light.break-words',
    '.pv-top-card--list-bullet li',
  ],
};

/**
 * LinkedIn Profile Scraper
 */
export class LinkedInScraper {
  private browser: Browser | null = null;
  private options: Required<ScraperOptions>;

  constructor(options: ScraperOptions = {}) {
    this.options = {
      headless: options.headless ?? SCRAPER_CONFIG.headless,
      timeout: options.timeout ?? SCRAPER_CONFIG.timeout,
      maxRetries: options.maxRetries ?? SCRAPER_CONFIG.maxRetries,
      delayBetweenProfiles: options.delayBetweenProfiles ?? SCRAPER_CONFIG.delayBetweenProfiles,
      screenshotOnError: options.screenshotOnError ?? SCRAPER_CONFIG.screenshotOnError,
    };
  }

  /**
   * Initialize browser
   */
  async init(): Promise<void> {
    log('Initializing browser...');

    this.browser = await puppeteer.launch({
      headless: this.options.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    });

    log('Browser initialized');
  }

  /**
   * Close browser
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      log('Browser closed');
    }
  }

  /**
   * Scrape a single LinkedIn profile
   */
  async scrapeProfile(profile: ProfileConfig): Promise<ScrapedProfile> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call init() first.');
    }

    log(`Scraping profile: ${profile.name} (${profile.linkedinUrl})`);

    let retries = 0;
    let lastError: Error | null = null;

    while (retries < this.options.maxRetries) {
      try {
        const result = await this._scrapeProfileAttempt(profile);
        log(`✓ Successfully scraped: ${profile.name} - ${result.followers} followers`);
        return result;
      } catch (err) {
        lastError = err as Error;
        retries++;
        logError(`Attempt ${retries}/${this.options.maxRetries} failed for ${profile.name}: ${lastError.message}`);

        if (retries < this.options.maxRetries) {
          const delay = SCRAPER_CONFIG.retryDelay * retries;
          log(`Retrying in ${delay / 1000} seconds...`);
          await this.delay(delay);
        }
      }
    }

    // All retries failed
    logError(`✗ Failed to scrape ${profile.name} after ${this.options.maxRetries} attempts`);

    return {
      id: profile.id,
      name: profile.name,
      linkedinUrl: profile.linkedinUrl,
      followers: 0,
      location: profile.location,
      title: profile.title,
      company: profile.company,
      scrapedAt: new Date().toISOString(),
      success: false,
      error: lastError?.message || 'Unknown error',
    };
  }

  /**
   * Single scraping attempt
   */
  private async _scrapeProfileAttempt(profile: ProfileConfig): Promise<ScrapedProfile> {
    const page = await this.browser!.newPage();

    try {
      // Set user agent
      await page.setUserAgent(SCRAPER_CONFIG.userAgent);

      // Set viewport
      await page.setViewport({ width: 1920, height: 1080 });

      // Navigate to profile
      log(`  → Navigating to ${profile.linkedinUrl}`);
      await page.goto(profile.linkedinUrl, {
        waitUntil: 'networkidle2',
        timeout: this.options.timeout,
      });

      // Wait a bit for dynamic content
      await this.delay(2000);

      // Extract follower count
      const followers = await this.extractFollowerCount(page);

      // Extract profile picture (optional)
      const profilePicture = await this.extractProfilePicture(page);

      log(`  → Extracted: ${followers} followers`);

      return {
        id: profile.id,
        name: profile.name,
        linkedinUrl: profile.linkedinUrl,
        followers,
        profilePicture,
        location: profile.location,
        title: profile.title,
        company: profile.company,
        scrapedAt: new Date().toISOString(),
        success: true,
      };
    } catch (err) {
      const error = err as Error;

      // Take screenshot on error if enabled
      if (this.options.screenshotOnError) {
        await this.saveErrorScreenshot(page, profile.id);
      }

      throw error;
    } finally {
      await page.close();
    }
  }

  /**
   * Extract follower count from page
   */
  private async extractFollowerCount(page: Page): Promise<number> {
    // Try multiple strategies to find follower count
    const strategies = [
      // Strategy 1: Look for text containing "followers" or "seguidores"
      async () => {
        const text = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('span, div'));
          const followerElement = elements.find(el => {
            const text = el.textContent?.toLowerCase() || '';
            return text.includes('followers') || text.includes('seguidores');
          });
          return followerElement?.textContent || null;
        });

        if (text) {
          return this.parseFollowerCount(text);
        }
        return null;
      },

      // Strategy 2: Look in specific sections
      async () => {
        const text = await page.evaluate(() => {
          // Look in the top card area
          const topCard = document.querySelector('.pv-top-card');
          if (topCard) {
            const elements = Array.from(topCard.querySelectorAll('span'));
            const followerElement = elements.find(el => {
              const text = el.textContent?.toLowerCase() || '';
              return text.includes('followers') || text.includes('seguidores');
            });
            return followerElement?.textContent || null;
          }
          return null;
        });

        if (text) {
          return this.parseFollowerCount(text);
        }
        return null;
      },

      // Strategy 3: Look for numbers near "followers" text
      async () => {
        const text = await page.evaluate(() => {
          const bodyText = document.body.innerText;
          const match = bodyText.match(/(\d[\d,\.]*)\s*(followers|seguidores)/i);
          return match ? match[0] : null;
        });

        if (text) {
          return this.parseFollowerCount(text);
        }
        return null;
      },
    ];

    // Try each strategy
    for (const strategy of strategies) {
      const result = await strategy();
      if (result !== null && result > 0) {
        return result;
      }
    }

    throw new Error('Could not extract follower count from page');
  }

  /**
   * Parse follower count from text
   * Examples: "10,234 followers" -> 10234
   *           "10.5K followers" -> 10500
   *           "1.2M followers" -> 1200000
   */
  private parseFollowerCount(text: string): number {
    // Remove everything except numbers, dots, commas, K, M
    const cleaned = text.replace(/[^\d.,KMkm]/g, '');

    // Handle K (thousands) and M (millions)
    if (cleaned.includes('K') || cleaned.includes('k')) {
      const num = parseFloat(cleaned.replace(/[Kk,]/g, ''));
      return Math.round(num * 1000);
    }

    if (cleaned.includes('M') || cleaned.includes('m')) {
      const num = parseFloat(cleaned.replace(/[Mm,]/g, ''));
      return Math.round(num * 1000000);
    }

    // Remove commas and parse
    const num = parseInt(cleaned.replace(/[,\.]/g, ''), 10);

    if (isNaN(num)) {
      throw new Error(`Could not parse follower count from: ${text}`);
    }

    return num;
  }

  /**
   * Extract profile picture URL
   */
  private async extractProfilePicture(page: Page): Promise<string | undefined> {
    try {
      const imageUrl = await page.evaluate(() => {
        const img = document.querySelector('img[class*="profile"]');
        return img?.getAttribute('src') || null;
      });

      return imageUrl || undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Save screenshot on error
   */
  private async saveErrorScreenshot(page: Page, profileId: string): Promise<void> {
    try {
      const screenshotDir = path.resolve(SCRAPER_CONFIG.screenshotPath);

      // Create directory if it doesn't exist
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      const filename = `error_${profileId}_${Date.now()}.png`;
      const filepath = path.join(screenshotDir, filename);

      await page.screenshot({ path: filepath, fullPage: true });
      log(`  → Screenshot saved: ${filepath}`);
    } catch (err) {
      logError(`Failed to save screenshot: ${err}`);
    }
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    // Add random variation if enabled
    if (SCRAPER_CONFIG.randomizeDelay) {
      const randomMs = ms + Math.random() * 2000; // Add 0-2 seconds
      return new Promise(resolve => setTimeout(resolve, randomMs));
    }
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
