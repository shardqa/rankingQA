#!/usr/bin/env node

/**
 * Test: Can we scrape LinkedIn follower counts WITHOUT being logged in?
 *
 * This script tests if LinkedIn shows follower counts on public profiles
 * when accessing without authentication.
 */

import puppeteer from 'puppeteer';

async function testLinkedInPublicAccess() {
  console.log('='.repeat(70));
  console.log('🧪 TESTING: LinkedIn Public Access (No Login)');
  console.log('='.repeat(70));
  console.log('');

  const testProfiles = [
    {
      name: 'Angie Jones',
      url: 'https://www.linkedin.com/in/angiejones/',
    },
    {
      name: 'Joe Colantonio',
      url: 'https://www.linkedin.com/in/joecolantonio/',
    },
  ];

  const browser = await puppeteer.launch({
    headless: false, // Show browser so you can see what happens
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Set realistic user agent
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  for (const profile of testProfiles) {
    console.log(`\n📍 Testing: ${profile.name}`);
    console.log(`   URL: ${profile.url}`);
    console.log('');

    try {
      // Navigate to profile
      console.log('   → Navigating...');
      await page.goto(profile.url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      await page.waitForTimeout(3000);

      // Check if we hit the authwall
      const currentUrl = page.url();
      console.log(`   → Current URL: ${currentUrl}`);

      if (currentUrl.includes('/authwall')) {
        console.log('   ❌ BLOCKED: LinkedIn redirected to authwall (login required)');
        console.log('');
        continue;
      }

      // Try to find follower count
      console.log('   → Looking for follower count...');

      // Strategy 1: Look for text containing "followers"
      const pageText = await page.evaluate(() => document.body.innerText);

      const followerMatch = pageText.match(/(\d[\d,\.]*)\s*(followers?|seguidores?)/i);

      if (followerMatch) {
        console.log(`   ✅ FOUND: ${followerMatch[0]}`);
        console.log('   → Follower count IS visible without login!');
      } else {
        console.log('   ❌ NOT FOUND: Follower count not visible without login');

        // Check what we CAN see
        const visibleInfo = await page.evaluate(() => {
          const name = document.querySelector('h1')?.textContent?.trim();
          const headline = document.querySelector('.top-card-layout__headline')?.textContent?.trim();

          return {
            name: name || 'Not visible',
            headline: headline || 'Not visible',
          };
        });

        console.log('   → What we CAN see:');
        console.log(`      Name: ${visibleInfo.name}`);
        console.log(`      Headline: ${visibleInfo.headline}`);
      }

      // Take screenshot
      const screenshotPath = `./test-${profile.name.replace(/\s+/g, '-')}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`   → Screenshot saved: ${screenshotPath}`);

    } catch (error) {
      console.log(`   ❌ ERROR: ${(error as Error).message}`);
    }

    console.log('');
    console.log('   ⏳ Waiting 5 seconds before next test...');
    await page.waitForTimeout(5000);
  }

  console.log('='.repeat(70));
  console.log('🏁 TEST COMPLETE');
  console.log('='.repeat(70));
  console.log('');
  console.log('Conclusion:');
  console.log('- If you saw follower counts: ✅ Scraping without login is possible');
  console.log('- If redirected to /authwall: ❌ LinkedIn requires login');
  console.log('- If you saw profile but no followers: ⚠️ Partial data only');
  console.log('');
  console.log('Press Ctrl+C to close browser and exit...');

  // Keep browser open for manual inspection
  await new Promise(() => {}); // Never resolves, keeps browser open
}

testLinkedInPublicAccess().catch(console.error);
