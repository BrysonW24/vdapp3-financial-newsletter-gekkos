import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import NewsletterLayout from '@/components/newsletter/NewsletterLayout'
import ContentRenderer from '@/components/education/ContentRenderer'
import Link from 'next/link'
import { playersContent } from '@/lib/education/players-content'

export const metadata = {
  title: 'Big Players - Market Participants | Gekkos Education',
  description: 'Learn about central banks, investment banks, institutional investors, hedge funds, and their roles in shaping markets.',
}

export default function PlayersPage() {
  return (
    <NewsletterLayout>
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{playersContent.icon}</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            {playersContent.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {playersContent.description}
          </p>
        </div>

        <div className="space-y-8">
          {playersContent.content.map((section, index) => (
            <div key={index} className="section-card">
              <ContentRenderer content={section} />
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between gap-4">
          <Link
            href="/education/big-picture"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center gap-2"
          >
            <span>←</span>
            <span>Previous: Big Picture</span>
          </Link>
          <Link
            href="/education/indicators"
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center gap-2"
          >
            <span>Next: Economic Indicators</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      <Footer />
    </NewsletterLayout>
  )
}
