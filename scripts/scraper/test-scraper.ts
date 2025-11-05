#!/usr/bin/env node

import { LinkedInScraper } from './linkedin-scraper';
import { PROFILES_TO_MONITOR } from './config';
import { log, error as logError } from './logger';

/**
 * Test scraper with a single profile
 */
async function testScraper(): Promise<void> {
  log('='.repeat(60));
  log('LinkedIn Scraper Test');
  log('='.repeat(60));

  const testProfile = PROFILES_TO_MONITOR.find(p => p.enabled);

  if (!testProfile) {
    logError('No enabled profiles found in config');
    process.exit(1);
  }

  log(`Testing with profile: ${testProfile.name}`);
  log(`URL: ${testProfile.linkedinUrl}`);
  log('');

  const scraper = new LinkedInScraper({
    headless: false, // Show browser for testing
    timeout: 30000,
    maxRetries: 1,
  });

  try {
    await scraper.init();

    log('Browser opened. Scraping...\n');

    const result = await scraper.scrapeProfile(testProfile);

    log('\n' + '='.repeat(60));
    log('Test Result');
    log('='.repeat(60));
    log(`Success: ${result.success}`);
    log(`Name: ${result.name}`);
    log(`Followers: ${result.followers.toLocaleString()}`);
    log(`Profile Picture: ${result.profilePicture || 'N/A'}`);
    log(`Location: ${result.location?.country || 'N/A'}`);
    log(`Title: ${result.title || 'N/A'}`);
    log(`Company: ${result.company || 'N/A'}`);
    log(`Scraped At: ${result.scrapedAt}`);

    if (!result.success) {
      log(`Error: ${result.error}`);
    }

    log('='.repeat(60));

    await scraper.close();

    process.exit(result.success ? 0 : 1);
  } catch (err) {
    logError(`Test failed: ${err}`);
    await scraper.close();
    process.exit(1);
  }
}

// Run test
testScraper();
