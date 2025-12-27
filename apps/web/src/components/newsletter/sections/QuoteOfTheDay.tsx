'use client';

import { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author: string;
  title: string;
  context: string;
  category: string;
}

export default function QuoteOfTheDay() {
  const [quote, setQuote] = useState<Quote>({
    text: 'Loading...',
    author: 'Loading...',
    title: 'Loading...',
    context: 'Loading...',
    category: 'Loading...',
  });

  useEffect(() => {
    const fetchDailyQuote = async () => {
      try {
        const response = await fetch('/api/daily-quote');
        const data = await response.json();
        if (data && data.text) {
          setQuote(data);
        } else {
          // Fallback - show loading state or minimal fallback
          setQuote({
            text: 'Loading today\'s inspirational quote...',
            author: 'Please wait',
            title: 'Quote will load shortly',
            context: 'Our system is fetching today\'s daily quote. Please refresh if this persists.',
            category: 'Loading',
          });
        }
      } catch (error) {
        console.error('Failed to fetch daily quote:', error);
        // Fallback - show error state
        setQuote({
          text: 'Unable to load today\'s quote at this time.',
          author: 'System',
          title: 'Please try again later',
          context: 'Our quote service is temporarily unavailable. We apologize for the inconvenience.',
          category: 'Service Unavailable',
        });
      }
    };

    fetchDailyQuote();
  }, []);

  return (
    <div className="section-card animate-slide-up bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border-2 border-amber-300 shadow-xl">
      <h2 className="section-title">
        <span className="text-3xl">💭</span>
        Quote of the Day
      </h2>

      <div className="relative">
        {/* Decorative quote marks */}
        <div className="absolute -top-6 -left-2 text-8xl text-amber-300/40 font-serif leading-none select-none">"</div>
        <div className="absolute -bottom-12 -right-2 text-8xl text-amber-300/40 font-serif leading-none select-none">"</div>

        {/* Quote Content */}
        <div className="relative bg-white rounded-xl p-8 shadow-lg border-2 border-amber-200">
          {/* Category Tag */}
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full mb-6">
            {quote.category}
          </div>

          {/* Quote Text */}
          <blockquote className="text-2xl md:text-3xl font-serif font-medium text-slate-900 leading-relaxed mb-8 text-center italic">
            {quote.text}
          </blockquote>

          {/* Author Section */}
          <div className="flex items-center justify-center gap-4 mb-6 pb-6 border-b-2 border-amber-200">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-lg ring-4 ring-amber-200">
              📈
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-slate-900">{quote.author}</div>
              <div className="text-sm text-slate-600">{quote.title}</div>
            </div>
          </div>

          {/* Context */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-5 border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-xl">
                💡
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">What This Means</h4>
                <p className="text-sm text-amber-950 leading-relaxed">
                  {quote.context}
                </p>
              </div>
            </div>
          </div>

          {/* Reflection Question */}
          <div className="mt-6 pt-6 border-t-2 border-amber-200">
            <div className="text-center">
              <h5 className="text-sm font-semibold text-slate-700 mb-2">💬 Reflect on this:</h5>
              <p className="text-sm text-slate-600 italic">
                Are you being patient with your investments, or are you trying to outsmart the market?
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <span>✨</span>
            <span>A daily dose of financial wisdom</span>
            <span>✨</span>
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-6 flex justify-center gap-3">
          <button className="px-4 py-2 bg-white border-2 border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors duration-200 text-sm font-medium">
            📋 Copy Quote
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors duration-200 text-sm font-medium shadow-md">
            📤 Share on Social
          </button>
        </div>
      </div>

      {/* Final Message */}
      <div className="mt-8 text-center bg-gradient-financial text-white rounded-xl p-6 shadow-lg">
        <div className="text-2xl mb-2">🦎</div>
        <p className="text-lg font-semibold mb-1">Thanks for reading Gekkos!</p>
        <p className="text-sm text-slate-300">
          See you tomorrow with more finance insights and market updates.
        </p>
      </div>
    </div>
  )
}
