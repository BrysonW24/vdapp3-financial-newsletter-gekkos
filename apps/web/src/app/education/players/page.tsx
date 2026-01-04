import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import NewsletterLayout from '@/components/newsletter/NewsletterLayout'
import Link from 'next/link'

export const metadata = {
  title: 'Big Players - Market Participants | Gekkos Education',
  description: 'Learn about central banks, investment banks, institutional investors, hedge funds, and their roles in shaping markets.',
}

export default function PlayersPage() {
  return (
    <NewsletterLayout>
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🏛️</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            Big Players
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Learn about central banks, investment banks, institutional investors, hedge funds,
            and their roles in shaping markets
          </p>
        </div>

        {/* Coming Soon */}
        <div className="section-card text-center bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
          <div className="text-5xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Content Coming Soon
          </h2>
          <p className="text-slate-700 mb-6 max-w-2xl mx-auto">
            We're building comprehensive profiles of major market participants and their influence.
            Check back soon!
          </p>
          <Link
            href="/education"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md"
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
              'Central Banks: RBA, Fed, ECB, BoJ - their tools and impact',
              'Investment Banks: Goldman Sachs, Morgan Stanley - services and influence',
              'Institutional Investors: BlackRock, Vanguard - holdings and voting power',
              'Hedge Funds: Strategies and market impact',
              'Retail Platforms: Brokers and the democratization of investing',
              'Rating Agencies: S&P, Moody\'s, and their influence on markets',
            ].map((topic, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">•</span>
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
