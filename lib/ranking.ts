import {
  QAProfessional,
  RankedQAProfessional,
  RankingSnapshot,
  PositionChange,
  RankingHistory
} from '@/types'

/**
 * Calculates position changes by comparing two ranking snapshots
 */
export function calculatePositionChanges(
  currentSnapshot: RankingSnapshot,
  previousSnapshot: RankingSnapshot | null
): RankedQAProfessional[] {
  const rankedProfessionals: RankedQAProfessional[] = []

  currentSnapshot.professionals.forEach((professional, index) => {
    const currentPosition = index + 1
    let previousPosition: number | null = null

    if (previousSnapshot) {
      previousPosition = previousSnapshot.professionals.findIndex(
        p => p.id === professional.id
      )
      if (previousPosition !== -1) {
        previousPosition = previousPosition + 1
      } else {
        previousPosition = null
      }
    }

    const change = previousPosition !== null
      ? previousPosition - currentPosition
      : 0

    const positionChange: PositionChange = {
      previousPosition,
      currentPosition,
      change,
    }

    rankedProfessionals.push({
      ...professional,
      position: currentPosition,
      positionChange,
    })
  })

  return rankedProfessionals
}

/**
 * Gets the latest ranking with position changes
 */
export function getLatestRanking(history: RankingHistory): RankedQAProfessional[] {
  if (history.snapshots.length === 0) {
    return []
  }

  const currentSnapshot = history.snapshots[0]
  const previousSnapshot = history.snapshots.length > 1 ? history.snapshots[1] : null

  return calculatePositionChanges(currentSnapshot, previousSnapshot)
}

/**
 * Formats follower count with K/M suffix
 */
export function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

/**
 * Gets position change indicator (emoji or text)
 */
export function getPositionChangeIndicator(change: number): {
  icon: string
  text: string
  color: string
} {
  if (change > 0) {
    return {
      icon: '↑',
      text: `+${change}`,
      color: 'text-green-600'
    }
  }
  if (change < 0) {
    return {
      icon: '↓',
      text: `${change}`,
      color: 'text-red-600'
    }
  }
  return {
    icon: '─',
    text: '─',
    color: 'text-slate-400'
  }
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
