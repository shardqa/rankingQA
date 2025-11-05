/**
 * Configuration for LinkedIn profile scraping
 * Add LinkedIn profile URLs here to monitor their follower counts
 */

export interface ProfileConfig {
  id: string;
  name: string;
  linkedinUsername: string; // e.g., "angiejones" from linkedin.com/in/angiejones
  linkedinUrl: string;
  location?: {
    country: string;
    countryCode: string;
    state?: string;
    stateCode?: string;
  };
  title?: string;
  company?: string;
  enabled: boolean; // Set to false to temporarily skip scraping
}

/**
 * Profiles to monitor
 *
 * To add a new profile:
 * 1. Get LinkedIn username from URL (e.g., linkedin.com/in/USERNAME)
 * 2. Add new entry with unique ID
 * 3. Fill in basic info (name, location)
 * 4. Run: npm run scrape
 */
export const PROFILES_TO_MONITOR: ProfileConfig[] = [
  {
    id: '1',
    name: 'Angie Jones',
    linkedinUsername: 'angiejones',
    linkedinUrl: 'https://www.linkedin.com/in/angiejones/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'VP of Developer Relations',
    company: 'TBD',
    enabled: true,
  },
  {
    id: '2',
    name: 'Bas Dijkstra',
    linkedinUsername: 'basdijkstra',
    linkedinUrl: 'https://www.linkedin.com/in/basdijkstra/',
    location: {
      country: 'Netherlands',
      countryCode: 'NL',
    },
    title: 'Test Automation Consultant',
    company: 'Self-employed',
    enabled: true,
  },
  {
    id: '3',
    name: 'Júlio de Lima',
    linkedinUsername: 'juliodelimaqa',
    linkedinUrl: 'https://www.linkedin.com/in/juliodelimaqa/',
    location: {
      country: 'Brazil',
      countryCode: 'BR',
      state: 'São Paulo',
      stateCode: 'SP',
    },
    title: 'QA Consultant',
    company: 'Iterasys',
    enabled: true,
  },
  {
    id: '4',
    name: 'Nikolay Advolodkin',
    linkedinUsername: 'nikolayadvolodkin',
    linkedinUrl: 'https://www.linkedin.com/in/nikolayadvolodkin/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'Founder & CEO',
    company: 'Ultimate QA',
    enabled: true,
  },
  {
    id: '5',
    name: 'Joe Colantonio',
    linkedinUsername: 'joecolantonio',
    linkedinUrl: 'https://www.linkedin.com/in/joecolantonio/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'Test Automation & Performance Testing Expert',
    company: 'Test Guild',
    enabled: true,
  },
];

/**
 * Scraping configuration
 */
export const SCRAPER_CONFIG = {
  // Browser settings
  headless: true, // Set to false for debugging
  timeout: 30000, // 30 seconds

  // Rate limiting (to avoid being blocked)
  delayBetweenProfiles: 5000, // 5 seconds between each profile
  randomizeDelay: true, // Add random delay (more human-like)

  // Retry settings
  maxRetries: 3,
  retryDelay: 10000, // 10 seconds

  // User agent (appears more human)
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',

  // Screenshot on error (for debugging)
  screenshotOnError: true,
  screenshotPath: './logs/screenshots',
};

/**
 * Schedule configuration (cron format)
 * Examples:
 * - '0 0 * * *' = Every day at midnight
 * - '0 0 * * 0' = Every Sunday at midnight
 * - '0 0 1 * *' = First day of every month at midnight
 * - '0 */6 * * *' = Every 6 hours
 */
export const SCHEDULE_CONFIG = {
  enabled: false, // Set to true to enable scheduled scraping
  cronExpression: '0 0 * * 0', // Every Sunday at midnight
  timezone: 'America/Sao_Paulo', // Your timezone
};
