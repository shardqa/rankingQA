import { RankingHistory } from '@/types'
import rankingData from '@/data/qa-professionals.json'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function fetchRankingFromSupabase(): Promise<RankingHistory> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Variáveis env do Supabase não configuradas')
  }

  const url =
    `${SUPABASE_URL}/rest/v1/ranking_history`+
    `?select=data` +
    `&order=updated_at.desc` +
    `&limit=1`

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`Fetch no supabase falhou: ${response.status}`)
  }

  const rows: Array<{data: RankingHistory}> = await response.json()

  if (!rows.length || !rows[0].data) {
    throw new Error('Nenhum dado encontrado no Supabase')
  }

  return rows[0].data
}

export async function getRankingData(): Promise<RankingHistory> {
  try{
    return await fetchRankingFromSupabase()
  } catch {
    return rankingData as RankingHistory
  }
}

export function getLastUpdateDate(history: RankingHistory): string {
  return history.lastUpdate
}
