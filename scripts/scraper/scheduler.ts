#!/usr/bin/env node

import cron from "node-cron";
import { SCHEDULE_CONFIG } from "./config";
import { log, error as logError } from "./logger";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Run scraper via npm script
 */
async function runScraperTask(): Promise<void> {
  log("\n" + "=".repeat(60));
  log("Scheduled scraping task started");
  log("=".repeat(60));

  try {
    const { stdout, stderr } = await execAsync("npm run scrape");

    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(stderr);
    }

    log("Scheduled scraping task completed successfully");
  } catch (err) {
    const error = err as any;
    logError(`Scheduled scraping task failed: ${error.message}`);

    if (error.stdout) {
      console.log(error.stdout);
    }

    if (error.stderr) {
      console.error(error.stderr);
    }
  }
}

/**
 * Start scheduler
 */
function startScheduler(): void {
  if (!SCHEDULE_CONFIG.enabled) {
    console.log("\n" + "=".repeat(60));
    console.log("⚠ Scheduler is DISABLED in config");
    console.log("=".repeat(60));
    console.log("To enable scheduled scraping:");
    console.log("1. Edit scripts/scraper/config.ts");
    console.log("2. Set SCHEDULE_CONFIG.enabled = true");
    console.log(
      "3. Configure cronExpression (current: " +
        SCHEDULE_CONFIG.cronExpression +
        ")",
    );
    console.log("4. Run: npm run scrape:schedule");
    console.log("=".repeat(60) + "\n");
    process.exit(0);
  }

  log("=".repeat(60));
  log("LinkedIn Scraper Scheduler");
  log("=".repeat(60));
  log(`Schedule: ${SCHEDULE_CONFIG.cronExpression}`);
  log(`Timezone: ${SCHEDULE_CONFIG.timezone}`);
  log("Scheduler is now running...");
  log("Press Ctrl+C to stop");
  log("=".repeat(60) + "\n");

  // Validate cron expression
  if (!cron.validate(SCHEDULE_CONFIG.cronExpression)) {
    logError(`Invalid cron expression: ${SCHEDULE_CONFIG.cronExpression}`);
    process.exit(1);
  }

  // Schedule task
  const task = cron.schedule(
    SCHEDULE_CONFIG.cronExpression,
    () => {
      runScraperTask();
    },
    {
      timezone: SCHEDULE_CONFIG.timezone,
    },
  );

  // Log next scheduled run
  log(`Next scheduled run: ${getNextScheduledTime()}\n`);

  // Keep process alive
  process.on("SIGINT", () => {
    log("\nStopping scheduler...");
    task.stop();
    process.exit(0);
  });
}

/**
 * Get next scheduled time (for display)
 */
function getNextScheduledTime(): string {
  // This is a simplified version
  // In production, you'd calculate the exact next run time
  return "See cron expression: " + SCHEDULE_CONFIG.cronExpression;
}

// Start scheduler
startScheduler();
