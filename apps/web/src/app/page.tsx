'use client'

import NewsletterLayout from '@/components/newsletter/NewsletterLayout'
import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import TableOfContents from '@/components/newsletter/TableOfContents'
import TradingFeed from '@/components/newsletter/sections/TradingFeed'
import PropertyFeed from '@/components/newsletter/sections/PropertyFeed'
import StocksFeed from '@/components/newsletter/sections/StocksFeed'
import CryptoFeed from '@/components/newsletter/sections/CryptoFeed'
import EconomyFeed from '@/components/newsletter/sections/EconomyFeed'
import GlobalEconomyFeed from '@/components/newsletter/sections/GlobalEconomyFeed'
import TechnologyFeed from '@/components/newsletter/sections/TechnologyFeed'
import KnowledgeFeed from '@/components/newsletter/sections/KnowledgeFeed'
import EntertainmentFeed from '@/components/newsletter/sections/EntertainmentFeed'
import IPOFeed from '@/components/newsletter/sections/IPOFeed'
import EarningsFeed from '@/components/newsletter/sections/EarningsFeed'
import GraphicOfTheDay from '@/components/newsletter/sections/GraphicOfTheDay'
import QuoteOfTheDay from '@/components/newsletter/sections/QuoteOfTheDay'
import CommoditiesDashboard from '@/components/newsletter/sections/CommoditiesDashboard'
import VentureCapitalDashboard from '@/components/newsletter/sections/VentureCapitalDashboard'
import DruckenmillerCharts from '@/components/newsletter/sections/DruckenmillerCharts'
import FeedbackForm from '@/components/feedback/FeedbackForm'
import Link from 'next/link'

export default function Home() {
  // Get current day to determine if we show Entertainment Feed
  const today = new Date()
  const isFriday = today.getDay() === 5

  const sections = [
    { id: 'global-economy', title: 'Global Economy', icon: '🌍' },
    { id: 'economy', title: 'Australia Economy', icon: '🇦🇺' },
    { id: 'stocks', title: 'Stocks Feed', icon: '💹' },
    { id: 'commodities', title: 'Commodities & Materials', icon: '📊' },
    { id: 'crypto', title: 'Crypto Feed', icon: '₿' },
    { id: 'trading', title: 'Trading Feed', icon: '📈' },
    { id: 'property', title: 'Property Feed', icon: '🏠' },
    { id: 'ipo', title: 'IPO Feed', icon: '🚀' },
    { id: 'earnings', title: 'Earnings Feed', icon: '💰' },
    { id: 'technology', title: 'Technology Feed', icon: '💻' },
    { id: 'venture-capital', title: 'Venture Capital', icon: '💼' },
    { id: 'knowledge', title: 'Knowledge Feed', icon: '📚' },
    { id: 'graphic', title: 'Graphic of the Day', icon: '📊' },
    { id: 'quote', title: 'Quote of the Day', icon: '💭' },
    ...(isFriday ? [{ id: 'entertainment', title: 'Entertainment Feed', icon: '🎬' }] : []),
  ]

  return (
    <NewsletterLayout>
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Education Hub Prompt for Beginners */}
        <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start gap-4">
            <div className="text-4xl flex-shrink-0">🎓</div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                New to Finance? Start with Our Education Hub
              </h2>
              <p className="text-slate-700 mb-4">
                Learn the fundamentals of investing, economic indicators, and market analysis.
                Our comprehensive guides and searchable glossary will help you understand every term and concept.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/education"
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center gap-2"
                >
                  <span>Explore Education Hub</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/education/glossary"
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 rounded-lg font-semibold transition-colors duration-200"
                >
                  Browse Glossary
                </Link>
              </div>
            </div>
          </div>
        </div>

        <TableOfContents sections={sections} />

        <div className="mt-12 space-y-12">

          <section id="global-economy">
            <GlobalEconomyFeed />
          </section>

          <section id="economy">
            <EconomyFeed />
          </section>

          <section id="stocks">
            <StocksFeed />
          </section>

          <section id="commodities">
            <CommoditiesDashboard />
          </section>

          <section id="crypto">
            <CryptoFeed />
          </section>

          <section id="trading">
            <TradingFeed />
          </section>

          <section id="property">
            <PropertyFeed />
          </section>

          <section id="ipo">
            <IPOFeed />
          </section>

          <section id="earnings">
            <EarningsFeed />
          </section>

          <section id="technology">
            <TechnologyFeed />
          </section>

          <section id="venture-capital">
            <VentureCapitalDashboard />
          </section>

          <section id="knowledge">
            <KnowledgeFeed />
          </section>

          <section id="graphic">
            <GraphicOfTheDay />
          </section>

          <section id="quote">
            <QuoteOfTheDay />
          </section>

          {isFriday && (
            <section id="entertainment">
              <EntertainmentFeed />
            </section>
          )}

          <section id="feedback" className="section-card">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-4xl">💡</span>
              <span>Feedback & Suggestions</span>
            </h2>
            <p className="text-slate-600 mb-6">
              Help us improve Gekkos with your feedback and suggestions
            </p>
            <FeedbackForm />
          </section>
        </div>
      </div>

      <Footer />
    </NewsletterLayout>
  )
}
