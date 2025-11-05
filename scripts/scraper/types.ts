/**
 * Types for LinkedIn scraper
 */

export interface ScrapedProfile {
  id: string;
  name: string;
  linkedinUrl: string;
  followers: number;
  profilePicture?: string;
  location?: {
    country: string;
    countryCode: string;
    state?: string;
    stateCode?: string;
  };
  title?: string;
  company?: string;
  scrapedAt: string; // ISO date string
  success: boolean;
  error?: string;
}

export interface ScrapingResult {
  timestamp: string;
  totalProfiles: number;
  successCount: number;
  failureCount: number;
  profiles: ScrapedProfile[];
  duration: number; // milliseconds
  errors: ScrapingError[];
}

export interface ScrapingError {
  profileId: string;
  profileName: string;
  error: string;
  timestamp: string;
}

export interface ScraperOptions {
  headless?: boolean;
  timeout?: number;
  maxRetries?: number;
  delayBetweenProfiles?: number;
  screenshotOnError?: boolean;
}

export interface LinkedInSelectors {
  followerCount: string[];
  profilePicture: string[];
  name: string[];
  title: string[];
  location: string[];
}
