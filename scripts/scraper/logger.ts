import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = path.resolve('./logs');
const LOG_FILE = path.join(LOG_DIR, 'scraper.log');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Log levels
 */
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

/**
 * Format timestamp
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Write to log file
 */
function writeToFile(message: string): void {
  try {
    fs.appendFileSync(LOG_FILE, message + '\n');
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
}

/**
 * Log a message
 */
function logMessage(level: LogLevel, message: string): void {
  const timestamp = getTimestamp();
  const logEntry = `[${timestamp}] [${level}] ${message}`;

  // Console output with colors
  switch (level) {
    case LogLevel.INFO:
      console.log(`\x1b[36m${logEntry}\x1b[0m`); // Cyan
      break;
    case LogLevel.WARN:
      console.warn(`\x1b[33m${logEntry}\x1b[0m`); // Yellow
      break;
    case LogLevel.ERROR:
      console.error(`\x1b[31m${logEntry}\x1b[0m`); // Red
      break;
    case LogLevel.DEBUG:
      console.log(`\x1b[90m${logEntry}\x1b[0m`); // Gray
      break;
  }

  // Write to file
  writeToFile(logEntry);
}

/**
 * Exported logging functions
 */
export function log(message: string): void {
  logMessage(LogLevel.INFO, message);
}

export function warn(message: string): void {
  logMessage(LogLevel.WARN, message);
}

export function error(message: string): void {
  logMessage(LogLevel.ERROR, message);
}

export function debug(message: string): void {
  logMessage(LogLevel.DEBUG, message);
}

/**
 * Clear old logs
 */
export function clearOldLogs(daysToKeep: number = 30): void {
  try {
    const files = fs.readdirSync(LOG_DIR);
    const now = Date.now();
    const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

    files.forEach(file => {
      const filepath = path.join(LOG_DIR, file);
      const stats = fs.statSync(filepath);

      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filepath);
        log(`Deleted old log file: ${file}`);
      }
    });
  } catch (err) {
    error(`Failed to clear old logs: ${err}`);
  }
}
