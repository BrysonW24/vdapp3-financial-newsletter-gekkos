import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import NewsletterLayout from '@/components/newsletter/NewsletterLayout'
import ContentRenderer from '@/components/education/ContentRenderer'
import TableOfContents from '@/components/education/TableOfContents'
import Link from 'next/link'
import { strategiesContent } from '@/lib/education/strategies-content'

export const metadata = {
  title: 'Investment Strategies | Gekkos Education',
  description: 'Explore different investment approaches from value investing to momentum trading, and find what works for you.',
}

export default function StrategiesPage() {
  return (
    <NewsletterLayout>
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{strategiesContent.icon}</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            {strategiesContent.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {strategiesContent.description}
          </p>
        </div>

        <TableOfContents content={strategiesContent.content} color="indigo" />

        <div className="section-card">
          {strategiesContent.content.map((section, index) => (
            <ContentRenderer key={index} content={section} color="indigo" index={index} />
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between gap-4">
          <Link
            href="/education/stock-selection"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center gap-2"
          >
            <span>←</span>
            <span>Previous: Stock Selection</span>
          </Link>
          <Link
            href="/education/glossary"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center gap-2"
          >
            <span>Browse Glossary</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      <Footer />
    </NewsletterLayout>
  )
}
