'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="bg-gradient-financial text-white shadow-2xl">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Logo and Title */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {/* Gecko Logo */}
              <div className="w-16 h-16 bg-gecko-500 rounded-full flex items-center justify-center text-4xl shadow-lg ring-4 ring-gecko-400/30">
                🦎
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs animate-pulse">
                ✨
              </div>
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
                Gekkos Dashboard
              </h1>
              <p className="text-slate-300 text-sm md:text-base mt-1 font-medium">
                Real-Time Market Intelligence & Financial Insights
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 backdrop-blur-sm flex items-center gap-2 font-medium"
            >
              <span>📊</span>
              Dashboard
            </Link>
            <Link
              href="/news"
              className="px-4 py-2 bg-gecko-500 hover:bg-gecko-600 rounded-lg transition-colors duration-200 backdrop-blur-sm font-medium shadow-md flex items-center gap-2"
            >
              <span>📰</span>
              News Intelligence
            </Link>
            <Link
              href="/news/search"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 backdrop-blur-sm flex items-center gap-2"
            >
              <span>🔍</span>
              Search
            </Link>
          </nav>
        </div>

        {/* Date and Edition Info */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/20">
          <div className="flex items-center gap-3 text-slate-200">
            <span className="text-2xl">📅</span>
            <span className="text-lg font-medium">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gecko-500 text-white rounded-full text-sm font-semibold shadow-md">
              Australian Markets Edition
            </span>
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-semibold shadow-md">
              Free
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
