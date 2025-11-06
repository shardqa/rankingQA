#!/usr/bin/env node

/**
 * Test: Can we scrape LinkedIn follower counts WITHOUT being logged in?
 *
 * This script tests if LinkedIn shows follower counts on public profiles
 * when accessing without authentication using HTTP requests.
 *
 * Usage:
 *   npm run test:linkedin          # Normal mode (makes real HTTP requests)
 *   npm run test:linkedin -- --mock # Mock mode (tests parsing logic with sample HTML)
 */

import https from 'https';
import { URL } from 'url';
import { execSync } from 'child_process';

// Mock HTML samples for testing the parsing logic
const MOCK_HTML_SAMPLES = {
  'angiejones': `
    <html>
      <head><title>Angie Jones | LinkedIn</title></head>
      <body>
        <h1>Angie Jones</h1>
        <div class="profile-info">
          <span>Senior Director, Developer Relations at Block</span>
          <span class="follower-count">156,789 followers</span>
        </div>
      </body>
    </html>
  `,
  'joecolantonio': `
    <html>
      <head><title>Joe Colantonio | LinkedIn</title></head>
      <body>
        <h1>Joe Colantonio</h1>
        <div class="profile-info">
          <span>Founder at TestGuild</span>
          <span>89,234 followers</span>
        </div>
      </body>
    </html>
  `,
};

function fetchHtmlViaCurl(url: string): string {
  try {
    const command = `curl -s '${url}' \\
      -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \\
      -H 'accept-language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7' \\
      -H 'sec-ch-ua: "Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"' \\
      -H 'sec-ch-ua-mobile: ?0' \\
      -H 'sec-ch-ua-platform: "Linux"' \\
      -H 'sec-fetch-dest: document' \\
      -H 'sec-fetch-mode: navigate' \\
      -H 'sec-fetch-site: none' \\
      -H 'sec-fetch-user: ?1' \\
      -H 'upgrade-insecure-requests: 1' \\
      -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'`;

    const html = execSync(command, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
    return html;
  } catch (error) {
    throw new Error(`Failed to fetch via curl: ${(error as Error).message}`);
  }
}

function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400) {
          // Handle redirects
          const location = res.headers.location;
          if (location) {
            console.log(`   → Redirected to: ${location}`);
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testLinkedInPublicAccess() {
  const useMock = process.argv.includes('--mock');
  const useCurl = process.argv.includes('--curl');

  console.log('='.repeat(70));
  console.log('🧪 TESTING: LinkedIn Public Access (No Login) - HTTP Method');
  if (useMock) {
    console.log('📦 MODE: Mock (testing parsing logic with sample HTML)');
  } else if (useCurl) {
    console.log('🔧 MODE: cURL (using system curl command)');
  } else {
    console.log('🌐 MODE: HTTPS (using Node.js https module)');
  }
  console.log('='.repeat(70));
  console.log('');

  const testProfiles = [
    {
      name: 'Angie Jones',
      url: 'https://www.linkedin.com/in/angiejones/',
      mockKey: 'angiejones',
    },
    {
      name: 'Joe Colantonio',
      url: 'https://www.linkedin.com/in/joecolantonio/',
      mockKey: 'joecolantonio',
    },
    {
      name: 'Test QA',
      url: 'https://www.linkedin.com/in/testqa/',
      mockKey: 'testqa',
    },
  ];

  for (const profile of testProfiles) {
    console.log(`\n📍 Testing: ${profile.name}`);
    console.log(`   URL: ${profile.url}`);
    console.log('');

    try {
      let html: string;

      if (useMock) {
        console.log('   → Using mock HTML...');
        html = MOCK_HTML_SAMPLES[profile.mockKey as keyof typeof MOCK_HTML_SAMPLES] ||
               '<html><body>No mock data available</body></html>';
      } else if (useCurl) {
        console.log('   → Fetching HTML via curl...');
        html = fetchHtmlViaCurl(profile.url);
      } else {
        console.log('   → Fetching HTML via Node HTTPS...');
        html = await fetchHtml(profile.url);
      }

      console.log(`   → HTML fetched (${html.length} bytes)`);

      // Check if we hit the authwall by looking at redirect or content
      if (html.includes('authwall') || html.includes('Sign in to LinkedIn')) {
        console.log('   ❌ BLOCKED: LinkedIn requires authentication');
        console.log('');
        continue;
      }

      // Try to find follower count in HTML
      console.log('   → Looking for follower count in HTML...');

      // Multiple patterns to match follower count
      const patterns = [
        // Pattern 1: "1,234 followers" or "1.234 seguidores"
        /(\d[\d,\.]*)\s*(followers?|seguidores?)/i,
        // Pattern 2: follower count in meta tags
        /followerCount["\s:]+(\d+)/i,
        // Pattern 3: in JSON-LD or structured data
        /"follower.*?(\d[\d,\.]+)/i,
      ];

      let found = false;
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) {
          console.log(`   ✅ FOUND: ${match[0]}`);
          console.log(`   → Raw match: "${match[1]}" followers`);
          console.log('   → Follower count IS visible without login!');
          found = true;
          break;
        }
      }

      if (!found) {
        console.log('   ❌ NOT FOUND: Follower count not visible in HTML');

        // Save HTML to file for debugging
        const fs = require('fs');
        const filename = `debug-${profile.mockKey}-${Date.now()}.html`;
        fs.writeFileSync(filename, html);
        console.log(`   → Full HTML saved to: ${filename}`);

        // Show a larger sample of the HTML for debugging
        const sample = html.substring(0, 3000).replace(/\s+/g, ' ');
        console.log('   → HTML sample (first 500 chars):', sample.substring(0, 500) + '...');

        // Try to find any text that might contain follower info
        const followerSearch = html.match(/.{0,100}(follower|seguidor).{0,100}/gi);
        if (followerSearch && followerSearch.length > 0) {
          console.log('   → Found mentions of "follower" in HTML:');
          followerSearch.slice(0, 5).forEach((match, i) => {
            console.log(`      ${i + 1}. ${match.substring(0, 150)}`);
          });
        }

        // Check if we can at least see the profile name
        const nameMatch = html.match(/<title>(.*?)<\/title>/i);
        if (nameMatch) {
          console.log(`   → Page title: ${nameMatch[1]}`);
        }
      }

    } catch (error) {
      console.log(`   ❌ ERROR: ${(error as Error).message}`);
      if (error instanceof Error && error.stack) {
        console.log(`   → Stack: ${error.stack.split('\n').slice(0, 3).join('\n   ')}`);
      }
    }

    console.log('');
    console.log('   ⏳ Waiting 3 seconds before next test...');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log('='.repeat(70));
  console.log('🏁 TEST COMPLETE');
  console.log('='.repeat(70));
  console.log('');
  console.log('Summary:');
  console.log('- This method uses HTTP requests instead of browser automation');
  console.log('- It is faster and uses fewer resources than Puppeteer');
  console.log('- If follower counts are found, we can use this for scraping');
  console.log('');
  console.log('⚠️  Note: LinkedIn may block requests from server/CI environments.');
  console.log('   For best results, run this script from your local machine.');
  console.log('   Use --mock flag to test the parsing logic without making requests.');
  console.log('   Use --curl flag to try using system curl (may work better in some environments).');
  console.log('');
}

testLinkedInPublicAccess().catch(console.error);
