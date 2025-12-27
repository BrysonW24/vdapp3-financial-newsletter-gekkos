'use client';

import { useState, useEffect } from 'react';

interface ChartData {
  symbol: string;
  name: string;
  price: number;
  ma8: number;
  ma20: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  changePercent: number;
  region: string;
}

export default function DruckenmillerCharts() {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState<string>('global');

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const response = await fetch('/api/charts/summary');
        const data = await response.json();

        if (data && data.charts) {
          setCharts(data.charts);
        } else {
          // Fallback chart data
          setCharts([
            { symbol: 'SPY', name: 'S&P 500', price: 580.42, ma8: 575.10, ma20: 570.30, signal: 'bullish', changePercent: 2.15, region: 'USA' },
            { symbol: 'QQQ', name: 'NASDAQ', price: 480.50, ma8: 475.20, ma20: 465.80, signal: 'bullish', changePercent: 4.25, region: 'USA' },
            { symbol: 'TLT', name: '20+ Treasury Bonds', price: 92.75, ma8: 91.50, ma20: 93.20, signal: 'bearish', changePercent: -0.95, region: 'USA' },
            { symbol: 'FTSE', name: 'FTSE 100', price: 7950.30, ma8: 7845.60, ma20: 7725.40, signal: 'bullish', changePercent: 1.85, region: 'Europe' },
            { symbol: 'DAX', name: 'DAX Index', price: 19850.20, ma8: 19620.50, ma20: 19200.80, signal: 'bullish', changePercent: 3.15, region: 'Europe' },
            { symbol: 'N225', name: 'Nikkei 225', price: 32500.75, ma8: 31850.30, ma20: 30950.60, signal: 'bullish', changePercent: 5.42, region: 'Asia' },
            { symbol: 'BVSP', name: 'Bovespa', price: 131250.40, ma8: 127540.60, ma20: 125300.80, signal: 'neutral', changePercent: 0.85, region: 'Latin America' },
            { symbol: 'SENSEX', name: 'Sensex 30', price: 76850.50, ma8: 75320.30, ma20: 74100.20, signal: 'bullish', changePercent: 2.65, region: 'Asia' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch charts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
  }, []);

  const regions = [
    { id: 'global', label: '🌍 Global' },
    { id: 'USA', label: '🇺🇸 USA' },
    { id: 'Europe', label: '🇪🇺 Europe' },
    { id: 'Asia', label: '🌏 Asia' },
    { id: 'Latin America', label: '🌎 Latin America' },
  ];

  const filteredCharts = activeRegion === 'global'
    ? charts
    : charts.filter(c => c.region === activeRegion);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'bullish': return 'bg-green-100 text-green-800 border-green-200';
      case 'bearish': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getChangeColor = (changePercent: number) => {
    if (changePercent > 0) return 'text-green-600';
    if (changePercent < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '➡️';
    }
  };

  const getMACrossover = (ma8: number, ma20: number) => {
    if (ma8 > ma20) return 'above';
    if (ma8 < ma20) return 'below';
    return 'crossover';
  };

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <span className="text-3xl">📊</span>
        Druckenmiller Global Charts
      </h2>

      <p className="text-gray-600 text-sm mb-6 max-w-2xl">
        Technical analysis across 270+ global assets. 8-period moving averages signal market momentum.
      </p>

      {/* Region Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => setActiveRegion(region.id)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 ${
              activeRegion === region.id
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {region.label}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4 w-2/3"></div>
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))
        ) : filteredCharts.length > 0 ? (
          filteredCharts.map((chart, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{chart.name}</h3>
                  <p className="text-sm text-gray-600 font-medium">{chart.symbol}</p>
                </div>
                <div className="text-2xl">{getSignalIcon(chart.signal)}</div>
              </div>

              {/* Current Price */}
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">{chart.price.toFixed(2)}</div>
                <div className={`text-lg font-semibold mt-1 ${getChangeColor(chart.changePercent)}`}>
                  {chart.changePercent > 0 ? '+' : ''}{chart.changePercent.toFixed(2)}%
                </div>
              </div>

              {/* Signal Badge */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getSignalColor(chart.signal)}`}>
                  {chart.signal.toUpperCase()}
                </span>
              </div>

              {/* Moving Averages */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">MA(8)</span>
                  <span className="font-semibold text-gray-900">{chart.ma8.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">MA(20)</span>
                  <span className="font-semibold text-gray-900">{chart.ma20.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    MA(8) is {getMACrossover(chart.ma8, chart.ma20).toUpperCase()} MA(20)
                  </p>
                </div>
              </div>

              {/* Region */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">{chart.region}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p>No chart data available for this region</p>
          </div>
        )}
      </div>

      {/* Chart Statistics */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 font-semibold">Bullish Signals</p>
          <p className="text-2xl font-bold text-green-900 mt-2">
            {filteredCharts.filter(c => c.signal === 'bullish').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-red-600 font-semibold">Bearish Signals</p>
          <p className="text-2xl font-bold text-red-900 mt-2">
            {filteredCharts.filter(c => c.signal === 'bearish').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-semibold">Avg Return</p>
          <p className="text-2xl font-bold text-blue-900 mt-2">
            {(filteredCharts.reduce((sum, c) => sum + c.changePercent, 0) / filteredCharts.length).toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Load More Button */}
      <div className="mt-8 text-center">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
          View Full Analysis Report
        </button>
      </div>
    </div>
  );
}
