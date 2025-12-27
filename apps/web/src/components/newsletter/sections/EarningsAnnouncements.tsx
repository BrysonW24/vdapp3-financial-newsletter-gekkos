'use client'

import { useNews } from '@/lib/hooks/useNews'

interface EarningsReport {
  company: string
  symbol: string
  quarter: string
  eps: string
  revenue: string
  expectedEPS: string
  expectedRevenue: string
  date: string
  time: string
  status: 'beat' | 'miss' | 'meet' | 'upcoming'
}

export default function EarningsAnnouncements() {
  const { articles: earningsArticles, loading, error } = useNews('/api/earnings-news')

  // Mock earnings data - will be replaced with real API data
  const recentEarnings: EarningsReport[] = [
    {
      company: 'Commonwealth Bank',
      symbol: 'CBA',
      quarter: 'Q4 FY24',
      eps: '$1.89',
      revenue: '$13.2B',
      expectedEPS: '$1.75',
      expectedRevenue: '$12.8B',
      date: '2024-01-15',
      time: 'After Market',
      status: 'beat',
    },
    {
      company: 'Westpac Group',
      symbol: 'WBC',
      quarter: 'Q4 FY24',
      eps: '$0.92',
      revenue: '$6.1B',
      expectedEPS: '$0.88',
      expectedRevenue: '$6.0B',
      date: '2024-01-16',
      time: 'Before Market',
      status: 'beat',
    },
    {
      company: 'ANZ Group',
      symbol: 'ANZ',
      quarter: 'Q4 FY24',
      eps: '$0.78',
      revenue: '$4.9B',
      expectedEPS: '$0.82',
      expectedRevenue: '$5.0B',
      date: '2024-01-17',
      time: 'After Market',
      status: 'miss',
    },
  ]

  const upcomingEarnings = [
    {
      company: 'National Australia Bank',
      symbol: 'NAB',
      quarter: 'Q4 FY24',
      expectedEPS: '$0.95',
      expectedRevenue: '$6.3B',
      date: '2024-01-25',
      time: 'Before Market',
    },
    {
      company: 'Macquarie Group',
      symbol: 'MQG',
      quarter: 'Q4 FY24',
      expectedEPS: '$3.20',
      expectedRevenue: '$2.1B',
      date: '2024-01-30',
      time: 'After Market',
    },
    {
      company: 'Qantas Airways',
      symbol: 'QAN',
      quarter: 'Q3 FY24',
      expectedEPS: '$0.12',
      expectedRevenue: '$2.8B',
      date: '2024-02-05',
      time: 'After Market',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'beat': return 'text-green-600 bg-green-100'
      case 'miss': return 'text-red-600 bg-red-100'
      case 'meet': return 'text-blue-600 bg-blue-100'
      default: return 'text-slate-600 bg-slate-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'beat': return '📈'
      case 'miss': return '📉'
      case 'meet': return '➡️'
      default: return '⏰'
    }
  }

  if (loading) {
    return (
      <div className="section-card animate-slide-up">
        <h2 className="section-title">
          <span className="text-3xl">📊</span>
          Earnings Announcements
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <span className="text-3xl">📊</span>
        Earnings Announcements
        {!error && recentEarnings.length > 0 && (
          <span className="ml-auto text-xs font-normal text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            LIVE REPORTS ✨
          </span>
        )}
      </h2>

      {/* Earnings Summary */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">💰</span>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Earnings Season Overview</h3>
            <p className="text-sm text-slate-600">Q4 FY24 earnings season in progress</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">87%</div>
            <div className="text-sm text-slate-600">Beat Estimates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">12.3%</div>
            <div className="text-sm text-slate-600">Avg EPS Growth</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">8.7%</div>
            <div className="text-sm text-slate-600">Avg Revenue Growth</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">47</div>
            <div className="text-sm text-slate-600">Reports This Week</div>
          </div>
        </div>
      </div>

      {/* Recent Earnings Results */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="text-xl">📅</span>
          Recent Results
        </h3>

        <div className="space-y-4">
          {recentEarnings.map((earnings, index) => (
            <div key={index} className="bg-slate-50 border-2 border-slate-200 rounded-lg p-5 hover:border-orange-300 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{earnings.company}</h4>
                  <p className="text-sm text-orange-600 font-semibold">{earnings.symbol} • {earnings.quarter}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(earnings.status)}`}>
                    <span>{getStatusIcon(earnings.status)}</span>
                    {earnings.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-sm font-semibold text-slate-700">EPS</div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{earnings.eps}</span>
                    <span className="text-sm text-slate-500">vs {earnings.expectedEPS} expected</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-700">Revenue</div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{earnings.revenue}</span>
                    <span className="text-sm text-slate-500">vs {earnings.expectedRevenue} expected</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{earnings.date} • {earnings.time}</span>
                <a href="#" className="text-orange-600 hover:text-orange-800 font-medium">
                  Full Report →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Earnings */}
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="text-xl">⏰</span>
          This Week's Schedule
        </h3>

        <div className="bg-slate-50 rounded-lg p-4">
          <div className="space-y-3">
            {upcomingEarnings.map((earnings, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-slate-200 last:border-b-0">
                <div>
                  <div className="font-semibold text-slate-900">{earnings.company}</div>
                  <div className="text-sm text-slate-600">{earnings.symbol} • {earnings.quarter}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">{earnings.expectedEPS}</div>
                  <div className="text-sm text-slate-600">EPS Expected</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">{earnings.date}</div>
                  <div className="text-xs text-slate-500">{earnings.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center">
          <a href="#" className="text-orange-600 hover:text-orange-800 text-sm font-medium">
            View full earnings calendar →
          </a>
        </div>
      </div>
    </div>
  )
}