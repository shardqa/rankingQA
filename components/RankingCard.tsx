'use client'

import { RankedQAProfessional } from '@/types'
import { formatFollowerCount, getPositionChangeIndicator } from '@/lib/ranking'
import { Trophy, TrendingUp, TrendingDown, Minus, MapPin, Briefcase } from 'lucide-react'

interface RankingCardProps {
  professional: RankedQAProfessional
  showFullDetails?: boolean
}

export default function RankingCard({ professional, showFullDetails = false }: RankingCardProps) {
  const positionIndicator = getPositionChangeIndicator(professional.positionChange.change)
  const isTopThree = professional.position <= 3

  return (
    <div className={`card p-6 ${isTopThree ? 'ring-2 ring-primary-400' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Position Badge */}
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
              isTopThree
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {professional.position <= 3 && <Trophy className="w-5 h-5" />}
            {professional.position > 3 && professional.position}
          </div>
        </div>

        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <img
            src={professional.profilePicture}
            alt={professional.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(professional.name)}&size=64&background=0ea5e9&color=fff`
            }}
          />
        </div>

        {/* Professional Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 truncate">
                {professional.name}
              </h3>

              {professional.title && (
                <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                  <Briefcase className="w-3 h-3" />
                  <span className="truncate">{professional.title}</span>
                </div>
              )}

              <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                <MapPin className="w-3 h-3" />
                <span>
                  {professional.location.state
                    ? `${professional.location.state}, ${professional.location.country}`
                    : professional.location.country}
                </span>
              </div>
            </div>

            {/* Position Change Indicator */}
            <div className="flex-shrink-0">
              {professional.positionChange.previousPosition !== null && (
                <div className={`flex items-center gap-1 font-semibold ${positionIndicator.color}`}>
                  {professional.positionChange.change > 0 && <TrendingUp className="w-4 h-4" />}
                  {professional.positionChange.change < 0 && <TrendingDown className="w-4 h-4" />}
                  {professional.positionChange.change === 0 && <Minus className="w-4 h-4" />}
                  <span className="text-sm">{positionIndicator.text}</span>
                </div>
              )}
              {professional.positionChange.previousPosition === null && (
                <span className="badge badge-success text-xs">NEW</span>
              )}
            </div>
          </div>

          {/* Followers Count */}
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {formatFollowerCount(professional.followers)}
              </div>
              <div className="text-xs text-slate-500">LinkedIn Followers</div>
            </div>

            <a
              href={professional.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#0077B5] text-white rounded-lg text-sm font-medium hover:bg-[#006399] transition-colors"
            >
              View Profile
            </a>
          </div>

          {showFullDetails && professional.company && (
            <div className="mt-2 text-sm text-slate-600">
              <span className="font-medium">Company:</span> {professional.company}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
