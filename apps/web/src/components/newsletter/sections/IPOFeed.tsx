'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface IPOItem {
  companyName: string;
  symbol: string;
  priceRange: string;
  expectedDate: string;
  sector: string;
  description: string;
  marketCap: string;
  underwriters: string[];
}

export default function IPOFeed() {
  const [ipos, setIpos] = useState<IPOItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIPOs = async () => {
      try {
        const response = await fetch('/api/ipo-data');
        const data = await response.json();

        if (data && data.ipos) {
          setIpos(data.ipos);
        } else {
          // Fallback IPO data
          setIpos([
            {
              companyName: 'TechNova Solutions',
              symbol: 'TNVA',
              priceRange: '$18-22',
              expectedDate: '2025-01-15',
              sector: 'Technology',
              description: 'AI-powered enterprise software solutions for digital transformation.',
              marketCap: '$2.1B',
              underwriters: ['Goldman Sachs', 'Morgan Stanley']
            },
            {
              companyName: 'GreenEnergy Corp',
              symbol: 'GREN',
              priceRange: '$24-28',
              expectedDate: '2025-01-22',
              sector: 'Clean Energy',
              description: 'Renewable energy storage and grid optimization technology.',
              marketCap: '$1.8B',
              underwriters: ['J.P. Morgan', 'Bank of America']
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch IPO data:', error);
        // Use fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchIPOs();
  }, []);

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-3xl">🚀</span>
          <div className="flex flex-col">
            <span>IPO Feed</span>
            <span className="text-xs font-normal text-blue-700">📊 Upcoming initial public offerings & market debuts</span>
          </div>
        </div>
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 2 }).map((_, index) => (
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
          ipos.map((ipo, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl">
                  🚀
                </div>
                <div className="flex-1">
                  <div className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-2">
                    {ipo.sector}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {ipo.companyName}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">{ipo.symbol}</p>
                </div>
              </div>

              {/* IPO Details */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price Range:</span>
                  <span className="font-semibold text-green-600">{ipo.priceRange}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Expected Date:</span>
                  <span className="font-semibold">{new Date(ipo.expectedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Market Cap:</span>
                  <span className="font-semibold text-purple-600">{ipo.marketCap}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {ipo.description}
              </p>

              {/* Underwriters */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Underwriters:</p>
                <div className="flex flex-wrap gap-1">
                  {ipo.underwriters.map((bank, bankIndex) => (
                    <span key={bankIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      {bank}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Button */}
      <div className="mt-8 text-center">
        <Link
          href="/news?category=stocks"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
        >
          <span>📰</span>
          View All IPO News & Analysis
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}