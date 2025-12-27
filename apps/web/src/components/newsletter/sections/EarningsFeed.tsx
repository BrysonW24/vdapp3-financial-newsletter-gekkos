'use client';

import { useState, useEffect } from 'react';

interface EarningsItem {
  companyName: string;
  symbol: string;
  fiscalQuarter: string;
  expectedDate: string;
  expectedEPS: string;
  previousEPS: string;
  sector: string;
  marketCap: string;
  consensus: 'beat' | 'meet' | 'miss';
  surprise?: string;
}

export default function EarningsFeed() {
  const [earnings, setEarnings] = useState<EarningsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await fetch('/api/earnings-calendar');
        const data = await response.json();

        if (data && data.earnings) {
          setEarnings(data.earnings);
        } else {
          // Fallback earnings data
          setEarnings([
            {
              companyName: 'Apple Inc.',
              symbol: 'AAPL',
              fiscalQuarter: 'Q4 2024',
              expectedDate: '2025-01-30',
              expectedEPS: '$2.15',
              previousEPS: '$2.12',
              sector: 'Technology',
              marketCap: '$3.2T',
              consensus: 'beat'
            },
            {
              companyName: 'Microsoft Corporation',
              symbol: 'MSFT',
              fiscalQuarter: 'Q4 2024',
              expectedDate: '2025-01-23',
              expectedEPS: '$3.10',
              previousEPS: '$2.93',
              sector: 'Technology',
              marketCap: '$3.1T',
              consensus: 'meet'
            },
            {
              companyName: 'Tesla Inc.',
              symbol: 'TSLA',
              fiscalQuarter: 'Q4 2024',
              expectedDate: '2025-01-24',
              expectedEPS: '$0.85',
              previousEPS: '$0.71',
              sector: 'Automotive',
              marketCap: '$850B',
              consensus: 'beat',
              surprise: '+12%'
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch earnings data:', error);
        // Use fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const getConsensusColor = (consensus: string) => {
    switch (consensus) {
      case 'beat': return 'bg-green-100 text-green-800 border-green-200';
      case 'meet': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'miss': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <span className="text-3xl">💰</span>
        Earnings Feed
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 animate-pulse">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          ))
        ) : (
          earnings.map((earning, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-xl">
                    💰
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {earning.companyName}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">{earning.symbol}</p>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full border mt-1 ${getConsensusColor(earning.consensus)}`}>
                      {earning.consensus.toUpperCase()}
                    </span>
                  </div>
                </div>
                {earning.surprise && (
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">{earning.surprise}</div>
                    <div className="text-xs text-gray-500">Surprise</div>
                  </div>
                )}
              </div>

              {/* Earnings Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quarter:</span>
                  <span className="font-semibold">{earning.fiscalQuarter}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Expected EPS:</span>
                  <span className="font-semibold text-blue-600">{earning.expectedEPS}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Previous EPS:</span>
                  <span className="font-semibold text-gray-700">{earning.previousEPS}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="font-semibold">{new Date(earning.expectedDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{earning.sector}</span>
                  <span>{earning.marketCap}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      <div className="mt-8 text-center">
        <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
          View Earnings Calendar
        </button>
      </div>
    </div>
  );
}