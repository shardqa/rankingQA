import { Github, Info } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">About This Ranking</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              This ranking measures influence by LinkedIn follower count. While followers don't
              determine who is the "best" QA professional, they indicate visibility and reach
              within the community. Our goal is to help you discover talented QA professionals
              you might not know about.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Methodology</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Data collected from LinkedIn profiles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Updated bi-weekly or monthly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Rankings based solely on follower count</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Position changes tracked over time</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>QA Influencers Ranking © 2025 - Built with Next.js & TypeScript</span>
            </div>
          </div>

          <a
            href="https://github.com/yourusername/qa-influencers-ranking"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
