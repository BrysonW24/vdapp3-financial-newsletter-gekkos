import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import NewsletterLayout from '@/components/newsletter/NewsletterLayout'
import Link from 'next/link'

export const metadata = {
  title: 'Big Picture - Financial Ecosystem | Gekkos Education',
  description: 'Understand the financial ecosystem, how markets are interconnected, and how money flows through the global economy.',
}

export default function BigPicturePage() {
  return (
    <NewsletterLayout>
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🌐</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            The Big Picture
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Understand the financial ecosystem, how markets are interconnected,
            and how money flows through the global economy
          </p>
        </div>

        {/* Coming Soon */}
        <div className="section-card text-center bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
          <div className="text-5xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Content Coming Soon
          </h2>
          <p className="text-slate-700 mb-6 max-w-2xl mx-auto">
            We're building comprehensive content on the financial ecosystem, market participants,
            and how everything connects. Check back soon!
          </p>
          <Link
            href="/education"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md"
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
              'How financial markets are structured and interconnected',
              'The flow of money through the global economy',
              'Key market participants and their roles',
              'Different asset classes and how they relate',
              'Market cycles and economic phases',
              'Global market linkages and correlations',
            ].map((topic, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
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
