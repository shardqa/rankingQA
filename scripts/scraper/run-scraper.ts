#!/usr/bin/env node

import { LinkedInScraper } from './linkedin-scraper';
import { PROFILES_TO_MONITOR, SCRAPER_CONFIG } from './config';
import { ScrapingResult, ScrapedProfile, ScrapingError } from './types';
import { log, error as logError } from './logger';
import { saveSnapshot, updateMainDataFile, cleanOldSnapshots } from './data-storage';

/**
 * Main scraping function
 */
async function runScraper(): Promise<void> {
  const startTime = Date.now();
  log('='.repeat(60));
  log('LinkedIn Scraper Started');
  log('='.repeat(60));

  const scraper = new LinkedInScraper();
  const profiles = PROFILES_TO_MONITOR.filter(p => p.enabled);

  log(`Profiles to scrape: ${profiles.length}`);
  log(`Delay between profiles: ${SCRAPER_CONFIG.delayBetweenProfiles / 1000}s`);
  log(`Max retries per profile: ${SCRAPER_CONFIG.maxRetries}`);
  log('');

  const scrapedProfiles: ScrapedProfile[] = [];
  const errors: ScrapingError[] = [];

  try {
    // Initialize browser
    await scraper.init();

    // Scrape each profile
    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];

      log(`[${i + 1}/${profiles.length}] Processing: ${profile.name}`);

      try {
        const result = await scraper.scrapeProfile(profile);
        scrapedProfiles.push(result);

        if (!result.success) {
          errors.push({
            profileId: profile.id,
            profileName: profile.name,
            error: result.error || 'Unknown error',
            timestamp: result.scrapedAt,
          });
        }
      } catch (err) {
        const error = err as Error;
        logError(`Failed to scrape ${profile.name}: ${error.message}`);

        scrapedProfiles.push({
          id: profile.id,
          name: profile.name,
          linkedinUrl: profile.linkedinUrl,
          followers: 0,
          location: profile.location,
          title: profile.title,
          company: profile.company,
          scrapedAt: new Date().toISOString(),
          success: false,
          error: error.message,
        });

        errors.push({
          profileId: profile.id,
          profileName: profile.name,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }

      // Delay between profiles (except for last one)
      if (i < profiles.length - 1) {
        const delay = SCRAPER_CONFIG.delayBetweenProfiles;
        log(`Waiting ${delay / 1000}s before next profile...\n`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  } finally {
    // Close browser
    await scraper.close();
  }

  // Calculate results
  const endTime = Date.now();
  const duration = endTime - startTime;
  const successCount = scrapedProfiles.filter(p => p.success).length;
  const failureCount = scrapedProfiles.filter(p => !p.success).length;

  const result: ScrapingResult = {
    timestamp: new Date().toISOString(),
    totalProfiles: profiles.length,
    successCount,
    failureCount,
    profiles: scrapedProfiles,
    duration,
    errors,
  };

  // Save results
  log('\n' + '='.repeat(60));
  log('Saving results...');

  try {
    // Save snapshot
    saveSnapshot(result);

    // Update main data file
    if (successCount > 0) {
      updateMainDataFile(result);
    } else {
      logError('No successful scrapes. Main data file not updated.');
    }

    // Clean old snapshots
    cleanOldSnapshots(50);
  } catch (err) {
    logError(`Failed to save results: ${err}`);
  }

  // Print summary
  log('\n' + '='.repeat(60));
  log('Scraping Complete');
  log('='.repeat(60));
  log(`Total profiles: ${result.totalProfiles}`);
  log(`Successful: ${result.successCount} (${Math.round((result.successCount / result.totalProfiles) * 100)}%)`);
  log(`Failed: ${result.failureCount}`);
  log(`Duration: ${Math.round(duration / 1000)}s`);

  if (errors.length > 0) {
    log('\nErrors:');
    errors.forEach(err => {
      log(`  - ${err.profileName}: ${err.error}`);
    });
  }

  log('='.repeat(60));

  // Exit with appropriate code
  process.exit(failureCount === profiles.length ? 1 : 0);
}

// Run scraper
runScraper().catch(err => {
  logError(`Fatal error: ${err}`);
  process.exit(1);
});
