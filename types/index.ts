/**
 * Data Types for QA Influencers Ranking Platform
 */

export interface Location {
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2 (e.g., "BR", "US")
  state?: string;
  stateCode?: string; // e.g., "SP", "CA"
}

export interface QAProfessional {
  id: string;
  name: string;
  profilePicture: string;
  linkedinUrl: string;
  followers: number;
  location: Location;
  title?: string; // e.g., "QA Lead", "Test Automation Engineer"
  company?: string;
  lastUpdated: string; // ISO 8601 date string
}

export interface PositionChange {
  previousPosition: number | null; // null if new entry
  currentPosition: number;
  change: number; // positive = moved up, negative = moved down, 0 = no change
}

export interface RankedQAProfessional extends QAProfessional {
  position: number;
  positionChange: PositionChange;
}

export interface RankingSnapshot {
  date: string; // ISO 8601 date string
  type: 'global' | 'country' | 'state';
  filterKey?: string; // e.g., "BR" for country, "SP" for state
  professionals: QAProfessional[];
  totalCount: number;
}

export interface RankingHistory {
  snapshots: RankingSnapshot[];
  lastUpdate: string;
}

export type RankingType = 'global' | 'country' | 'state';

export interface RankingFilter {
  type: RankingType;
  country?: string;
  state?: string;
}
