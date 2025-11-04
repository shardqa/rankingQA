import { RankingHistory } from '@/types'
import rankingData from '@/data/qa-professionals.json'

/**
 * Fetches the ranking data
 * In a real app, this would fetch from an API or database
 */
export async function getRankingData(): Promise<RankingHistory> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))

  return rankingData as RankingHistory
}

/**
 * Gets the last update date
 */
export function getLastUpdateDate(history: RankingHistory): string {
  return history.lastUpdate
}
