'use client';

import { useState, useEffect } from 'react';

interface Milestone {
  year: string;
  title: string;
  description: string;
  impact: string;
  users: string;
  icon: string;
  color: string;
  growth: number;
}

export default function GraphicOfTheDay() {
  const [graphic, setGraphic] = useState({
    title: 'Loading...',
    subtitle: 'Fetching today\'s graphic...',
    description: 'Please wait while we load the latest visualization.',
    source: 'Visual Capitalist',
    category: 'Loading',
  });
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    const fetchGraphicData = async () => {
      try {
        // Fetch from Visual Capitalist API (simulated for now)
        const response = await fetch('/api/visual-capitalist/graphic-of-day');
        const data = await response.json();

        if (data && data.title) {
          setGraphic(data);
          setMilestones(data.milestones || []);
        } else {
          // Fallback to cached/project data
          setGraphic({
            title: 'The Evolution of Vivacity Digital',
            subtitle: 'A transformative journey from concept to multi-platform innovation (2020-2025)',
            description: 'This timeline showcases the rapid growth and diversification of Vivacity Digital, evolving from a single app concept to a comprehensive digital solutions ecosystem serving millions of users across web, mobile, and hybrid platforms.',
            source: 'Vivacity Digital Analytics',
            category: 'Business Innovation',
          });
          setMilestones([
            {
              year: '2020',
              title: 'Foundation',
              description: 'Concept development and initial market research',
              impact: 'Market validation and core architecture design',
              users: '0',
              icon: '🌱',
              color: 'bg-green-400',
              growth: 0
            },
            {
              year: '2021',
              title: 'First Launch',
              description: 'Journal app MVP release on Android',
              impact: 'First user acquisition and product-market fit',
              users: '10K',
              icon: '📱',
              color: 'bg-blue-400',
              growth: 10
            },
            {
              year: '2022',
              title: 'Expansion',
              description: 'iOS and web platform launches, template system',
              impact: 'Cross-platform presence and developer tools',
              users: '50K',
              icon: '🚀',
              color: 'bg-purple-400',
              growth: 25
            },
            {
              year: '2023',
              title: 'Scale & Monetization',
              description: 'Premium features, subscription models, pub-mate launch',
              impact: 'Revenue generation and enterprise solutions',
              users: '200K',
              icon: '💰',
              color: 'bg-yellow-400',
              growth: 75
            },
            {
              year: '2024',
              title: 'Ecosystem Growth',
              description: 'Newsletter platform, AI integrations, global expansion',
              impact: 'Comprehensive digital ecosystem and international presence',
              users: '500K',
              icon: '🌐',
              color: 'bg-orange-400',
              growth: 100
            },
            {
              year: '2025',
              title: 'Innovation Peak',
              description: 'Advanced analytics, AI-driven features, publication tools',
              impact: 'Leading digital transformation and market leadership',
              users: '1M+',
              icon: '⭐',
              color: 'bg-red-400',
              growth: 150
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch graphic data:', error);
        // Use fallback data
      }
    };

    fetchGraphicData();
  }, []);

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <span className="text-3xl">📊</span>
        Graphic of the Day
      </h2>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 text-white shadow-2xl print:shadow-none print:bg-white print:text-black">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-block px-3 py-1 bg-gecko-500 text-white text-xs font-bold rounded-full mb-3">
            {graphic.category}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">{graphic.title}</h3>
          <p className="text-slate-300 text-sm">{graphic.subtitle}</p>
        </div>

        {/* Timeline Visualization */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-blue-400 via-purple-400 via-yellow-400 via-orange-400 to-red-400"></div>

            <div className="space-y-8">
              {milestones.map((milestone) => (
                <div key={milestone.year} className="relative flex items-start gap-6">
                  {/* Timeline Dot */}
                  <div className={`flex-shrink-0 w-16 h-16 ${milestone.color} rounded-full flex items-center justify-center text-2xl shadow-lg`}>
                    {milestone.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-white">{milestone.year}</h4>
                      <span className="px-3 py-1 bg-white/20 text-xs font-semibold rounded-full text-slate-200">
                        {milestone.users} Users
                      </span>
                    </div>
                    <h5 className="text-md font-semibold text-slate-200 mb-1">{milestone.title}</h5>
                    <p className="text-sm text-slate-300 mb-2">{milestone.description}</p>
                    <p className="text-xs text-slate-400 italic">{milestone.impact}</p>

                    {/* Growth Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-400">Growth</span>
                        <span className="text-xs font-semibold text-white">{milestone.growth}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className={`${milestone.color} h-full rounded-full transition-all duration-1000`}
                          style={{ width: `${Math.min(milestone.growth, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          {graphic.description}
        </p>

        {/* Source */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <span className="text-xs text-slate-400">Source: {graphic.source}</span>
          <button className="text-xs text-gecko-400 hover:text-gecko-300 font-semibold flex items-center gap-1 transition-colors">
            Share Graphic
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Educational Note */}
      <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">📚</span>
          <p className="text-sm text-blue-900">
            <strong>Did you know?</strong> Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill
          </p>
        </div>
      </div>
    </div>
  )
}