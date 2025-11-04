import { Award, TrendingUp } from 'lucide-react'

interface HeaderProps {
  lastUpdate: string
}

export default function Header({ lastUpdate }: HeaderProps) {
  const formattedDate = new Date(lastUpdate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary-600 p-3 rounded-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                QA Influencers Ranking
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Discover the most influential QA professionals worldwide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <TrendingUp className="w-4 h-4" />
            <span>Last updated: <span className="font-medium">{formattedDate}</span></span>
          </div>
        </div>
      </div>
    </header>
  )
}
