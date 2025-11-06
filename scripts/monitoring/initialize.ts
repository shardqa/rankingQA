#!/usr/bin/env node

/**
 * Initialize Monitoring System
 *
 * This script helps you set up the initial follower counts for all profiles.
 *
 * Two modes:
 * 1. MANUAL: You provide follower counts via CSV
 * 2. AUTO: Attempts to scrape (may fail due to LinkedIn restrictions)
 *
 * RECOMMENDED: Use MANUAL mode
 *
 * Usage:
 *   npm run monitor:init
 */

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import { SEED_PROFILES, getEnabledProfiles } from '../scraper/seed-profiles';
import { log, error as logError } from '../scraper/logger';
import { updateMainDataFile } from '../scraper/data-storage';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

/**
 * Manual initialization
 */
async function manualInitialization(): Promise<void> {
  log('');
  log('='.repeat(70));
  log('📝 MANUAL INITIALIZATION');
  log('='.repeat(70));
  log('');
  log('You will need to visit each LinkedIn profile and note the follower count.');
  log('');
  log('Steps:');
  log('1. Open LinkedIn profile in browser');
  log('2. Note the follower count');
  log('3. Enter it when prompted');
  log('');
  log('Let\'s start!');
  log('');

  const profiles = getEnabledProfiles();
  const data: any[] = [];

  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i];

    log(`[${i + 1}/${profiles.length}] ${profile.name}`);
    log(`   URL: ${profile.linkedinUrl}`);

    const followersInput = await question('   Followers: ');

    // Parse input (handle K, M, commas)
    let followers = parseInt(followersInput.replace(/[^0-9]/g, ''));

    if (followersInput.toLowerCase().includes('k')) {
      followers = followers * 1000;
    } else if (followersInput.toLowerCase().includes('m')) {
      followers = followers * 1000000;
    }

    if (isNaN(followers) || followers <= 0) {
      logError('   Invalid input. Using 0 (you can update later)');
      followers = 0;
    }

    log(`   ✓ Recorded: ${followers.toLocaleString()} followers`);
    log('');

    data.push({
      ...profile,
      followers,
      lastUpdated: new Date().toISOString(),
      success: true,
    });
  }

  // Save data
  const result = {
    timestamp: new Date().toISOString(),
    totalProfiles: data.length,
    successCount: data.length,
    failureCount: 0,
    profiles: data,
    duration: 0,
    errors: [],
  };

  updateMainDataFile(result);

  log('');
  log('='.repeat(70));
  log('✅ INITIALIZATION COMPLETE');
  log('='.repeat(70));
  log(`Total profiles initialized: ${data.length}`);
  log('Data saved to: data/qa-professionals.json');
  log('');
  log('Next steps:');
  log('1. Verify data: npm run dev');
  log('2. Set up scheduler: npm run monitor:schedule');
  log('');

  rl.close();
}

/**
 * CSV initialization
 */
async function csvInitialization(): Promise<void> {
  log('');
  log('='.repeat(70));
  log('📂 CSV INITIALIZATION');
  log('='.repeat(70));
  log('');

  const csvPath = await question('Enter path to CSV file: ');

  if (!fs.existsSync(csvPath)) {
    logError(`File not found: ${csvPath}`);
    rl.close();
    process.exit(1);
  }

  log('Reading CSV...');

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(l => l.trim());

  if (lines.length === 0) {
    logError('CSV file is empty');
    rl.close();
    process.exit(1);
  }

  // Parse CSV (expecting: id,followers)
  const followerData = new Map<string, number>();

  lines.forEach((line, index) => {
    if (index === 0) return; // Skip header

    const [id, followersStr] = line.split(',').map(s => s.trim());

    if (!id || !followersStr) {
      log(`  Warning: Skipping invalid line ${index + 1}: ${line}`);
      return;
    }

    let followers = parseInt(followersStr.replace(/[^0-9]/g, ''));

    if (followersStr.toLowerCase().includes('k')) {
      followers = followers * 1000;
    } else if (followersStr.toLowerCase().includes('m')) {
      followers = followers * 1000000;
    }

    if (!isNaN(followers) && followers > 0) {
      followerData.set(id, followers);
    }
  });

  log(`Parsed ${followerData.size} profiles from CSV`);
  log('');

  // Match with seed profiles
  const profiles = getEnabledProfiles();
  const data: any[] = [];
  let matchedCount = 0;
  let missingCount = 0;

  profiles.forEach(profile => {
    const followers = followerData.get(profile.id);

    if (followers) {
      matchedCount++;
      data.push({
        ...profile,
        followers,
        lastUpdated: new Date().toISOString(),
        success: true,
      });
      log(`✓ ${profile.name}: ${followers.toLocaleString()} followers`);
    } else {
      missingCount++;
      data.push({
        ...profile,
        followers: 0,
        lastUpdated: new Date().toISOString(),
        success: false,
        error: 'Not found in CSV',
      });
      log(`⚠️  ${profile.name}: NOT FOUND in CSV`);
    }
  });

  log('');
  log(`Matched: ${matchedCount} / ${profiles.length}`);
  log(`Missing: ${missingCount}`);
  log('');

  if (missingCount > 0) {
    const proceed = await question('Some profiles are missing. Continue anyway? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      log('Initialization cancelled');
      rl.close();
      process.exit(0);
    }
  }

  // Save data
  const result = {
    timestamp: new Date().toISOString(),
    totalProfiles: data.length,
    successCount: matchedCount,
    failureCount: missingCount,
    profiles: data,
    duration: 0,
    errors: [],
  };

  updateMainDataFile(result);

  log('');
  log('='.repeat(70));
  log('✅ INITIALIZATION COMPLETE');
  log('='.repeat(70));
  log(`Total profiles: ${data.length}`);
  log(`Initialized: ${matchedCount}`);
  log(`Missing: ${missingCount}`);
  log('Data saved to: data/qa-professionals.json');
  log('');

  rl.close();
}

/**
 * Main
 */
async function main(): Promise<void> {
  log('='.repeat(70));
  log('🚀 MONITORING SYSTEM INITIALIZATION');
  log('='.repeat(70));
  log('');
  log('This wizard will help you set up initial follower counts.');
  log('');
  log('Choose initialization method:');
  log('');
  log('1. MANUAL - Enter follower counts one by one (RECOMMENDED)');
  log('2. CSV    - Import from CSV file (faster if you have data)');
  log('3. AUTO   - Attempt to scrape (NOT RECOMMENDED - may fail)');
  log('');

  const choice = await question('Enter choice (1/2/3): ');

  switch (choice.trim()) {
    case '1':
      await manualInitialization();
      break;
    case '2':
      await csvInitialization();
      break;
    case '3':
      log('');
      log('⚠️  AUTO scraping is not recommended due to LinkedIn restrictions.');
      log('   It may fail or get your account flagged.');
      log('');
      log('Please use MANUAL (1) or CSV (2) method instead.');
      rl.close();
      break;
    default:
      logError('Invalid choice');
      rl.close();
      process.exit(1);
  }
}

// Run
main();
