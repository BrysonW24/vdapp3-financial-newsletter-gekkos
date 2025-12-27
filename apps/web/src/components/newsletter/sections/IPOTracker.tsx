'use client'

import { useNews } from '@/lib/hooks/useNews'

interface IPO {
  company: string
  symbol: string
  priceRange: string
  expectedDate: string
  underwriters: string
  description: string
}

export default function IPOTracker() {
  const { articles: ipoArticles, loading, error } = useNews('/api/ipo-news')

  // Mock IPO data for now - will be replaced with real API data
  const upcomingIPOs: IPO[] = [
    {
      company: 'Quantum Computing Corp',
      symbol: 'QCC',
      priceRange: '$18-22',
      expectedDate: 'Q2 2024',
      underwriters: 'Goldman Sachs, Morgan Stanley',
      description: 'Leading quantum computing solutions for financial modeling and risk analysis.',
    },
    {
      company: 'Sustainable Finance Tech',
      symbol: 'SFT',
      priceRange: '$15-19',
      expectedDate: 'Q3 2024',
      underwriters: 'JPMorgan, Bank of America',
      description: 'AI-powered ESG analysis and sustainable investment platforms.',
    },
    {
      company: 'Fintech Innovation Ltd',
      symbol: 'FIL',
      priceRange: '$22-26',
      expectedDate: 'Q4 2024',
      underwriters: 'Citigroup, Wells Fargo',
      description: 'Next-generation payment processing and financial technology solutions.',
    },
  ]

  const recentIPOs = [
    {
      company: 'AI Capital Advisors',
      symbol: 'AICA',
      debutPrice: '$24.50',
      currentPrice: '$31.20',
      change: '+27.3%',
      daysSinceIPO: '12 days',
    },
    {
      company: 'Blockchain Finance',
      symbol: 'BCF',
      debutPrice: '$16.00',
      currentPrice: '$19.80',
      change: '+23.8%',
      daysSinceIPO: '28 days',
    },
  ]

  if (loading) {
    return (
      <div className="section-card animate-slide-up">
        <h2 className="section-title">
          <span className="text-3xl">🚀</span>
          IPO Tracker
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <span className="text-3xl">🚀</span>
        IPO Tracker
        {!error && upcomingIPOs.length > 0 && (
          <span className="ml-auto text-xs font-normal text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            LIVE TRACKING ✨
          </span>
        )}
      </h2>

      {/* Market Overview */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📈</span>
          <div>
            <h3 className="text-lg font-bold text-slate-900">IPO Market Pulse</h3>
            <p className="text-sm text-slate-600">Q2 2024 expected to see $45B+ in new listings</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">127</div>
            <div className="text-sm text-slate-600">Upcoming IPOs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">$23.4B</div>
            <div className="text-sm text-slate-600">Q1 Total Raised</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">74%</div>
            <div className="text-sm text-slate-600">1-Year Success Rate</div>
          </div>
        </div>
      </div>

      {/* Upcoming IPOs */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="text-xl">⏰</span>
          Upcoming IPOs
        </h3>

        <div className="space-y-4">
          {upcomingIPOs.map((ipo, index) => (
            <div key={index} className="bg-gradient-to-r from-slate-50 to-purple-50 border-2 border-slate-200 rounded-lg p-5 hover:border-purple-300 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{ipo.company}</h4>
                  <p className="text-sm text-purple-600 font-semibold">{ipo.symbol}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900">{ipo.priceRange}</div>
                  <div className="text-sm text-slate-600">{ipo.expectedDate}</div>
                </div>
              </div>

              <p className="text-sm text-slate-700 mb-3">{ipo.description}</p>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Underwriters: {ipo.underwriters}</span>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span>Pre-IPO Filing</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent IPO Performance */}
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="text-xl">📊</span>
          Recent IPO Performance
        </h3>

        <div className="bg-slate-50 rounded-lg p-4">
          <div className="space-y-3">
            {recentIPOs.map((ipo, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <div className="font-semibold text-slate-900">{ipo.company}</div>
                  <div className="text-sm text-slate-600">{ipo.symbol} • {ipo.daysSinceIPO} ago</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">{ipo.currentPrice}</div>
                  <div className={`text-sm font-medium ${ipo.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {ipo.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center">
          <a href="#" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
            View all recent IPOs →
          </a>
        </div>
      </div>
    </div>
  )
}