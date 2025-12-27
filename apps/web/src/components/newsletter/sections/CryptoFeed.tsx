'use client'

import { useCryptoData } from '@/lib/hooks/useCryptoData'
import { useNews } from '@/lib/hooks/useNews'

interface Article {
  title: string
  source: string
  url: string
}

interface CryptoPrice {
  name: string
  symbol: string
  price: number
  change24h: number
  icon: string
}

export default function CryptoFeed() {
  const { data, loading, error } = useCryptoData()
  const { articles: newsArticles, loading: newsLoading } = useNews('/api/crypto-news')

  const headlineStory = {
    title: newsArticles[0]?.title || 'Bitcoin Surges Past $67K as Institutional Adoption Accelerates',
    source: newsArticles[0]?.source || 'CoinDesk',
    url: newsArticles[0]?.url || '#',
    summary: newsArticles[0]?.description || 'Bitcoin broke through the $67,000 barrier today as major institutional investors continue to accumulate positions.',
  }

  const articles: Article[] = newsArticles.slice(1, 6).map(article => ({
    title: article.title,
    source: article.source,
    url: article.url,
  }))

  // Map crypto icons
  const cryptoIcons: Record<string, string> = {
    'bitcoin': '₿',
    'ethereum': 'Ξ',
    'binancecoin': '🔶',
    'solana': '◎',
  }

  if (loading) {
    return (
      <div className="section-card animate-slide-up">
        <h2 className="section-title">
          <span className="text-3xl">₿</span>
          Crypto Feed
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="section-card animate-slide-up">
        <h2 className="section-title">
          <span className="text-3xl">₿</span>
          Crypto Feed
        </h2>
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">⚠️ Unable to load crypto data</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  const cryptoPrices: CryptoPrice[] = data?.cryptos.map((crypto: any) => ({
    name: crypto.name,
    symbol: crypto.symbol.toUpperCase(),
    price: crypto.current_price,
    change24h: crypto.price_change_percentage_24h,
    icon: cryptoIcons[crypto.id] || '🪙',
  })) || []

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <span className="text-3xl">₿</span>
        Crypto Feed
        <span className="ml-auto text-xs font-normal text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
          LIVE DATA ✨
        </span>
      </h2>

      {/* Crypto Prices Dashboard */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {cryptoPrices.length > 0 ? (
          cryptoPrices.map((crypto) => (
            <div key={crypto.symbol} className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{crypto.icon}</span>
                <span className="text-xs font-mono text-purple-200">{crypto.symbol}</span>
              </div>
              <h4 className="text-sm font-medium text-purple-100 mb-1">{crypto.name}</h4>
              <div className="text-xl font-bold mb-1">
                {crypto.price && crypto.price > 0 ? (
                  `$${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                ) : (
                  <span className="text-purple-300 text-xs">Loading price...</span>
                )}
              </div>
              <div className={`text-sm font-semibold ${(crypto.change24h || 0) >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {crypto.change24h !== null && crypto.change24h !== undefined ? (
                  <>
                    {(crypto.change24h || 0) >= 0 ? '+' : ''}{(crypto.change24h || 0).toFixed(1)}% (24h)
                  </>
                ) : (
                  <span className="text-purple-300 text-xs">-- % (24h)</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 md:col-span-4 bg-purple-100 border-2 border-purple-300 rounded-lg p-4 text-center">
            <p className="text-purple-700 font-medium">Crypto prices loading from live data...</p>
            <p className="text-purple-600 text-sm mt-1">Price data will appear here shortly</p>
          </div>
        )}
      </div>

      {/* Headline Story */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">🚀</span>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{headlineStory.title}</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">{headlineStory.summary}</p>
            <a href={headlineStory.url} target="_blank" rel="noopener noreferrer" className="article-link text-sm font-medium">
              Read full story on {headlineStory.source} →
            </a>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Latest Crypto News</h3>
        <ul className="space-y-3">
          {articles.map((article, index) => (
            <li key={index} className="flex items-start gap-3 bg-slate-50 rounded-lg p-4 hover:bg-purple-50 hover:border-purple-300 border-2 border-transparent transition-all duration-200">
              <span className="text-purple-600 font-bold text-sm mt-0.5">•</span>
              <div className="flex-1">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="article-link font-medium">
                  {article.title}
                </a>
                <p className="text-xs text-slate-500 mt-1">Source: {article.source}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Market Cap & Fear/Greed */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌐</span>
            <span className="text-sm font-medium text-purple-100">Total Crypto Market Cap</span>
          </div>
          <div className="text-3xl font-bold">
            ${data?.globalMarketCap ? (data.globalMarketCap / 1e12).toFixed(2) : '0.00'}T
          </div>
          <div className={`text-sm font-semibold ${(data?.marketCapChange24h || 0) >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {(data?.marketCapChange24h || 0) >= 0 ? '+' : ''}{(data?.marketCapChange24h || 0).toFixed(2)}% (24h)
          </div>
        </div>
        <div className={`bg-gradient-to-r ${
          data?.fearGreedIndex && data.fearGreedIndex.value >= 50
            ? 'from-green-500 to-emerald-600'
            : 'from-orange-500 to-red-600'
        } text-white rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{data?.fearGreedIndex && data.fearGreedIndex.value >= 50 ? '😊' : '😰'}</span>
            <span className="text-sm font-medium text-white opacity-90">Fear & Greed Index</span>
          </div>
          <div className="text-3xl font-bold">
            {data?.fearGreedIndex?.value || 'N/A'} {data?.fearGreedIndex && '/ 100'}
          </div>
          <div className="text-sm text-white opacity-90 font-semibold">
            {data?.fearGreedIndex?.classification || 'Loading...'}
          </div>
        </div>
      </div>
    </div>
  )
}
