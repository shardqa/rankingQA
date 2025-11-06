#!/usr/bin/env node

/**
 * Weekly Monitoring System
 *
 * Runs automatically every week to:
 * 1. Check follower counts of all profiles
 * 2. Calculate ranking changes
 * 3. Update main data file
 * 4. Generate report
 *
 * This is LESS AGGRESSIVE than full scraping:
 * - Only monitors known profiles (no discovery)
 * - Long delays between requests (60-120s)
 * - Runs only once per week
 * - Respects rate limits
 */

import { LinkedInScraper } from '../scraper/linkedin-scraper';
import { SEED_PROFILES, getEnabledProfiles } from '../scraper/seed-profiles';
import { ScrapingResult, ScrapedProfile } from '../scraper/types';
import { log, error as logError, warn } from '../scraper/logger';
import { saveSnapshot, updateMainDataFile, getLatestSnapshot } from '../scraper/data-storage';

/**
 * Weekly monitoring configuration
 */
const WEEKLY_CONFIG = {
  // Very long delays to avoid detection
  delayBetweenProfiles: 90000, // 90 seconds (1.5 minutes)
  randomDelay: true, // Add 0-60s random
  maxRetries: 2, // Less retries
  timeout: 45000, // 45 seconds
  headless: true,

  // Monitoring-specific
  skipOnError: true, // Continue even if one profile fails
  notifyOnChanges: true, // Generate change report
  minChangeThreshold: 100, // Only report changes > 100 followers
};

/**
 * Run weekly monitoring
 */
async function runWeeklyMonitoring(): Promise<void> {
  const startTime = Date.now();

  log('='.repeat(70));
  log('🔄 WEEKLY MONITORING - Automatic Profile Update');
  log('='.repeat(70));
  log(`Started: ${new Date().toISOString()}`);
  log('');

  // Get profiles to monitor
  const profiles = getEnabledProfiles();

  log(`📊 Profiles to monitor: ${profiles.length}`);
  log(`⏱️  Estimated duration: ~${Math.ceil((profiles.length * WEEKLY_CONFIG.delayBetweenProfiles) / 60000)} minutes`);
  log(`🕐 Delay between profiles: ${WEEKLY_CONFIG.delayBetweenProfiles / 1000}s`);
  log('');

  // Get previous snapshot for comparison
  const previousSnapshot = getLatestSnapshot();
  const previousData = new Map(
    previousSnapshot?.professionals?.map((p: any) => [p.id, p]) || []
  );

  log(`📈 Previous snapshot: ${previousSnapshot ? previousSnapshot.date : 'None'}`);
  log('');

  // Initialize scraper with monitoring config
  const scraper = new LinkedInScraper({
    headless: WEEKLY_CONFIG.headless,
    timeout: WEEKLY_CONFIG.timeout,
    maxRetries: WEEKLY_CONFIG.maxRetries,
    delayBetweenProfiles: WEEKLY_CONFIG.delayBetweenProfiles,
    screenshotOnError: true,
  });

  const scrapedProfiles: ScrapedProfile[] = [];
  const errors: any[] = [];
  let successCount = 0;
  let failureCount = 0;

  try {
    await scraper.init();

    // Monitor each profile
    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];
      const prevData = previousData.get(profile.id);

      log(`[${i + 1}/${profiles.length}] 🔍 Monitoring: ${profile.name}`);

      if (prevData) {
        log(`  Previous: ${prevData.followers.toLocaleString()} followers`);
      }

      try {
        const result = await scraper.scrapeProfile(profile);
        scrapedProfiles.push(result);

        if (result.success) {
          successCount++;

          // Calculate change
          const change = prevData ? result.followers - prevData.followers : 0;
          const changePercent = prevData
            ? ((change / prevData.followers) * 100).toFixed(1)
            : 0;

          if (Math.abs(change) >= WEEKLY_CONFIG.minChangeThreshold) {
            if (change > 0) {
              log(`  ✅ Current: ${result.followers.toLocaleString()} (+${change.toLocaleString()} / +${changePercent}%)`);
            } else {
              log(`  ⚠️  Current: ${result.followers.toLocaleString()} (${change.toLocaleString()} / ${changePercent}%)`);
            }
          } else {
            log(`  ✓ Current: ${result.followers.toLocaleString()} (${change >= 0 ? '+' : ''}${change})`);
          }
        } else {
          failureCount++;
          logError(`  ✗ Failed: ${result.error}`);

          if (!WEEKLY_CONFIG.skipOnError) {
            throw new Error(`Failed to scrape ${profile.name}`);
          }
        }
      } catch (err) {
        failureCount++;
        const error = err as Error;
        logError(`  ✗ Error: ${error.message}`);

        errors.push({
          profileId: profile.id,
          profileName: profile.name,
          error: error.message,
          timestamp: new Date().toISOString(),
        });

        // Use previous data if available
        if (prevData && WEEKLY_CONFIG.skipOnError) {
          warn(`  ⚠️  Using previous data for ${profile.name}`);
          scrapedProfiles.push({
            ...prevData,
            scrapedAt: new Date().toISOString(),
            success: false,
            error: 'Failed to update, using previous data',
          });
        }

        if (!WEEKLY_CONFIG.skipOnError) {
          throw err;
        }
      }

      // Delay before next profile (except last one)
      if (i < profiles.length - 1) {
        const delay = WEEKLY_CONFIG.delayBetweenProfiles;
        const randomExtra = WEEKLY_CONFIG.randomDelay
          ? Math.floor(Math.random() * 60000) // 0-60s
          : 0;
        const totalDelay = delay + randomExtra;

        log(`  ⏳ Waiting ${Math.ceil(totalDelay / 1000)}s before next profile...`);
        log('');
        await new Promise(resolve => setTimeout(resolve, totalDelay));
      }
    }
  } finally {
    await scraper.close();
  }

  // Calculate results
  const endTime = Date.now();
  const duration = endTime - startTime;

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
  log('');
  log('='.repeat(70));
  log('💾 Saving results...');
  log('');

  try {
    saveSnapshot(result);

    if (successCount > 0) {
      updateMainDataFile(result);
      log('✅ Main data file updated');
    } else {
      logError('❌ No successful scrapes - main file not updated');
    }

    // Generate change report
    if (WEEKLY_CONFIG.notifyOnChanges && previousSnapshot) {
      generateChangeReport(scrapedProfiles, previousData);
    }

  } catch (err) {
    logError(`Failed to save results: ${err}`);
  }

  // Print summary
  log('');
  log('='.repeat(70));
  log('📊 WEEKLY MONITORING COMPLETE');
  log('='.repeat(70));
  log(`Total profiles: ${result.totalProfiles}`);
  log(`✅ Successful: ${result.successCount} (${Math.round((result.successCount / result.totalProfiles) * 100)}%)`);
  log(`❌ Failed: ${result.failureCount}`);
  log(`⏱️  Duration: ${Math.round(duration / 60000)} minutes`);
  log(`📅 Next run: ${getNextRunDate()}`);
  log('='.repeat(70));

  // Exit with appropriate code
  const exitCode = failureCount === profiles.length ? 1 : 0;
  process.exit(exitCode);
}

/**
 * Generate change report
 */
function generateChangeReport(
  current: ScrapedProfile[],
  previous: Map<string, any>
): void {
  log('');
  log('='.repeat(70));
  log('📈 CHANGE REPORT - Notable Changes This Week');
  log('='.repeat(70));
  log('');

  const changes: Array<{
    name: string;
    previous: number;
    current: number;
    change: number;
    changePercent: number;
  }> = [];

  current.forEach(profile => {
    if (!profile.success) return;

    const prev = previous.get(profile.id);
    if (!prev) return;

    const change = profile.followers - prev.followers;
    const changePercent = ((change / prev.followers) * 100);

    if (Math.abs(change) >= WEEKLY_CONFIG.minChangeThreshold) {
      changes.push({
        name: profile.name,
        previous: prev.followers,
        current: profile.followers,
        change,
        changePercent,
      });
    }
  });

  if (changes.length === 0) {
    log('No significant changes this week (threshold: ±100 followers)');
    log('');
    return;
  }

  // Sort by absolute change
  changes.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  changes.forEach((c, index) => {
    const emoji = c.change > 0 ? '📈' : '📉';
    const sign = c.change > 0 ? '+' : '';

    log(`${index + 1}. ${emoji} ${c.name}`);
    log(`   ${c.previous.toLocaleString()} → ${c.current.toLocaleString()}`);
    log(`   ${sign}${c.change.toLocaleString()} (${sign}${c.changePercent.toFixed(2)}%)`);
    log('');
  });

  log('='.repeat(70));
}

/**
 * Get next scheduled run date
 */
function getNextRunDate(): string {
  const next = new Date();
  next.setDate(next.getDate() + 7); // Next week
  return next.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Run monitoring
runWeeklyMonitoring().catch(err => {
  logError(`Fatal error: ${err}`);
  process.exit(1);
});
