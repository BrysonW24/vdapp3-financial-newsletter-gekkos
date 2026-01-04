'use client'

import { useState, useMemo, useCallback } from 'react'
import { GlossaryTerm } from '@/lib/education/types'
import { searchGlossary } from '@/lib/education/glossary-data'

interface GlossarySearchProps {
  terms: GlossaryTerm[]
  onFilteredTerms: (terms: GlossaryTerm[]) => void
}

const categories = [
  { id: 'all', label: 'All Categories', color: 'slate' },
  { id: 'market', label: 'Market', color: 'blue' },
  { id: 'indicator', label: 'Indicators', color: 'amber' },
  { id: 'strategy', label: 'Strategies', color: 'green' },
  { id: 'instrument', label: 'Instruments', color: 'purple' },
  { id: 'general', label: 'General', color: 'slate' },
]

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function GlossarySearch({ terms, onFilteredTerms }: GlossarySearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  // Filter terms based on search, category, and letter
  const filteredTerms = useMemo(() => {
    let results = terms

    // Search filter
    if (searchQuery) {
      results = searchGlossary(searchQuery, selectedCategory === 'all' ? undefined : selectedCategory)
    } else if (selectedCategory !== 'all') {
      results = terms.filter(term => term.category === selectedCategory)
    }

    // Letter filter
    if (selectedLetter) {
      results = results.filter(term =>
        term.term.toUpperCase().startsWith(selectedLetter)
      )
    }

    return results
  }, [terms, searchQuery, selectedCategory, selectedLetter])

  // Update parent component when filters change
  useMemo(() => {
    onFilteredTerms(filteredTerms)
  }, [filteredTerms, onFilteredTerms])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setSelectedLetter(null) // Clear letter filter when searching
  }, [])

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedLetter(null) // Clear letter filter when changing category
  }, [])

  const handleLetterClick = useCallback((letter: string) => {
    setSelectedLetter(selectedLetter === letter ? null : letter)
    setSearchQuery('') // Clear search when using alphabet nav
  }, [selectedLetter])

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    const colorMap = {
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      amber: 'bg-amber-600 hover:bg-amber-700 text-white',
      green: 'bg-green-600 hover:bg-green-700 text-white',
      purple: 'bg-purple-600 hover:bg-purple-700 text-white',
      slate: 'bg-slate-600 hover:bg-slate-700 text-white',
    }
    return colorMap[category?.color as keyof typeof colorMap] || colorMap.slate
  }

  // Count terms per letter for active letters
  const letterCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    terms.forEach(term => {
      const firstLetter = term.term.charAt(0).toUpperCase()
      counts[firstLetter] = (counts[firstLetter] || 0) + 1
    })
    return counts
  }, [terms])

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search terms, definitions, or related topics..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-3 pl-12 pr-4 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-slate-900 placeholder-slate-400"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
          🔍
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => {
            const isActive = selectedCategory === category.id
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${isActive
                    ? getCategoryColor(category.id) + ' shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
              >
                {category.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Alphabet Navigation */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Browse A-Z</h3>
        <div className="flex flex-wrap gap-1">
          {alphabet.map(letter => {
            const count = letterCounts[letter] || 0
            const hasTerms = count > 0
            const isActive = selectedLetter === letter

            return (
              <button
                key={letter}
                onClick={() => hasTerms && handleLetterClick(letter)}
                disabled={!hasTerms}
                className={`
                  w-9 h-9 rounded text-sm font-semibold transition-all duration-200
                  ${isActive
                    ? 'bg-green-600 text-white shadow-md'
                    : hasTerms
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                  }
                `}
                title={hasTerms ? `${count} term${count > 1 ? 's' : ''}` : 'No terms'}
              >
                {letter}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-slate-600 border-t border-slate-200 pt-4">
        <div>
          <span className="font-semibold">{filteredTerms.length}</span> term{filteredTerms.length !== 1 ? 's' : ''} found
        </div>
        {(searchQuery || selectedCategory !== 'all' || selectedLetter) && (
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setSelectedLetter(null)
            }}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  )
}
