import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import NewsletterLayout from '@/components/newsletter/NewsletterLayout'
import Link from 'next/link'

export const metadata = {
  title: 'Economic Indicators | Gekkos Education',
  description: 'Master leading, coincident, and lagging indicators. Understand how upstream factors impact downstream outcomes.',
}

export default function IndicatorsPage() {
  return (
    <NewsletterLayout>
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            Economic Indicators
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Master leading, coincident, and lagging indicators. Understand how upstream
            factors impact downstream outcomes
          </p>
        </div>

        {/* Coming Soon */}
        <div className="section-card text-center bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200">
          <div className="text-5xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Content Coming Soon
          </h2>
          <p className="text-slate-700 mb-6 max-w-2xl mx-auto">
            We're building comprehensive guides to economic indicators and their impact chains.
            Check back soon!
          </p>
          <Link
            href="/education"
            className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md"
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
              'Leading Indicators: PMI, consumer confidence, yield curve',
              'Coincident Indicators: GDP, employment, retail sales',
              'Lagging Indicators: CPI, corporate profits, unemployment',
              'How to interpret each indicator',
              'Historical patterns and current readings',
              'Impact chains: how upstream affects downstream',
              'Live data: current indicator values with context',
            ].map((topic, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-amber-600 font-bold mt-1">•</span>
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
