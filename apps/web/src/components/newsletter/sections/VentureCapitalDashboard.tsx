'use client';

import { useState, useEffect } from 'react';

interface VCCompany {
  id: string;
  name: string;
  sector: string;
  stage: 'seed' | 'series-a' | 'series-b' | 'series-c' | 'late-stage' | 'pre-ipo';
  fundingAmount?: number;
  valuation?: number;
  ipoStatus?: 'hot' | 'likely' | 'possible';
  lastUpdate: string;
}

interface VCMetrics {
  totalFundingThisMonth: number;
  dealsClosedThisMonth: number;
  hotIPOs: number;
  topSector: string;
}

export default function VentureCapitalDashboard() {
  const [companies, setCompanies] = useState<VCCompany[]>([]);
  const [metrics, setMetrics] = useState<VCMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState<string>('all');

  useEffect(() => {
    const fetchVCData = async () => {
      try {
        const response = await fetch('/api/venture-capital/summary');
        const data = await response.json();

        if (data && data.companies) {
          setCompanies(data.companies);
          setMetrics(data.metrics);
        } else {
          // Fallback VC data
          setCompanies([
            { id: '1', name: 'Anthropic', sector: 'AI/ML', stage: 'late-stage', valuation: 20000000000, lastUpdate: '2024-11-24', ipoStatus: 'possible' },
            { id: '2', name: 'Stripe', sector: 'FinTech', stage: 'late-stage', valuation: 95000000000, lastUpdate: '2024-11-23' },
            { id: '3', name: 'Databricks', sector: 'AI/ML', stage: 'late-stage', valuation: 43000000000, lastUpdate: '2024-11-22', ipoStatus: 'likely' },
            { id: '4', name: 'Canva', sector: 'Design', stage: 'late-stage', valuation: 26000000000, lastUpdate: '2024-11-21' },
            { id: '5', name: 'Instacart', sector: 'E-Commerce', stage: 'pre-ipo', valuation: 39000000000, lastUpdate: '2024-11-20', ipoStatus: 'hot' },
            { id: '6', name: 'Figma', sector: 'Design', stage: 'late-stage', valuation: 20000000000, lastUpdate: '2024-11-19' },
          ]);
          setMetrics({
            totalFundingThisMonth: 5200000000,
            dealsClosedThisMonth: 247,
            hotIPOs: 5,
            topSector: 'AI/ML',
          });
        }
      } catch (error) {
        console.error('Failed to fetch VC data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVCData();
  }, []);

  const stages = [
    { id: 'all', label: 'All Stages' },
    { id: 'seed', label: 'Seed' },
    { id: 'series-a', label: 'Series A' },
    { id: 'series-b', label: 'Series B' },
    { id: 'series-c', label: 'Series C' },
    { id: 'late-stage', label: 'Late Stage' },
    { id: 'pre-ipo', label: 'Pre-IPO' },
  ];

  const filteredCompanies = activeSector === 'all'
    ? companies
    : companies.filter(c => c.stage === activeSector);

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'seed': 'bg-orange-100 text-orange-800 border-orange-200',
      'series-a': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'series-b': 'bg-blue-100 text-blue-800 border-blue-200',
      'series-c': 'bg-purple-100 text-purple-800 border-purple-200',
      'late-stage': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'pre-ipo': 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return colors[stage] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getIPOBadgeColor = (status?: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800 border-red-200';
      case 'likely': return 'bg-green-100 text-green-800 border-green-200';
      case 'possible': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return null;
    }
  };

  const formatValuation = (val?: number) => {
    if (!val) return 'N/A';
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${val}`;
  };

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <span className="text-3xl">💼</span>
        Venture Capital Landscape
      </h2>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-purple-600 font-semibold">Funding This Month</p>
            <p className="text-2xl font-bold text-purple-900 mt-2">${(metrics.totalFundingThisMonth / 1000000000).toFixed(1)}B</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-600 font-semibold">Deals Closed</p>
            <p className="text-2xl font-bold text-blue-900 mt-2">{metrics.dealsClosedThisMonth}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-red-600 font-semibold">Hot IPOs</p>
            <p className="text-2xl font-bold text-red-900 mt-2">{metrics.hotIPOs}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-600 font-semibold">Top Sector</p>
            <p className="text-2xl font-bold text-green-900 mt-2">{metrics.topSector}</p>
          </div>
        </div>
      )}

      {/* Stage Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto">
        {stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => setActiveSector(stage.id)}
            className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 text-sm ${
              activeSector === stage.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {stage.label}
          </button>
        ))}
      </div>

      {/* Companies Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4 w-2/3"></div>
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))
        ) : filteredCompanies.length > 0 ? (
          filteredCompanies.map((company, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                  <p className="text-sm text-gray-600">{company.sector}</p>
                </div>
                {company.ipoStatus && (
                  <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full border ${getIPOBadgeColor(company.ipoStatus)}`}>
                    {company.ipoStatus.toUpperCase()} IPO
                  </span>
                )}
              </div>

              {/* Stage Badge */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getStageColor(company.stage)}`}>
                  {company.stage.toUpperCase().replace('-', ' ')}
                </span>
              </div>

              {/* Valuation */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold">Current Valuation</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatValuation(company.valuation)}</p>
              </div>

              {/* Funding (if available) */}
              {company.fundingAmount && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-600 font-semibold">Last Funding</p>
                  <p className="text-xl font-bold text-blue-900 mt-1">{formatValuation(company.fundingAmount)}</p>
                </div>
              )}

              {/* Last Update */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Updated: {new Date(company.lastUpdate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p>No companies in this stage</p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      <div className="mt-8 text-center">
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
          Explore Full VC Landscape
        </button>
      </div>
    </div>
  );
}
