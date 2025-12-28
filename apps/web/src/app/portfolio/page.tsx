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

        {/* Add New Asset Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Asset</h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Symbol (e.g., AAPL)"
              value={newAsset.symbol}
              onChange={(e) => setNewAsset({ ...newAsset, symbol: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Name"
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
              placeholder="Quantity"
              value={newAsset.quantity || ''}
              onChange={(e) => setNewAsset({ ...newAsset, quantity: parseFloat(e.target.value) || 0 })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Current Price"
              value={newAsset.currentPrice || ''}
              onChange={(e) => setNewAsset({ ...newAsset, currentPrice: parseFloat(e.target.value) || 0 })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addAsset}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Asset
            </button>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">📰 Related Market News</h2>
          <p className="text-gray-600 mb-4">
            Track news related to your portfolio assets. Visit the{' '}
            <Link href="/news" className="text-blue-600 hover:text-blue-800 font-medium">
              News Intelligence page
            </Link>{' '}
            for comprehensive market coverage.
          </p>
        </div>
      </div>
    </div>
  )
}
