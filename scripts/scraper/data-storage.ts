import * as fs from 'fs';
import * as path from 'path';
import { ScrapedProfile, ScrapingResult } from './types';
import { log, error as logError } from './logger';

const DATA_DIR = path.resolve('./data');
const SNAPSHOTS_DIR = path.resolve('./data/snapshots');
const MAIN_DATA_FILE = path.join(DATA_DIR, 'qa-professionals.json');

/**
 * Ensure directories exist
 */
function ensureDirectories(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SNAPSHOTS_DIR)) {
    fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  }
}

/**
 * Save scraping result to snapshot
 */
export function saveSnapshot(result: ScrapingResult): string {
  ensureDirectories();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `snapshot_${timestamp}.json`;
  const filepath = path.join(SNAPSHOTS_DIR, filename);

  try {
    fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
    log(`Snapshot saved: ${filepath}`);
    return filepath;
  } catch (err) {
    logError(`Failed to save snapshot: ${err}`);
    throw err;
  }
}

/**
 * Update main data file with latest scraping results
 */
export function updateMainDataFile(result: ScrapingResult): void {
  ensureDirectories();

  try {
    // Read existing data or create new structure
    let data: any = {
      lastUpdate: new Date().toISOString(),
      snapshots: [],
    };

    if (fs.existsSync(MAIN_DATA_FILE)) {
      const fileContent = fs.readFileSync(MAIN_DATA_FILE, 'utf-8');
      data = JSON.parse(fileContent);
    }

    // Create new snapshot
    const newSnapshot = {
      date: result.timestamp,
      type: 'global',
      professionals: result.profiles
        .filter(p => p.success)
        .map(p => ({
          id: p.id,
          name: p.name,
          profilePicture: p.profilePicture || 'https://via.placeholder.com/150',
          linkedinUrl: p.linkedinUrl,
          followers: p.followers,
          location: p.location,
          title: p.title,
          company: p.company,
          lastUpdated: p.scrapedAt,
        }))
        .sort((a, b) => b.followers - a.followers), // Sort by followers descending
      totalCount: result.successCount,
    };

    // Keep only last 10 snapshots
    data.snapshots.unshift(newSnapshot);
    if (data.snapshots.length > 10) {
      data.snapshots = data.snapshots.slice(0, 10);
    }

    // Update last update timestamp
    data.lastUpdate = result.timestamp;

    // Write to file
    fs.writeFileSync(MAIN_DATA_FILE, JSON.stringify(data, null, 2));
    log(`Main data file updated: ${MAIN_DATA_FILE}`);

    // Log ranking changes
    logRankingChanges(data.snapshots);
  } catch (err) {
    logError(`Failed to update main data file: ${err}`);
    throw err;
  }
}

/**
 * Log ranking changes between snapshots
 */
function logRankingChanges(snapshots: any[]): void {
  if (snapshots.length < 2) {
    log('Not enough data to compare rankings');
    return;
  }

  const current = snapshots[0].professionals;
  const previous = snapshots[1].professionals;

  log('\n=== Ranking Changes ===');

  current.forEach((prof: any, index: number) => {
    const currentPos = index + 1;
    const prevIndex = previous.findIndex((p: any) => p.id === prof.id);

    if (prevIndex === -1) {
      log(`${currentPos}. ${prof.name} - NEW ENTRY (${prof.followers.toLocaleString()} followers)`);
    } else {
      const prevPos = prevIndex + 1;
      const posChange = prevPos - currentPos;
      const followerChange = prof.followers - previous[prevIndex].followers;

      let changeIndicator = '';
      if (posChange > 0) {
        changeIndicator = `↑ +${posChange}`;
      } else if (posChange < 0) {
        changeIndicator = `↓ ${posChange}`;
      } else {
        changeIndicator = '─ 0';
      }

      const followerIndicator = followerChange >= 0 ? `+${followerChange}` : `${followerChange}`;

      log(
        `${currentPos}. ${prof.name} - ${changeIndicator} (${prof.followers.toLocaleString()} followers, ${followerIndicator})`
      );
    }
  });

  log('========================\n');
}

/**
 * Get latest snapshot
 */
export function getLatestSnapshot(): any | null {
  if (!fs.existsSync(MAIN_DATA_FILE)) {
    return null;
  }

  try {
    const fileContent = fs.readFileSync(MAIN_DATA_FILE, 'utf-8');
    const data = JSON.parse(fileContent);
    return data.snapshots?.[0] || null;
  } catch (err) {
    logError(`Failed to read latest snapshot: ${err}`);
    return null;
  }
}

/**
 * Get all snapshots
 */
export function getAllSnapshots(): any[] {
  const snapshots: any[] = [];

  try {
    if (fs.existsSync(SNAPSHOTS_DIR)) {
      const files = fs.readdirSync(SNAPSHOTS_DIR);

      files
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse()
        .forEach(file => {
          try {
            const filepath = path.join(SNAPSHOTS_DIR, file);
            const content = fs.readFileSync(filepath, 'utf-8');
            snapshots.push(JSON.parse(content));
          } catch (err) {
            logError(`Failed to read snapshot ${file}: ${err}`);
          }
        });
    }
  } catch (err) {
    logError(`Failed to get all snapshots: ${err}`);
  }

  return snapshots;
}

/**
 * Clean old snapshots (keep last N)
 */
export function cleanOldSnapshots(keepCount: number = 50): void {
  try {
    if (!fs.existsSync(SNAPSHOTS_DIR)) {
      return;
    }

    const files = fs
      .readdirSync(SNAPSHOTS_DIR)
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse();

    if (files.length <= keepCount) {
      return;
    }

    const filesToDelete = files.slice(keepCount);

    filesToDelete.forEach(file => {
      const filepath = path.join(SNAPSHOTS_DIR, file);
      fs.unlinkSync(filepath);
      log(`Deleted old snapshot: ${file}`);
    });

    log(`Cleaned ${filesToDelete.length} old snapshots`);
  } catch (err) {
    logError(`Failed to clean old snapshots: ${err}`);
  }
}
