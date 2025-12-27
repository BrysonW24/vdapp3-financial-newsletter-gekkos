'use client'

import { useState } from 'react'
import NewsletterLayout from '@/components/newsletter/NewsletterLayout'
import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import TableOfContents from '@/components/newsletter/TableOfContents'
import TradingFeed from '@/components/newsletter/sections/TradingFeed'
import PropertyFeed from '@/components/newsletter/sections/PropertyFeed'
import StocksFeed from '@/components/newsletter/sections/StocksFeed'
import CryptoFeed from '@/components/newsletter/sections/CryptoFeed'
import EconomyFeed from '@/components/newsletter/sections/EconomyFeed'
import TechnologyFeed from '@/components/newsletter/sections/TechnologyFeed'
import KnowledgeFeed from '@/components/newsletter/sections/KnowledgeFeed'
import EntertainmentFeed from '@/components/newsletter/sections/EntertainmentFeed'
import IPOFeed from '@/components/newsletter/sections/IPOFeed'
import EarningsFeed from '@/components/newsletter/sections/EarningsFeed'
import GraphicOfTheDay from '@/components/newsletter/sections/GraphicOfTheDay'
import QuoteOfTheDay from '@/components/newsletter/sections/QuoteOfTheDay'
import GlobalPolitics from '@/components/newsletter/sections/GlobalPolitics'
import CommoditiesDashboard from '@/components/newsletter/sections/CommoditiesDashboard'
import VentureCapitalDashboard from '@/components/newsletter/sections/VentureCapitalDashboard'
import DruckenmillerCharts from '@/components/newsletter/sections/DruckenmillerCharts'
import PortfolioInput from '@/components/portfolio/PortfolioInput'
import PortfolioDashboard from '@/components/portfolio/PortfolioDashboard'
import FeedbackForm from '@/components/feedback/FeedbackForm'

export default function Home() {
  // Portfolio state
  const [portfolioEnabled, setPortfolioEnabled] = useState(false)

  // Get current day to determine if we show Entertainment Feed
  const today = new Date()
  const isFriday = today.getDay() === 5

  const sections = [
    { id: 'trading', title: 'Trading Feed', icon: '📈' },
    { id: 'property', title: 'Property Feed', icon: '🏠' },
    { id: 'stocks', title: 'Stocks Feed', icon: '💹' },
    { id: 'crypto', title: 'Crypto Feed', icon: '₿' },
    { id: 'earnings-ipo', title: 'Earnings & IPO Feed', icon: '📈' },
    { id: 'economy', title: 'Economy Feed', icon: '🏦' },
    { id: 'global-politics', title: 'Global Politics', icon: '🌍' },
    { id: 'technology', title: 'Technology Feed', icon: '💻' },
    { id: 'knowledge', title: 'Knowledge Feed', icon: '📚' },
    { id: 'commodities', title: 'Commodities & Materials', icon: '📊' },
    { id: 'venture-capital', title: 'Venture Capital', icon: '💼' },
    ...(isFriday ? [{ id: 'entertainment', title: 'Entertainment Feed', icon: '🎬' }] : []),
    ...(portfolioEnabled ? [{ id: 'portfolio', title: 'My Portfolio News', icon: '💼' }] : []),
    { id: 'graphic', title: 'Graphic of the Day', icon: '📊' },
    { id: 'quote', title: 'Quote of the Day', icon: '💭' },
  ]

  return (
    <NewsletterLayout>
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <TableOfContents sections={sections} />

        {/* Portfolio Input Section */}
        <div className="mt-12 mb-12">
          <PortfolioInput onTogglePortfolio={setPortfolioEnabled} />
        </div>

        <div className="mt-12 space-y-12">
          {/* Portfolio Dashboard (if enabled) */}
          {portfolioEnabled && (
            <PortfolioDashboard isEnabled={portfolioEnabled} />
          )}

          <section id="trading">
            <TradingFeed />
          </section>

          <section id="property">
            <PropertyFeed />
          </section>

          <section id="stocks">
            <StocksFeed />
          </section>

          <section id="crypto">
            <CryptoFeed />
          </section>

          <section id="earnings-ipo">
            <div className="grid gap-8 md:grid-cols-2">
              <IPOFeed />
              <EarningsFeed />
            </div>
          </section>

          <section id="economy">
            <EconomyFeed />
          </section>

          <section id="global-politics">
            <GlobalPolitics />
          </section>

          <section id="technology">
            <TechnologyFeed />
          </section>

          <section id="knowledge">
            <KnowledgeFeed />
          </section>

          <section id="commodities">
            <CommoditiesDashboard />
          </section>

          <section id="venture-capital">
            <VentureCapitalDashboard />
          </section>

          {isFriday && (
            <section id="entertainment">
              <EntertainmentFeed />
            </section>
          )}

          <section id="graphic">
            <GraphicOfTheDay />
          </section>

          <section id="quote">
            <QuoteOfTheDay />
          </section>

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
