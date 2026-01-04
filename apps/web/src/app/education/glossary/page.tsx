'use client'

import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import NewsletterLayout from '@/components/newsletter/NewsletterLayout'
import GlossarySearch from '@/components/education/GlossarySearch'
import GlossaryTermCard from '@/components/education/GlossaryTermCard'
import { glossaryTerms } from '@/lib/education/glossary-data'
import { useState, useCallback, useEffect } from 'react'
import { GlossaryTerm } from '@/lib/education/types'

export default function GlossaryPage() {
  const [filteredTerms, setFilteredTerms] = useState<GlossaryTerm[]>(glossaryTerms)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleFilteredTerms = useCallback((terms: GlossaryTerm[]) => {
    setFilteredTerms(terms)
  }, [])

  const handleRelatedTermClick = useCallback((termId: string) => {
    const element = document.getElementById(`term-${termId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Highlight the term briefly
      element.classList.add('ring-4', 'ring-green-300')
      setTimeout(() => {
        element.classList.remove('ring-4', 'ring-green-300')
      }, 2000)
    }
  }, [])

  return (
    <NewsletterLayout>
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4 animate-fade-in">📖</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 animate-slide-up">
            Financial Glossary
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto animate-fade-in">
            Search our comprehensive financial glossary with {glossaryTerms.length}+ terms,
            clear definitions, real-world examples, and links to authoritative resources
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 sticky top-20 z-30 bg-gray-50 -mx-4 px-4 py-6 shadow-md rounded-lg">
          <GlossarySearch
            terms={glossaryTerms}
            onFilteredTerms={handleFilteredTerms}
          />
        </div>

        {/* Terms Grid */}
        {isClient && (
          <>
            {filteredTerms.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredTerms.map((term) => (
                  <GlossaryTermCard
                    key={term.id}
                    term={term}
                    onRelatedTermClick={handleRelatedTermClick}
                  />
                ))}
              </div>
            ) : (
              <div className="section-card text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  No terms found
                </h3>
                <p className="text-slate-600 mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </>
        )}

        {/* Helpful Tips */}
        <div className="mt-12 section-card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">💡</span>
            How to Use This Glossary
          </h2>
          <ul className="space-y-3">
            {[
              'Use the search bar to find specific terms or concepts',
              'Filter by category to browse related financial topics',
              'Click on the alphabet to jump to terms starting with that letter',
              'Click related terms to jump directly to their definitions',
              'Look for the ✨ badge to find terms with live data examples in our lessons',
              'Follow external links to learn more from authoritative sources',
            ].map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">•</span>
                <span className="text-slate-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-6">
          <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            Disclaimer
          </h3>
          <p className="text-sm text-amber-900 leading-relaxed">
            These definitions are provided for educational purposes only. Financial markets
            and terminology can be complex and context-dependent. Always verify information
            with authoritative sources and consult with a qualified financial advisor for
            specific investment decisions.
          </p>
        </div>
      </div>

      <Footer />
    </NewsletterLayout>
  )
}
