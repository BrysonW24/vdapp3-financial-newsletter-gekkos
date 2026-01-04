import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import NewsletterLayout from '@/components/newsletter/NewsletterLayout'
import ContentRenderer from '@/components/education/ContentRenderer'
import Link from 'next/link'
import { bigPictureContent } from '@/lib/education/big-picture-content'

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
          <div className="text-6xl mb-4">{bigPictureContent.icon}</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            {bigPictureContent.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {bigPictureContent.description}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {bigPictureContent.content.map((section, index) => (
            <div key={index} className="section-card">
              <ContentRenderer content={section} />
            </div>
          ))}
        </div>

        {/* Navigation to Next Section */}
        <div className="mt-12 flex items-center justify-between gap-4">
          <Link
            href="/education"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Education Hub</span>
          </Link>
          <Link
            href="/education/players"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center gap-2"
          >
            <span>Next: Big Players</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      <Footer />
    </NewsletterLayout>
  )
}
