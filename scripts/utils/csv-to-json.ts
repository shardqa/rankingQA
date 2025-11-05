#!/usr/bin/env node

/**
 * CSV to JSON Converter
 *
 * Converts a CSV file with QA professional data to the qa-professionals.json format
 *
 * CSV Format:
 * id,name,linkedinUsername,linkedinUrl,followers,country,countryCode,state,stateCode,title,company
 *
 * Usage:
 * tsx scripts/utils/csv-to-json.ts profiles.csv
 */

import * as fs from 'fs';
import * as path from 'path';

interface CSVRow {
  id: string;
  name: string;
  linkedinUsername: string;
  linkedinUrl: string;
  followers: string;
  country: string;
  countryCode: string;
  state?: string;
  stateCode?: string;
  title?: string;
  company?: string;
}

function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: any = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    // Validate required fields
    if (!row.id || !row.name || !row.linkedinUrl || !row.followers) {
      console.warn(`⚠ Skipping incomplete row ${i}: ${JSON.stringify(row)}`);
      continue;
    }

    rows.push(row as CSVRow);
  }

  return rows;
}

function convertToJSON(rows: CSVRow[]): any {
  const professionals = rows.map(row => {
    // Parse followers (handle K, M suffixes)
    let followers = parseInt(row.followers.replace(/[^0-9]/g, ''));

    if (row.followers.toLowerCase().includes('k')) {
      followers = followers * 1000;
    } else if (row.followers.toLowerCase().includes('m')) {
      followers = followers * 1000000;
    }

    return {
      id: row.id,
      name: row.name,
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&size=150&background=0ea5e9&color=fff`,
      linkedinUrl: row.linkedinUrl,
      followers: followers,
      location: {
        country: row.country,
        countryCode: row.countryCode,
        ...(row.state && row.state !== '' && { state: row.state }),
        ...(row.stateCode && row.stateCode !== '' && { stateCode: row.stateCode }),
      },
      ...(row.title && row.title !== '' && { title: row.title }),
      ...(row.company && row.company !== '' && { company: row.company }),
      lastUpdated: new Date().toISOString(),
    };
  });

  // Sort by followers (descending)
  professionals.sort((a, b) => b.followers - a.followers);

  // Create final structure
  const output = {
    lastUpdate: new Date().toISOString(),
    snapshots: [
      {
        date: new Date().toISOString(),
        type: 'global',
        professionals: professionals,
        totalCount: professionals.length,
      },
    ],
  };

  return output;
}

function main() {
  console.log('CSV to JSON Converter');
  console.log('='.repeat(60));

  // Get CSV file path from arguments
  const csvPath = process.argv[2];

  if (!csvPath) {
    console.error('\n❌ Error: No CSV file specified');
    console.log('\nUsage:');
    console.log('  tsx scripts/utils/csv-to-json.ts <csv-file>');
    console.log('\nExample:');
    console.log('  tsx scripts/utils/csv-to-json.ts profiles.csv');
    process.exit(1);
  }

  // Check if file exists
  if (!fs.existsSync(csvPath)) {
    console.error(`\n❌ Error: File not found: ${csvPath}`);
    process.exit(1);
  }

  try {
    // Read CSV
    console.log(`\n📖 Reading CSV: ${csvPath}`);
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    // Parse CSV
    console.log('📝 Parsing CSV...');
    const rows = parseCSV(csvContent);
    console.log(`✓ Parsed ${rows.length} rows`);

    // Convert to JSON
    console.log('🔄 Converting to JSON format...');
    const jsonData = convertToJSON(rows);
    console.log(`✓ Converted ${jsonData.snapshots[0].professionals.length} professionals`);

    // Write to file
    const outputPath = path.resolve('./data/qa-professionals.json');
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
    console.log(`✓ Saved to: ${outputPath}`);

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('Summary:');
    console.log('='.repeat(60));
    console.log(`Total professionals: ${jsonData.snapshots[0].totalCount}`);
    console.log(`Last update: ${jsonData.lastUpdate}`);
    console.log('\nTop 5:');

    jsonData.snapshots[0].professionals.slice(0, 5).forEach((prof: any, index: number) => {
      console.log(`  ${index + 1}. ${prof.name} - ${prof.followers.toLocaleString()} followers`);
    });

    console.log('\n✅ Conversion complete!');
    console.log('\nNext steps:');
    console.log('  1. Review data: cat data/qa-professionals.json');
    console.log('  2. Test site: npm run dev');
    console.log('  3. Commit: git add data/qa-professionals.json');
    console.log('  4. Push: git commit -m "Update rankings" && git push');
  } catch (error) {
    console.error('\n❌ Error:', (error as Error).message);
    process.exit(1);
  }
}

// Run
main();
