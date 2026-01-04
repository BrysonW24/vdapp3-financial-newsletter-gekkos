'use client'

import { GlossaryTerm } from '@/lib/education/types'
import Link from 'next/link'

interface GlossaryTermCardProps {
  term: GlossaryTerm
  onRelatedTermClick?: (termId: string) => void
}

const categoryColors = {
  market: 'bg-blue-100 text-blue-800 border-blue-200',
  indicator: 'bg-amber-100 text-amber-800 border-amber-200',
  strategy: 'bg-green-100 text-green-800 border-green-200',
  instrument: 'bg-purple-100 text-purple-800 border-purple-200',
  general: 'bg-slate-100 text-slate-800 border-slate-200',
}

const categoryLabels = {
  market: 'Market',
  indicator: 'Indicator',
  strategy: 'Strategy',
  instrument: 'Instrument',
  general: 'General',
}

export default function GlossaryTermCard({ term, onRelatedTermClick }: GlossaryTermCardProps) {
  const categoryColor = categoryColors[term.category]
  const categoryLabel = categoryLabels[term.category]

  return (
    <div
      id={`term-${term.id}`}
      className="section-card scroll-mt-24 hover:shadow-lg transition-shadow duration-300"
    >
      {/* Term Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-xl font-bold text-slate-900 flex-grow">
          {term.term}
        </h3>
        <span
          className={`
            px-3 py-1 rounded-full text-xs font-semibold border
            ${categoryColor}
            whitespace-nowrap
          `}
        >
          {categoryLabel}
        </span>
      </div>

      {/* Definition */}
      <p className="text-slate-700 leading-relaxed mb-4">
        {term.definition}
      </p>

      {/* Example */}
      {term.example && (
        <div className="bg-slate-50 border-l-4 border-green-500 rounded-r-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <span>💡</span>
            Example
          </h4>
          <p className="text-sm text-slate-600 italic">
            {term.example}
          </p>
        </div>
      )}

      {/* Live Data Badge */}
      {term.liveDataExample && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg mb-4">
          <span className="text-lg">✨</span>
          <span className="text-sm font-medium text-green-700">
            Live data available in lessons
          </span>
        </div>
      )}

      {/* Related Terms */}
      {term.relatedTerms && term.relatedTerms.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Related Terms:</h4>
          <div className="flex flex-wrap gap-2">
            {term.relatedTerms.map((relatedId) => (
              <button
                key={relatedId}
                onClick={() => onRelatedTermClick?.(relatedId)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-colors"
              >
                {relatedId.split('-').map(word =>
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* External Links */}
      {term.externalLinks && term.externalLinks.length > 0 && (
        <div className="border-t border-slate-200 pt-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <span>🔗</span>
            Learn More
          </h4>
          <div className="space-y-2">
            {term.externalLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 hover:underline transition-colors"
              >
                <span>{link.text}</span>
                <span className="text-xs">↗</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
