import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import NewsletterLayout from '@/components/newsletter/NewsletterLayout'
import ContentRenderer from '@/components/education/ContentRenderer'
import Link from 'next/link'
import { stockSelectionContent } from '@/lib/education/stock-selection-content'

export const metadata = {
  title: 'Stock Selection | Gekkos Education',
  description: 'Discover how to choose stocks using fundamental and technical analysis. Learn what metrics to track and when.',
}

export default function StockSelectionPage() {
  return (
    <NewsletterLayout>
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{stockSelectionContent.icon}</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            {stockSelectionContent.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {stockSelectionContent.description}
          </p>
        </div>

        <div className="space-y-8">
          {stockSelectionContent.content.map((section, index) => (
            <div key={index} className="section-card">
              <ContentRenderer content={section} />
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between gap-4">
          <Link
            href="/education/indicators"
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center gap-2"
          >
            <span>←</span>
            <span>Previous: Economic Indicators</span>
          </Link>
          <Link
            href="/education/strategies"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center gap-2"
          >
            <span>Next: Investment Strategies</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      <Footer />
    </NewsletterLayout>
  )
}
