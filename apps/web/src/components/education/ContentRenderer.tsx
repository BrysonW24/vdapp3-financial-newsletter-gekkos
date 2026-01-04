import { EducationContent } from '@/lib/education/types'
import Link from 'next/link'

interface ContentRendererProps {
  content: EducationContent
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  const renderContent = () => {
    switch (content.type) {
      case 'text':
        return (
          <p className="text-slate-700 leading-relaxed">
            {content.body}
          </p>
        )

      case 'list':
        return (
          <div className="text-slate-700 leading-relaxed whitespace-pre-line">
            {content.body}
          </div>
        )

      case 'callout':
        return (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
            <div className="text-slate-700 leading-relaxed whitespace-pre-line">
              {content.body}
            </div>
          </div>
        )

      case 'table':
        // Future: Implement table rendering
        return (
          <div className="text-slate-700 leading-relaxed">
            {content.body}
          </div>
        )

      default:
        return (
          <p className="text-slate-700 leading-relaxed">
            {content.body}
          </p>
        )
    }
  }

  return (
    <div className="space-y-4">
      {content.heading && (
        <h3 className="text-xl font-bold text-slate-900">
          {content.heading}
        </h3>
      )}

      {renderContent()}

      {/* Related Terms */}
      {content.relatedTerms && content.relatedTerms.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-semibold text-slate-600 mb-2">
            Related glossary terms:
          </p>
          <div className="flex flex-wrap gap-2">
            {content.relatedTerms.map((termId) => (
              <Link
                key={termId}
                href={`/education/glossary#term-${termId}`}
                className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded-full text-sm font-medium transition-colors"
              >
                {termId.split('-').map(word =>
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* External Links */}
      {content.externalLinks && content.externalLinks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">
            Learn more:
          </p>
          <div className="space-y-1">
            {content.externalLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
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
