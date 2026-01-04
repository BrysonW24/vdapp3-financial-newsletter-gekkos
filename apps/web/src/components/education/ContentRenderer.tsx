import { EducationContent } from '@/lib/education/types'
import Link from 'next/link'

interface ContentRendererProps {
  content: EducationContent
  color?: string
  index?: number
}

export default function ContentRenderer({ content, color = 'green', index }: ContentRendererProps) {
  const headingColors = {
    blue: 'text-blue-700 border-blue-300',
    purple: 'text-purple-700 border-purple-300',
    amber: 'text-amber-700 border-amber-300',
    green: 'text-green-700 border-green-300',
    indigo: 'text-indigo-700 border-indigo-300',
    slate: 'text-slate-700 border-slate-300',
  }

  const calloutColors = {
    blue: 'bg-blue-50 border-blue-500',
    purple: 'bg-purple-50 border-purple-500',
    amber: 'bg-amber-50 border-amber-500',
    green: 'bg-green-50 border-green-500',
    indigo: 'bg-indigo-50 border-indigo-500',
    slate: 'bg-slate-50 border-slate-500',
  }

  const headingColorClass = headingColors[color as keyof typeof headingColors] || headingColors.green
  const calloutColorClass = calloutColors[color as keyof typeof calloutColors] || calloutColors.green

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
          <div className={`${calloutColorClass.split(' ')[0]} border-l-4 ${calloutColorClass.split(' ')[1]} rounded-r-lg p-4`}>
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
    <div className="space-y-4" id={index !== undefined ? `section-${index}` : undefined}>
      {content.heading && (
        <>
          {/* Visual Divider */}
          {index !== undefined && index > 0 && (
            <div className="mb-6 border-t-2 border-dashed border-slate-200"></div>
          )}

          {/* Color-coded Heading */}
          <h3 className={`text-2xl font-bold ${headingColorClass.split(' ')[0]} pb-2 border-b-2 ${headingColorClass.split(' ')[1]} mb-4`}>
            {content.heading}
          </h3>
        </>
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
