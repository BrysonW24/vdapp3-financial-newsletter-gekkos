'use client';

import { useState, useEffect } from 'react';

interface Commodity {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  category: 'precious_metals' | 'ai_materials' | 'space_tech';
  trend: 'up' | 'down' | 'neutral';
  signal?: 'bullish' | 'bearish' | 'neutral';
}

export default function CommoditiesDashboard() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'precious_metals' | 'ai_materials' | 'space_tech'>('precious_metals');

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const response = await fetch('/api/commodities/overview');
        const data = await response.json();

        if (data && data.commodities) {
          setCommodities(data.commodities);
        } else {
          // Fallback commodity data
          setCommodities([
            { symbol: 'GOLD', name: 'Gold', price: 2075.50, change: 25.50, changePercent: 1.24, category: 'precious_metals', trend: 'up', signal: 'bullish' },
            { symbol: 'SILVER', name: 'Silver', price: 31.25, change: -0.75, changePercent: -2.35, category: 'precious_metals', trend: 'down' },
            { symbol: 'COPPER', name: 'Copper', price: 4.85, change: 0.15, changePercent: 3.19, category: 'precious_metals', trend: 'up' },
            { symbol: 'LITHIUM', name: 'Lithium', price: 89.75, change: 5.25, changePercent: 6.21, category: 'ai_materials', trend: 'up', signal: 'bullish' },
            { symbol: 'SEMI', name: 'Semiconductors', price: 1250.00, change: 50.00, changePercent: 4.17, category: 'ai_materials', trend: 'up' },
            { symbol: 'REE', name: 'Rare Earth', price: 145.50, change: -8.50, changePercent: -5.51, category: 'ai_materials', trend: 'down' },
            { symbol: 'TITANIUM', name: 'Titanium', price: 18.50, change: 1.50, changePercent: 8.81, category: 'space_tech', trend: 'up', signal: 'bullish' },
            { symbol: 'TUNGSTEN', name: 'Tungsten', price: 625.00, change: 25.00, changePercent: 4.17, category: 'space_tech', trend: 'up' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch commodities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommodities();
  }, []);

  const categories = [
    { id: 'precious_metals', label: '💎 Precious Metals', icon: '💍' },
    { id: 'ai_materials', label: '🤖 AI Materials', icon: '⚡' },
    { id: 'space_tech', label: '🚀 Space Tech', icon: '🛸' },
  ];

  const filteredCommodities = commodities.filter(c => c.category === activeCategory);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getSignalColor = (signal?: string) => {
    switch (signal) {
      case 'bullish': return 'bg-green-100 text-green-800 border-green-200';
      case 'bearish': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriceColor = (changePercent: number) => {
    if (changePercent > 0) return 'text-green-600';
    if (changePercent < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <span className="text-3xl">📊</span>
        Commodities & Materials Tracker
      </h2>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Commodities Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4 w-2/3"></div>
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))
        ) : filteredCommodities.length > 0 ? (
          filteredCommodities.map((commodity, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{commodity.name}</h3>
                  <p className="text-sm text-gray-600 font-medium">{commodity.symbol}</p>
                </div>
                <div className="text-2xl">{getTrendIcon(commodity.trend)}</div>
              </div>

              {/* Price Section */}
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">${commodity.price.toFixed(2)}</div>
                <div className={`text-lg font-semibold mt-2 ${getPriceColor(commodity.changePercent)}`}>
                  {commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%
                </div>
              </div>

              {/* Signal Badge */}
              {commodity.signal && (
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getSignalColor(commodity.signal)}`}>
                    {commodity.signal.toUpperCase()} SIGNAL
                  </span>
                </div>
              )}

              {/* Change Amount */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Change</span>
                  <span className={`font-semibold ${getPriceColor(commodity.changePercent)}`}>
                    {commodity.change > 0 ? '+' : ''}{commodity.change.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p>No data available for this category</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-semibold">Average Change</p>
          <p className="text-2xl font-bold text-blue-900 mt-2">
            {filteredCommodities.length > 0
              ? ((filteredCommodities.reduce((sum, c) => sum + c.changePercent, 0) / filteredCommodities.length).toFixed(2))
              : '0.00'
            }%
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 font-semibold">Gainers</p>
          <p className="text-2xl font-bold text-green-900 mt-2">
            {filteredCommodities.filter(c => c.changePercent > 0).length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-red-600 font-semibold">Losers</p>
          <p className="text-2xl font-bold text-red-900 mt-2">
            {filteredCommodities.filter(c => c.changePercent < 0).length}
          </p>
        </div>
      </div>

      {/* Load More Button */}
      <div className="mt-8 text-center">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
          View Full Analysis
        </button>
      </div>
    </div>
  );
}
