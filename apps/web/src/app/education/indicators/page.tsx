import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import NewsletterLayout from '@/components/newsletter/NewsletterLayout'
import ContentRenderer from '@/components/education/ContentRenderer'
import TableOfContents from '@/components/education/TableOfContents'
import Link from 'next/link'
import BackToTop from '@/components/education/BackToTop'
import { indicatorsContent } from '@/lib/education/indicators-content'

export const metadata = {
  title: 'Economic Indicators | Gekkos Education',
  description: 'Master leading, coincident, and lagging indicators. Understand how upstream factors impact downstream outcomes.',
}

export default function IndicatorsPage() {
  return (
    <NewsletterLayout>
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{indicatorsContent.icon}</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            {indicatorsContent.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {indicatorsContent.description}
          </p>
        </div>

        <TableOfContents content={indicatorsContent.content} color="amber" />

        <div className="section-card">
          {indicatorsContent.content.map((section, index) => (
            <ContentRenderer key={index} content={section} color="amber" index={index} />
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between gap-4">
          <Link
            href="/education/players"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center gap-2"
          >
            <span>←</span>
            <span>Previous: Big Players</span>
          </Link>
          <Link
            href="/education/stock-selection"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center gap-2"
          >
            <span>Next: Stock Selection</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      <Footer />
    <BackToTop />
    </NewsletterLayout>
  )
}
