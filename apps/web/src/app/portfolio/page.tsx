'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PortfolioAsset {
  symbol: string
  name: string
  type: 'stock' | 'crypto' | 'property'
  quantity: number
  currentPrice: number
  purchasePrice: number
}

interface NewsArticle {
  id: string
  title: string
  content: string
  source: string
  sourceUrl: string
  publishedAt: string
  category: string
}

export default function PortfolioPage() {
  const [assets, setAssets] = useState<PortfolioAsset[]>([])
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)

  // Form states for adding new assets
  const [newAsset, setNewAsset] = useState({
    symbol: '',
    name: '',
    type: 'stock' as 'stock' | 'crypto' | 'property',
    quantity: 0,
    currentPrice: 0,
    purchasePrice: 0,
  })

  const calculateValue = (asset: PortfolioAsset) => {
    return asset.quantity * asset.currentPrice
  }

  const calculateGainLoss = (asset: PortfolioAsset) => {
    const current = asset.quantity * asset.currentPrice
    const purchase = asset.quantity * asset.purchasePrice
    return current - purchase
  }

  const calculateGainLossPercent = (asset: PortfolioAsset) => {
    const gainLoss = calculateGainLoss(asset)
    const purchase = asset.quantity * asset.purchasePrice
    return purchase === 0 ? 0 : (gainLoss / purchase) * 100
  }

  const addAsset = () => {
    if (newAsset.symbol && newAsset.name) {
      setAssets([...assets, { ...newAsset }])
      setNewAsset({
        symbol: '',
        name: '',
        type: 'stock',
        quantity: 0,
        currentPrice: 0,
        purchasePrice: 0,
      })
    }
  }

  const removeAsset = (symbol: string) => {
    setAssets(assets.filter(asset => asset.symbol !== symbol))
  }

  const totalPortfolioValue = assets.reduce((sum, asset) => sum + calculateValue(asset), 0)
  const totalGainLoss = assets.reduce((sum, asset) => sum + calculateGainLoss(asset), 0)
  const totalGainLossPercent = totalPortfolioValue === 0 ? 0 : (totalGainLoss / (totalPortfolioValue - totalGainLoss)) * 100

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      stock: '💹',
      crypto: '₿',
      property: '🏠',
    }
    return icons[type] || '💼'
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      stock: 'bg-blue-100 text-blue-800',
      crypto: 'bg-purple-100 text-purple-800',
      property: 'bg-green-100 text-green-800',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold hover:text-blue-100 transition-colors">
                🦎 Gekkos
              </Link>
              <span className="text-blue-300">|</span>
              <h1 className="text-xl font-semibold">💼 Track Your Portfolio</h1>
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
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Portfolio Value</h3>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalPortfolioValue)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Gain/Loss</h3>
            <p className={`text-3xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalGainLoss)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Return</h3>
            <p className={`text-3xl font-bold ${totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGainLossPercent.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setNewAsset({ ...newAsset, type: 'stock' })}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <div className="text-4xl mb-2">💹</div>
            <h3 className="text-xl font-bold mb-1">Add Stock Holdings</h3>
            <p className="text-sm text-blue-100">Track ASX & international shares</p>
          </button>

          <button
            onClick={() => setNewAsset({ ...newAsset, type: 'property' })}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
          >
            <div className="text-4xl mb-2">🏠</div>
            <h3 className="text-xl font-bold mb-1">Add Property Holdings</h3>
            <p className="text-sm text-green-100">Monitor Australian real estate</p>
          </button>

          <button
            onClick={() => setNewAsset({ ...newAsset, type: 'crypto' })}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <div className="text-4xl mb-2">₿</div>
            <h3 className="text-xl font-bold mb-1">Add Crypto Holdings</h3>
            <p className="text-sm text-purple-100">Track digital assets & tokens</p>
          </button>
        </div>

        {/* Add New Asset Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {newAsset.type === 'stock' && '💹 Add Stock'}
              {newAsset.type === 'property' && '🏠 Add Property'}
              {newAsset.type === 'crypto' && '₿ Add Crypto'}
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(newAsset.type)}`}>
              {newAsset.type.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder={
                newAsset.type === 'stock' ? 'Ticker (e.g., CBA)' :
                newAsset.type === 'crypto' ? 'Symbol (e.g., BTC)' :
                'Address/ID'
              }
              value={newAsset.symbol}
              onChange={(e) => setNewAsset({ ...newAsset, symbol: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder={
                newAsset.type === 'stock' ? 'Company Name' :
                newAsset.type === 'crypto' ? 'Crypto Name' :
                'Property Name'
              }
              value={newAsset.name}
              onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newAsset.type}
              onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value as any })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="stock">Stock</option>
              <option value="crypto">Crypto</option>
              <option value="property">Property</option>
            </select>
            <input
              type="number"
              placeholder={newAsset.type === 'property' ? '# Properties' : 'Quantity'}
              value={newAsset.quantity || ''}
              onChange={(e) => setNewAsset({ ...newAsset, quantity: parseFloat(e.target.value) || 0 })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Current Price (AUD)"
              value={newAsset.currentPrice || ''}
              onChange={(e) => setNewAsset({ ...newAsset, currentPrice: parseFloat(e.target.value) || 0 })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addAsset}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add {newAsset.type}
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              {newAsset.type === 'stock' && '💡 Add ASX stocks (CBA, BHP) or international shares. News will be fetched automatically based on your holdings.'}
              {newAsset.type === 'property' && '💡 Track Australian property investments. Monitor market trends, price changes, and relevant property news.'}
              {newAsset.type === 'crypto' && '💡 Monitor cryptocurrency portfolios. Get real-time updates on Bitcoin, Ethereum, and other digital assets.'}
            </p>
          </div>
        </div>

        {/* Assets List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Assets</h2>
          </div>
          {assets.length === 0 ? (
            <div className="p-12 text-center text-gray-600">
              <p>No assets tracked yet. Add your first asset above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Gain/Loss</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Return</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {assets.map((asset) => (
                    <tr key={asset.symbol} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(asset.type)}`}>
                          {getTypeIcon(asset.type)} {asset.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{asset.symbol}</td>
                      <td className="px-6 py-4 text-gray-600">{asset.name}</td>
                      <td className="px-6 py-4 text-right text-gray-900">{asset.quantity}</td>
                      <td className="px-6 py-4 text-right text-gray-900">{formatCurrency(asset.currentPrice)}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(calculateValue(asset))}</td>
                      <td className={`px-6 py-4 text-right font-medium ${calculateGainLoss(asset) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(calculateGainLoss(asset))}
                      </td>
                      <td className={`px-6 py-4 text-right font-medium ${calculateGainLossPercent(asset) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calculateGainLossPercent(asset).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => removeAsset(asset.symbol)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Related News Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📰 Personalised Market News</h2>

          {assets.length === 0 ? (
            <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
              <div className="text-5xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add holdings to see personalised news</h3>
              <p className="text-gray-600 mb-4">
                Once you add stocks, property, or crypto to your portfolio, we'll automatically fetch relevant news articles and market updates.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-1">💹</div>
                  <p className="font-medium text-blue-900">Stock News</p>
                  <p className="text-blue-700 text-xs">Company announcements, earnings, analyst ratings</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-1">🏠</div>
                  <p className="font-medium text-green-900">Property Updates</p>
                  <p className="text-green-700 text-xs">Market trends, price movements, regulations</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl mb-1">₿</div>
                  <p className="font-medium text-purple-900">Crypto Alerts</p>
                  <p className="text-purple-700 text-xs">Price actions, blockchain news, DeFi updates</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">
                Showing news for {assets.length} asset{assets.length !== 1 ? 's' : ''} in your portfolio.
                News is fetched from trusted sources and filtered based on your holdings.
              </p>

              {/* News Categories Based on Portfolio */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {assets.some(a => a.type === 'stock') && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">💹</span>
                      <h3 className="font-bold text-blue-900">Stock News</h3>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">
                      Tracking {assets.filter(a => a.type === 'stock').length} stock{assets.filter(a => a.type === 'stock').length !== 1 ? 's' : ''}
                    </p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      {assets.filter(a => a.type === 'stock').slice(0, 3).map(a => (
                        <li key={a.symbol}>• {a.symbol} - {a.name}</li>
                      ))}
                      {assets.filter(a => a.type === 'stock').length > 3 && (
                        <li className="font-medium">+ {assets.filter(a => a.type === 'stock').length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}

                {assets.some(a => a.type === 'property') && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🏠</span>
                      <h3 className="font-bold text-green-900">Property News</h3>
                    </div>
                    <p className="text-sm text-green-700 mb-2">
                      Tracking {assets.filter(a => a.type === 'property').length} propert{assets.filter(a => a.type === 'property').length !== 1 ? 'ies' : 'y'}
                    </p>
                    <ul className="text-xs text-green-600 space-y-1">
                      {assets.filter(a => a.type === 'property').slice(0, 3).map(a => (
                        <li key={a.symbol}>• {a.name}</li>
                      ))}
                      {assets.filter(a => a.type === 'property').length > 3 && (
                        <li className="font-medium">+ {assets.filter(a => a.type === 'property').length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}

                {assets.some(a => a.type === 'crypto') && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">₿</span>
                      <h3 className="font-bold text-purple-900">Crypto News</h3>
                    </div>
                    <p className="text-sm text-purple-700 mb-2">
                      Tracking {assets.filter(a => a.type === 'crypto').length} crypto asset{assets.filter(a => a.type === 'crypto').length !== 1 ? 's' : ''}
                    </p>
                    <ul className="text-xs text-purple-600 space-y-1">
                      {assets.filter(a => a.type === 'crypto').slice(0, 3).map(a => (
                        <li key={a.symbol}>• {a.symbol} - {a.name}</li>
                      ))}
                      {assets.filter(a => a.type === 'crypto').length > 3 && (
                        <li className="font-medium">+ {assets.filter(a => a.type === 'crypto').length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">🔍 How it works:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• News articles are automatically fetched based on your holdings</li>
                  <li>• Articles include company announcements, market analysis, and expert insights</li>
                  <li>• Links to original sources for in-depth research</li>
                  <li>• Updates refresh periodically throughout the trading day</li>
                </ul>
                <Link
                  href="/news"
                  className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View All Market News →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
