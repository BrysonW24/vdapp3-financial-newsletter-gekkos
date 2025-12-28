'use client'

import { useState } from 'react'
import Link from 'next/link'

// Chart categories based on Druckenmiller's 272 chart methodology
const chartCategories = [
  { id: 'equities', name: 'Equities', icon: '💹', color: 'blue', count: 90 },
  { id: 'commodities', name: 'Commodities', icon: '📊', color: 'amber', count: 65 },
  { id: 'currencies', name: 'Currencies', icon: '💱', color: 'green', count: 55 },
  { id: 'fixed-income', name: 'Fixed Income', icon: '📈', color: 'purple', count: 50 },
  { id: 'volatility', name: 'Volatility & Internals', icon: '⚡', color: 'red', count: 12 },
]

const timeframes = [
  { id: 'daily', name: 'Daily', prediction: '8-20 Days' },
  { id: 'weekly', name: 'Weekly', prediction: '8-20 Weeks' },
  { id: 'monthly', name: 'Monthly', prediction: '8-20 Months' },
]

const australianMarkets = [
  { symbol: 'ASX200', name: 'ASX 200 Index', category: 'equities' },
  { symbol: 'CBA', name: 'Commonwealth Bank', category: 'equities' },
  { symbol: 'BHP', name: 'BHP Group', category: 'equities' },
  { symbol: 'AUDUSD', name: 'AUD/USD', category: 'currencies' },
  { symbol: 'IRON', name: 'Iron Ore', category: 'commodities' },
  { symbol: 'AU10Y', name: 'Australian 10Y Bond', category: 'fixed-income' },
]

export default function EconomicChartsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold hover:text-indigo-100 transition-colors">
                🦎 Gekkos
              </Link>
              <span className="text-indigo-300">|</span>
              <h1 className="text-xl font-semibold">📈 Economic Charts</h1>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              ← Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8 mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="text-6xl">📊</div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-3">Stan Druckenmiller's 272 Chart Methodology</h2>
              <p className="text-lg text-indigo-100 mb-4">
                Professional-grade macro investing charts covering global equities, commodities, currencies, and fixed income markets.
                Each chart viewed across daily, weekly, and monthly timeframes to predict trends for 8-20 periods.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/docs/DRUCKENMILLER_CHARTS.md"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm"
                >
                  📚 Read Documentation
                </Link>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium text-sm border border-white/30">
                  📥 Export to PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {chartCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{cat.count}</div>
              <div className="text-sm text-gray-600">{cat.name}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Class
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Markets ({chartCategories.reduce((sum, c) => sum + c.count, 0)} charts)</option>
                {chartCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name} ({cat.count} charts)
                  </option>
                ))}
              </select>
            </div>

            {/* Timeframe Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeframe
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeframes.map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setSelectedTimeframe(tf.id)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      selectedTimeframe === tf.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div>{tf.name}</div>
                    <div className="text-xs opacity-75">{tf.prediction}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Australian Markets Quick Access */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🇦🇺</span>
            <span>Australian Markets</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {australianMarkets.map((market) => (
              <button
                key={market.symbol}
                className="p-3 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
              >
                <div className="font-bold text-gray-900 text-sm">{market.symbol}</div>
                <div className="text-xs text-gray-600 mt-1">{market.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'Key Markets Overview' : chartCategories.find(c => c.id === selectedCategory)?.name}
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                Updates Daily
              </span>
            </div>
          </div>

          {/* Australian Markets - Always shown when 'all' or 'equities' selected */}
          {(selectedCategory === 'all' || selectedCategory === 'equities') && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🇦🇺</span>
                <span>Australian Equities</span>
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ASX 200 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">ASX 200</h5>
                    <p className="text-xs text-gray-600">Australian Market Index</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=ASX%3AXJO&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* Commonwealth Bank (CBA) */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">CBA</h5>
                    <p className="text-xs text-gray-600">Commonwealth Bank</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=ASX%3ACBA&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* BHP Group */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">BHP</h5>
                    <p className="text-xs text-gray-600">BHP Group</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=ASX%3ABHP&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* CSL Limited */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">CSL</h5>
                    <p className="text-xs text-gray-600">CSL Limited</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=ASX%3ACSL&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* NAB */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">NAB</h5>
                    <p className="text-xs text-gray-600">National Australia Bank</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=ASX%3ANAB&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* Westpac */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">WBC</h5>
                    <p className="text-xs text-gray-600">Westpac Banking</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=ASX%3AWBC&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Global Markets */}
          {(selectedCategory === 'all' || selectedCategory === 'equities') && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🌍</span>
                <span>Global Equities</span>
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* S&P 500 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">S&P 500</h5>
                    <p className="text-xs text-gray-600">US Market Index</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=SP%3ASPX&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* NASDAQ */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">NASDAQ</h5>
                    <p className="text-xs text-gray-600">US Tech Index</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=NASDAQ%3ANDX&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* Dow Jones */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">Dow Jones</h5>
                    <p className="text-xs text-gray-600">US Industrial Average</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=DJ%3ADJI&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* FTSE 100 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">FTSE 100</h5>
                    <p className="text-xs text-gray-600">UK Market Index</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=TVC%3AUKG&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* Nikkei 225 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">Nikkei 225</h5>
                    <p className="text-xs text-gray-600">Japan Market Index</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=TVC%3ANI225&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* Hang Seng */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">Hang Seng</h5>
                    <p className="text-xs text-gray-600">Hong Kong Index</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=HSI%3AHSI&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Commodities */}
          {(selectedCategory === 'all' || selectedCategory === 'commodities') && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>📊</span>
                <span>Commodities</span>
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gold */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">Gold</h5>
                    <p className="text-xs text-gray-600">XAUUSD</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=OANDA%3AXAUUSD&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* Silver */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">Silver</h5>
                    <p className="text-xs text-gray-600">XAGUSD</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=OANDA%3AXAGUSD&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* Crude Oil */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">Crude Oil</h5>
                    <p className="text-xs text-gray-600">WTI</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=TVC%3AUSOIL&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* Natural Gas */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">Natural Gas</h5>
                    <p className="text-xs text-gray-600">Henry Hub</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=NYMEX%3ANG1!&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* Copper */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">Copper</h5>
                    <p className="text-xs text-gray-600">Base Metal</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=COMEX%3AHG1!&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* Iron Ore */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">Iron Ore</h5>
                    <p className="text-xs text-gray-600">Australian Export</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=SGX%3AIRO&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Currencies */}
          {(selectedCategory === 'all' || selectedCategory === 'currencies') && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>💱</span>
                <span>Currencies</span>
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AUD/USD */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">AUD/USD</h5>
                    <p className="text-xs text-gray-600">Australian Dollar</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=FX%3AAUDUSD&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* EUR/USD */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">EUR/USD</h5>
                    <p className="text-xs text-gray-600">Euro / US Dollar</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=FX%3AEURUSD&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* GBP/USD */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">GBP/USD</h5>
                    <p className="text-xs text-gray-600">British Pound</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=FX%3AGBPUSD&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* USD/JPY */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">USD/JPY</h5>
                    <p className="text-xs text-gray-600">Japanese Yen</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=FX%3AUSDJPY&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* DXY - Dollar Index */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">DXY</h5>
                    <p className="text-xs text-gray-600">US Dollar Index</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=TVC%3ADXY&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* USD/CNY */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">USD/CNY</h5>
                    <p className="text-xs text-gray-600">Chinese Yuan</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=FX%3AUSDCNY&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fixed Income */}
          {(selectedCategory === 'all' || selectedCategory === 'fixed-income') && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>📈</span>
                <span>Fixed Income</span>
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* US 2Y Treasury */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">US 2Y Treasury</h5>
                    <p className="text-xs text-gray-600">Short-Term Yield</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=TVC%3AUS02Y&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* US 10Y Treasury */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">US 10Y Treasury</h5>
                    <p className="text-xs text-gray-600">Bond Yield</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=TVC%3AUS10Y&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* AU 10Y Bond */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">AU 10Y Bond</h5>
                    <p className="text-xs text-gray-600">Australian Government Bond</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=TVC%3AAU10Y&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Volatility */}
          {selectedCategory === 'volatility' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>⚡</span>
                <span>Volatility & Market Internals</span>
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* VIX */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">VIX</h5>
                    <p className="text-xs text-gray-600">Volatility Index</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=TVC%3AVIX&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* Bitcoin */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">Bitcoin</h5>
                    <p className="text-xs text-gray-600">BTC/USD</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=BITSTAMP%3ABTCUSD&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>

                {/* Ethereum */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-900">Ethereum</h5>
                    <p className="text-xs text-gray-600">ETH/USD</p>
                  </div>
                  <div className="h-96">
                    <iframe
                      src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=BITSTAMP%3AETHUSD&interval=${selectedTimeframe === 'daily' ? 'D' : selectedTimeframe === 'weekly' ? 'W' : 'M'}&theme=light&style=1&hide_side_toolbar=false&allow_symbol_change=false&save_image=false&studies=%5B%5D&show_popup_button=true&popup_width=1000&popup_height=650&locale=en`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowTransparency={true}
                      scrolling="no"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Druckenmiller Philosophy */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>Druckenmiller's Investment Philosophy</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Core Principles:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>75-80% Fundamentals:</strong> Deep macro research drives ideas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>20-25% Technicals:</strong> Charts confirm timing and conviction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Concentrated Bets:</strong> When aligned, bet big (20%+ of portfolio)</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Decision Framework:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 p-2 bg-green-100 rounded">
                  <span className="text-green-700 font-bold">✅</span>
                  <span className="text-green-900"><strong>Strong Fundamental + Strong Chart = BIG BET</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-yellow-100 rounded">
                  <span className="text-yellow-700 font-bold">⚠️</span>
                  <span className="text-yellow-900"><strong>Strong Fundamental + Weak Chart = WAIT</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-red-100 rounded">
                  <span className="text-red-700 font-bold">❌</span>
                  <span className="text-red-900"><strong>Weak Fundamental + Strong Chart = NO TRADE</strong></span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4 italic">
            "Charts keep you honest. Fundamentals generate the idea. Technicals decide whether you should act on it." — Stan Druckenmiller
          </p>
        </div>

        {/* Resources */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📚 Learn More</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="https://asymmetryobservations.com/2018/10/03/stanley-druckenmiller-on-his-use-of-technical-analysis-and-instinct/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <h4 className="font-bold text-gray-900 mb-1">Druckenmiller on Technical Analysis</h4>
              <p className="text-sm text-gray-600">Asymmetry Observations</p>
            </Link>
            <Link
              href="https://market-bulls.com/stanley-druckenmiller-trading-strategy/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <h4 className="font-bold text-gray-900 mb-1">Druckenmiller Trading Strategy</h4>
              <p className="text-sm text-gray-600">MarketBulls</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
