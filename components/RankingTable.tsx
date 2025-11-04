'use client'

import { RankedQAProfessional } from '@/types'
import { formatFollowerCount, getPositionChangeIndicator } from '@/lib/ranking'
import { Trophy, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react'

interface RankingTableProps {
  professionals: RankedQAProfessional[]
}

export default function RankingTable({ professionals }: RankingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-100 border-b-2 border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Professional
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Location
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Followers
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Change
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Profile
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {professionals.map((professional) => {
            const positionIndicator = getPositionChangeIndicator(professional.positionChange.change)
            const isTopThree = professional.position <= 3

            return (
              <tr
                key={professional.id}
                className={`hover:bg-slate-50 transition-colors ${
                  isTopThree ? 'bg-yellow-50' : ''
                }`}
              >
                {/* Rank */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {isTopThree ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="text-lg font-semibold text-slate-700">
                        {professional.position}
                      </div>
                    )}
                  </div>
                </td>

                {/* Professional */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={professional.profilePicture}
                      alt={professional.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(professional.name)}&size=40&background=0ea5e9&color=fff`
                      }}
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">
                        {professional.name}
                      </div>
                      {professional.title && (
                        <div className="text-sm text-slate-600 truncate">
                          {professional.title}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Location */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-700">
                    {professional.location.countryCode}
                  </div>
                  {professional.location.stateCode && (
                    <div className="text-xs text-slate-500">
                      {professional.location.stateCode}
                    </div>
                  )}
                </td>

                {/* Followers */}
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="text-lg font-bold text-primary-600">
                    {formatFollowerCount(professional.followers)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {professional.followers.toLocaleString()}
                  </div>
                </td>

                {/* Change */}
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  {professional.positionChange.previousPosition !== null ? (
                    <div className={`flex items-center justify-center gap-1 font-semibold ${positionIndicator.color}`}>
                      {professional.positionChange.change > 0 && <TrendingUp className="w-4 h-4" />}
                      {professional.positionChange.change < 0 && <TrendingDown className="w-4 h-4" />}
                      {professional.positionChange.change === 0 && <Minus className="w-4 h-4" />}
                      <span>{positionIndicator.text}</span>
                    </div>
                  ) : (
                    <span className="badge badge-success">NEW</span>
                  )}
                </td>

                {/* Profile Link */}
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <a
                    href={professional.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
