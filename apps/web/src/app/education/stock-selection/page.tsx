import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import NewsletterLayout from '@/components/newsletter/NewsletterLayout'
import Link from 'next/link'

export const metadata = {
  title: 'Stock Selection | Gekkos Education',
  description: 'Discover how to choose stocks using fundamental and technical analysis. Learn what metrics to track and when.',
}

export default function StockSelectionPage() {
  return (
    <NewsletterLayout>
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            Stock Selection
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover how to choose stocks using fundamental and technical analysis.
            Learn what metrics to track and when
          </p>
        </div>

        {/* Coming Soon */}
        <div className="section-card text-center bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
          <div className="text-5xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Content Coming Soon
          </h2>
          <p className="text-slate-700 mb-6 max-w-2xl mx-auto">
            We're building comprehensive guides to stock analysis and selection methods.
            Check back soon!
          </p>
          <Link
            href="/education"
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md"
          >
            ← Back to Education Hub
          </Link>
        </div>

        {/* Preview Topics */}
        <div className="mt-12 section-card">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">📋</span>
            Topics We'll Cover
          </h2>
          <ul className="space-y-3">
            {[
              'Fundamental Analysis: Revenue, earnings, margins, and ratios (P/E, P/B, PEG)',
              'Technical Analysis: Support/resistance, moving averages, volume patterns',
              'Sector Analysis: Understanding sector rotation strategies',
              'What to track: Daily, weekly, and monthly metrics',
              'Red flags: Warning signs to avoid',
              'Live examples: Real stock metrics explained',
              'Chart patterns: Technical setups on actual stocks',
            ].map((topic, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">•</span>
                <span className="text-slate-700">{topic}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
    </NewsletterLayout>
  )
}
