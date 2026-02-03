import { getRankingData } from '@/lib/data'
import { getLatestRanking } from '@/lib/ranking'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RankingCard from '@/components/RankingCard'
import RankingTable from '@/components/RankingTable'
import { LayoutGrid, TableProperties } from 'lucide-react'

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  const rankingData = await getRankingData()
  const rankedProfessionals = getLatestRanking(rankingData)

  return (
    <div className="min-h-screen flex flex-col">
      <Header lastUpdate={rankingData.lastUpdate} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Global QA Leaders
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Top {rankedProfessionals.length} most influential Quality Assurance professionals
            worldwide, ranked by LinkedIn follower count
          </p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {rankedProfessionals.length}
            </div>
            <div className="text-sm text-slate-600">QA Professionals</div>
          </div>

          <div className="card p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {new Set(rankedProfessionals.map(p => p.location.countryCode)).size}
            </div>
            <div className="text-sm text-slate-600">Countries Represented</div>
          </div>

          <div className="card p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {rankedProfessionals.reduce((sum, p) => sum + p.followers, 0).toLocaleString('en-US')}
            </div>
            <div className="text-sm text-slate-600">Total Followers</div>
          </div>
        </section>

        {/* View Toggle Buttons */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900">Top QA Influencers</h3>
        </div>

        {/* Desktop: Table View */}
        <div className="hidden lg:block card overflow-hidden mb-8">
          <RankingTable professionals={rankedProfessionals} />
        </div>

        {/* Mobile & Tablet: Card View */}
        <div className="lg:hidden space-y-4 mb-8">
          {rankedProfessionals.map((professional) => (
            <RankingCard
              key={professional.id}
              professional={professional}
              showFullDetails={false}
            />
          ))}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-blue-900 mb-2">
            Know a QA professional who should be on this list?
          </h3>
          <p className="text-sm text-blue-700">
            This is a community-driven project. Help us identify more influential QA
            professionals by contributing on GitHub or reaching out to us.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
