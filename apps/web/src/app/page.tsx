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
    ...(portfolioEnabled ? [{ id: 'portfolio', title: 'My Portfolio News', icon: '💼' }] : []),
    ...(isFriday ? [{ id: 'entertainment', title: 'Entertainment Feed', icon: '🎬' }] : []),
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

          {/* Thanks for Reading Section */}
          <section className="section-card text-center bg-gradient-to-br from-gecko-500 to-gecko-600 text-white">
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="text-6xl animate-bounce">🦎</div>
              <h2 className="text-3xl font-bold">Thanks for reading Gekkos!</h2>
              <p className="text-lg text-white/90">
                See you tomorrow with more finance insights and market updates.
              </p>
            </div>
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
