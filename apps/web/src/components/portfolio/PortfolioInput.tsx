'use client'

import { useState } from 'react'

interface Holding {
  symbol: string
  name: string
  type: 'stock' | 'crypto' | 'property' | 'etf' | 'fund'
  quantity: number
  keywords?: string[]
}

interface StockData {
  symbol: string
  price?: number
  change?: number
  changePercent?: number
  lastUpdate?: string
}

interface PortfolioInputProps {
  onAddHolding?: (holding: Holding) => void
  onTogglePortfolio?: (enabled: boolean) => void
}

export default function PortfolioInput({ onAddHolding, onTogglePortfolio }: PortfolioInputProps) {
  const [showInput, setShowInput] = useState(false)
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [stockData, setStockData] = useState<Record<string, StockData>>({})
  const [loadingStock, setLoadingStock] = useState<string | null>(null)
  const [formData, setFormData] = useState<Holding>({
    symbol: '',
    name: '',
    type: 'stock',
    quantity: 0,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseFloat(value) || 0 : value,
    })
  }

  const fetchStockData = async (holding: Holding) => {
    setLoadingStock(holding.symbol)
    try {
      const response = await fetch(`/api/market-data?symbol=${encodeURIComponent(holding.symbol)}`)
      if (response.ok) {
        const data = await response.json()
        setStockData((prev) => ({
          ...prev,
          [holding.symbol]: {
            symbol: holding.symbol,
            price: data.price,
            change: data.change,
            changePercent: data.changePercent,
            lastUpdate: new Date().toISOString(),
          },
        }))
      }
    } catch (error) {
      console.error(`Failed to fetch data for ${holding.symbol}:`, error)
    } finally {
      setLoadingStock(null)
    }
  }

  const handleAddHolding = async () => {
    if (!formData.symbol || !formData.name || formData.quantity <= 0) {
      alert('Please fill all fields')
      return
    }

    // Auto-generate keywords from name and symbol
    const keywords = [
      formData.symbol,
      formData.name,
      ...formData.name.toLowerCase().split(' '),
    ]

    const newHolding = { ...formData, keywords }
    setHoldings([...holdings, newHolding])

    if (onAddHolding) {
      onAddHolding(newHolding)
    }

    // Fetch stock data for the holding
    await fetchStockData(newHolding)

    // Reset form
    setFormData({
      symbol: '',
      name: '',
      type: 'stock',
      quantity: 0,
    })
  }

  const handleRemoveHolding = (index: number) => {
    setHoldings(holdings.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <button
        onClick={() => {
          setShowInput(!showInput)
          onTogglePortfolio?.(!showInput)
        }}
        className="flex items-center gap-2 px-4 py-3 bg-gecko-100 hover:bg-gecko-200 border-2 border-gecko-300 rounded-lg transition-colors duration-200 text-gecko-900 font-semibold"
      >
        <span className="text-xl">💼</span>
        <span>{showInput ? 'Hide' : 'Add'} My Portfolio</span>
      </button>

      {/* Input Form */}
      {showInput && (
        <div className="bg-white border-2 border-gecko-200 rounded-lg p-6 space-y-4 shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Add Investment Holding</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Symbol */}
            <input
              type="text"
              name="symbol"
              placeholder="Symbol (e.g., ASX:CBA, BTC, PROPERTY:Sydney-CBD)"
              value={formData.symbol}
              onChange={handleInputChange}
              className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
            />

            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Name (e.g., Commonwealth Bank, Bitcoin)"
              value={formData.name}
              onChange={handleInputChange}
              className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
            />

            {/* Type */}
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
            >
              <option value="stock">📈 Stock</option>
              <option value="crypto">₿ Cryptocurrency</option>
              <option value="property">🏠 Property</option>
              <option value="etf">💼 ETF</option>
              <option value="fund">📊 Fund</option>
            </select>

            {/* Quantity */}
            <input
              type="number"
              name="quantity"
              placeholder="Quantity owned"
              value={formData.quantity || ''}
              onChange={handleInputChange}
              step="0.001"
              className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddHolding}
            className="w-full px-4 py-3 bg-gecko-500 hover:bg-gecko-600 text-white font-bold rounded-lg transition-colors duration-200"
          >
            ➕ Add Holding
          </button>
        </div>
      )}

      {/* Holdings List */}
      {holdings.length > 0 && (
        <div className="bg-gecko-50 border-2 border-gecko-200 rounded-lg p-6 space-y-3">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            My Holdings ({holdings.length})
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {holdings.map((holding, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-4 rounded-lg border-l-4 border-gecko-500"
              >
                <div className="flex-1">
                  <div className="font-bold text-slate-900">
                    {holding.symbol} - {holding.name}
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className="mr-4">
                      {holding.type === 'stock' && '📈'}
                      {holding.type === 'crypto' && '₿'}
                      {holding.type === 'property' && '🏠'}
                      {holding.type === 'etf' && '💼'}
                      {holding.type === 'fund' && '📊'} {holding.type}
                    </span>
                    <span>Qty: {holding.quantity}</span>
                  </div>
                  {stockData[holding.symbol] && (
                    <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                      {loadingStock === holding.symbol ? (
                        <span className="animate-spin">⏳ Fetching data...</span>
                      ) : (
                        <>
                          {stockData[holding.symbol].price && (
                            <>
                              <span>${stockData[holding.symbol].price?.toFixed(2)}</span>
                              {stockData[holding.symbol].change !== undefined && (
                                <span
                                  className={
                                    (stockData[holding.symbol].change ?? 0) >= 0
                                      ? 'text-green-600'
                                      : 'text-red-600'
                                  }
                                >
                                  ({stockData[holding.symbol].change?.toFixed(2)} {stockData[holding.symbol].changePercent?.toFixed(2)}%)
                                </span>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleRemoveHolding(index)}
                  className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors duration-200"
                >
                  ✕ Remove
                </button>
              </div>
            ))}
          </div>

          {/* Info */}
          <p className="text-xs text-slate-600 mt-4 pt-4 border-t border-gecko-200">
            📌 Your holdings will be used to fetch personalized news from the internet
            about these investments. News will appear in a dedicated section below.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!showInput && holdings.length === 0 && (
        <p className="text-sm text-slate-600 italic px-4 py-2">
          Add your investments to get personalized news and insights
        </p>
      )}
    </div>
  )
}
