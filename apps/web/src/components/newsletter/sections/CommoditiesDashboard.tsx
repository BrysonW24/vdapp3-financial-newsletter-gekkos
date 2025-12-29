'use client';

import Link from 'next/link';

export default function CommoditiesDashboard() {

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-3xl">📊</span>
          <div className="flex flex-col">
            <span>Commodities & Materials Tracker</span>
            <span className="text-xs font-normal text-amber-700">💎 Precious metals, AI materials & space tech commodities</span>
          </div>
        </div>
      </h2>

      {/* Key Commodities Dashboard - Row 1 */}
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 text-white rounded-lg p-4 shadow-md">
          <div className="text-2xl mb-2">💍</div>
          <div className="text-xs font-medium text-white/80 mb-1">Gold</div>
          <div className="text-2xl font-bold mb-1">$2,075</div>
          <div className="text-xs font-semibold text-green-200">+1.24%</div>
        </div>
        <div className="bg-gradient-to-br from-slate-400 to-slate-600 text-white rounded-lg p-4 shadow-md">
          <div className="text-2xl mb-2">⚪</div>
          <div className="text-xs font-medium text-white/80 mb-1">Silver</div>
          <div className="text-2xl font-bold mb-1">$31.25</div>
          <div className="text-xs font-semibold text-red-200">-2.35%</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg p-4 shadow-md">
          <div className="text-2xl mb-2">🔶</div>
          <div className="text-xs font-medium text-white/80 mb-1">Copper</div>
          <div className="text-2xl font-bold mb-1">$4.85</div>
          <div className="text-xs font-semibold text-green-200">+3.19%</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-lg p-4 shadow-md">
          <div className="text-2xl mb-2">⚡</div>
          <div className="text-xs font-medium text-white/80 mb-1">Lithium</div>
          <div className="text-2xl font-bold mb-1">$89.75</div>
          <div className="text-xs font-semibold text-green-200">+6.21%</div>
        </div>
      </div>

      {/* Key Commodities Dashboard - Row 2 */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-lg p-4 shadow-md">
          <div className="text-2xl mb-2">🛢️</div>
          <div className="text-xs font-medium text-white/80 mb-1">Crude Oil</div>
          <div className="text-2xl font-bold mb-1">$78.45</div>
          <div className="text-xs font-semibold text-green-200">+2.8%</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg p-4 shadow-md">
          <div className="text-2xl mb-2">🌿</div>
          <div className="text-xs font-medium text-white/80 mb-1">Natural Gas</div>
          <div className="text-2xl font-bold mb-1">$3.12</div>
          <div className="text-xs font-semibold text-red-200">-1.5%</div>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-700 text-white rounded-lg p-4 shadow-md">
          <div className="text-2xl mb-2">🪨</div>
          <div className="text-xs font-medium text-white/80 mb-1">Platinum</div>
          <div className="text-2xl font-bold mb-1">$945</div>
          <div className="text-xs font-semibold text-green-200">+0.8%</div>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-lg p-4 shadow-md">
          <div className="text-2xl mb-2">🔋</div>
          <div className="text-xs font-medium text-white/80 mb-1">Nickel</div>
          <div className="text-2xl font-bold mb-1">$18,250</div>
          <div className="text-xs font-semibold text-green-200">+4.2%</div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>📊</span>
          <span>Live Commodity Prices</span>
        </h3>
        <p className="text-sm text-gray-700">
          Track real-time commodity prices across precious metals, energy, and industrial materials.
          Prices shown are indicative and update throughout the trading day.
        </p>
      </div>

      {/* View All Button */}
      <div className="mt-8 text-center">
        <Link
          href="/news?category=economy"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
        >
          <span>📰</span>
          View All Commodities News & Market Analysis
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
