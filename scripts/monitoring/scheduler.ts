#!/usr/bin/env node

/**
 * Weekly Monitoring Scheduler
 *
 * Automatically runs the weekly monitoring system at scheduled times.
 *
 * Default: Every Sunday at 2 AM (low traffic time)
 *
 * Usage:
 *   npm run monitor:schedule
 */

import cron from "node-cron";
import { exec } from "child_process";
import { promisify } from "util";
import { log, error as logError } from "../scraper/logger";

const execAsync = promisify(exec);

/**
 * Schedule configuration
 */
const SCHEDULE = {
  // Every Sunday at 2 AM
  // Cron format: minute hour day-of-month month day-of-week
  cronExpression: "0 2 * * 0",

  // Timezone
  timezone: "America/Sao_Paulo",

  // Enable/disable
  enabled: true,
};

/**
 * Run the weekly monitoring task
 */
async function runMonitoringTask(): Promise<void> {
  log("");
  log("=".repeat(70));
  log("⏰ SCHEDULED MONITORING STARTED");
  log("=".repeat(70));
  log(`Time: ${new Date().toISOString()}`);
  log("");

  try {
    const { stdout, stderr } = await execAsync("npm run monitor:weekly");

    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(stderr);
    }

    log("");
    log("✅ Scheduled monitoring completed successfully");
    log("");
  } catch (err) {
    const error = err as any;
    logError(`Scheduled monitoring failed: ${error.message}`);

    if (error.stdout) {
      console.log(error.stdout);
    }

    if (error.stderr) {
      console.error(error.stderr);
    }

    log("");
    log("❌ Scheduled monitoring failed - check logs above");
    log("");
  }
}

/**
 * Start the scheduler
 */
function startScheduler(): void {
  if (!SCHEDULE.enabled) {
    console.log("");
    console.log("=".repeat(70));
    console.log("⚠️  SCHEDULER IS DISABLED");
    console.log("=".repeat(70));
    console.log("");
    console.log("To enable automatic weekly monitoring:");
    console.log("1. Edit scripts/monitoring/scheduler.ts");
    console.log("2. Set SCHEDULE.enabled = true");
    console.log(
      "3. Optionally adjust cronExpression (current: " +
        SCHEDULE.cronExpression +
        ")",
    );
    console.log("4. Run: npm run monitor:schedule");
    console.log("");
    console.log(
      "Current schedule: Every Sunday at 2 AM (" + SCHEDULE.timezone + ")",
    );
    console.log("=".repeat(70));
    console.log("");
    process.exit(0);
  }

  log("=".repeat(70));
  log("🚀 WEEKLY MONITORING SCHEDULER");
  log("=".repeat(70));
  log(`Schedule: ${SCHEDULE.cronExpression}`);
  log(`Timezone: ${SCHEDULE.timezone}`);
  log("Next run: " + getNextRunTime(SCHEDULE.cronExpression));
  log("");
  log("Scheduler is now running...");
  log("Press Ctrl+C to stop");
  log("=".repeat(70));
  log("");

  // Validate cron expression
  if (!cron.validate(SCHEDULE.cronExpression)) {
    logError(`Invalid cron expression: ${SCHEDULE.cronExpression}`);
    process.exit(1);
  }

  // Schedule task
  const task = cron.schedule(
    SCHEDULE.cronExpression,
    () => {
      runMonitoringTask();
    },
    {
      timezone: SCHEDULE.timezone,
    },
  );

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    log("");
    log("Stopping scheduler...");
    task.stop();
    log("Scheduler stopped");
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    log("");
    log("Stopping scheduler...");
    task.stop();
    log("Scheduler stopped");
    process.exit(0);
  });
}

/**
 * Get next scheduled run time (approximate)
 */
function getNextRunTime(cronExpression: string): string {
  // For "0 2 * * 0" (Sunday at 2 AM)
  if (cronExpression === "0 2 * * 0") {
    const now = new Date();
    const next = new Date();

    // Find next Sunday
    const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
    next.setDate(now.getDate() + daysUntilSunday);
    next.setHours(2, 0, 0, 0);

    // If it's Sunday and after 2 AM, schedule for next Sunday
    if (now.getDay() === 0 && now.getHours() >= 2) {
      next.setDate(next.getDate() + 7);
    }

    return next.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: SCHEDULE.timezone,
    });
  }

  return "See cron expression: " + cronExpression;
}

// Start scheduler
startScheduler();
