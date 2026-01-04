'use client'

import NewsletterLayout from '@/components/newsletter/NewsletterLayout'
import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import GlobalPolitics from '@/components/newsletter/sections/GlobalPolitics'
import BackToTop from '@/components/education/BackToTop'

export default function PoliticsPage() {
  return (
    <NewsletterLayout>
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="text-5xl">🌍</span>
            Global Politics
          </h1>
          <p className="text-lg text-slate-600">
            Track geopolitical developments, policy changes, and their impact on global markets
          </p>
        </div>

        <GlobalPolitics />
      </div>

      <Footer />
      <BackToTop />
    </NewsletterLayout>
  )
}
