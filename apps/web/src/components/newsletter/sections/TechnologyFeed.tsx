'use client';

import { useState, useEffect } from 'react';

interface TechNewsItem {
  title: string;
  summary: string;
  source: string;
  url: string;
  category: string;
  publishedAt: string;
  icon: string;
}

export default function TechnologyFeed() {
  const [techNews, setTechNews] = useState<TechNewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechNews = async () => {
      try {
        const response = await fetch('/api/technology-news');
        const data = await response.json();

        if (data && data.articles) {
          setTechNews(data.articles);
        } else {
          // Fallback tech news
          setTechNews([
            {
              title: 'AI Breakthrough: New Language Model Achieves Human-Level Reasoning',
              summary: 'Researchers announce major advancement in artificial intelligence with a new model that demonstrates unprecedented reasoning capabilities across multiple domains.',
              source: 'TechCrunch',
              url: '#',
              category: 'Artificial Intelligence',
              publishedAt: new Date().toISOString(),
              icon: '🤖'
            },
            {
              title: 'Quantum Computing Milestone: 1000-Qubit Processor Demonstrated',
              summary: 'Leading quantum computing company achieves breakthrough with the first commercially viable 1000-qubit processor, opening new possibilities for complex computations.',
              source: 'MIT Technology Review',
              url: '#',
              category: 'Quantum Computing',
              publishedAt: new Date().toISOString(),
              icon: '⚛️'
            },
            {
              title: 'Sustainable Tech: Breakthrough in Solid-State Battery Technology',
              summary: 'Scientists develop new solid-state battery technology that could revolutionise electric vehicles with faster charging and longer range.',
              source: 'IEEE Spectrum',
              url: '#',
              category: 'Energy Storage',
              publishedAt: new Date().toISOString(),
              icon: '🔋'
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch tech news:', error);
        // Use fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchTechNews();
  }, []);

  const techIndicators = [
    { name: 'NASDAQ', value: '15,842', change: '+1.4%', icon: '📊', color: 'blue' },
    { name: 'AI Market Cap', value: '$2.8T', change: '+12.5%', icon: '🤖', color: 'purple' },
    { name: 'Tech IPOs YTD', value: '127', change: '+23', icon: '🚀', color: 'indigo' },
    { name: 'VC Funding', value: '$89B', change: '+8.3%', icon: '💰', color: 'green' },
  ]

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
  }

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-3xl">💻</span>
          <div className="flex flex-col">
            <span>Technology Feed</span>
            <span className="text-xs font-normal text-blue-700">🚀 Tech industry news, trends & innovations</span>
          </div>
        </div>
        <a href="/news?category=tech" className="text-xs font-normal text-blue-600 bg-blue-100 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors">
          View All Articles →
        </a>
      </h2>

      {/* Tech Market Dashboard */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {techIndicators.map((indicator) => (
          <div key={indicator.name} className={`${colorMap[indicator.color]} text-white rounded-lg p-4 shadow-md`}>
            <div className="text-2xl mb-2">{indicator.icon}</div>
            <div className="text-xs font-medium text-white/80 mb-1">{indicator.name}</div>
            <div className="text-2xl font-bold mb-1">{indicator.value}</div>
            <div className={`text-xs font-semibold ${indicator.change.startsWith('+') ? 'text-green-200' : 'text-red-200'}`}>
              {indicator.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 animate-pulse">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))
        ) : (
          techNews.map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-2">
                    {item.category}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {item.summary}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500 font-medium">
                  {item.source}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(item.publishedAt).toLocaleDateString()}
                </span>
              </div>

              {/* Read More Link */}
              <div className="mt-4">
                <a
                  href={item.url}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                >
                  Read Full Article
                  <span>→</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Articles Button */}
      <div className="mt-8 text-center">
        <a
          href="/news?category=tech"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
        >
          <span>📰</span>
          View All Technology News & Analysis
          <span>→</span>
        </a>
      </div>
    </div>
  );
}