'use client'

import { useState } from 'react'
import { EducationContent } from '@/lib/education/types'

interface TableOfContentsProps {
  content: EducationContent[]
  color?: string
}

export default function TableOfContents({ content, color = 'green' }: TableOfContentsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`section-${index}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsExpanded(false)
    }
  }

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100',
    purple: 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100',
    amber: 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100',
    green: 'bg-green-50 border-green-200 text-green-900 hover:bg-green-100',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-900 hover:bg-indigo-100',
    slate: 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100',
  }

  const buttonColorClasses = {
    blue: 'bg-blue-600 text-white',
    purple: 'bg-purple-600 text-white',
    amber: 'bg-amber-600 text-white',
    green: 'bg-green-600 text-white',
    indigo: 'bg-indigo-600 text-white',
    slate: 'bg-slate-600 text-white',
  }

  const baseColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.green
  const buttonColor = buttonColorClasses[color as keyof typeof buttonColorClasses] || buttonColorClasses.green

  return (
    <div className={`mb-8 border-2 rounded-lg overflow-hidden ${baseColor.split(' ')[0]} ${baseColor.split(' ')[1]}`}>
      {/* Toggle Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-6 py-4 flex items-center justify-between ${buttonColor} hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📖</span>
          <span className="font-semibold text-lg">On This Page</span>
          <span className="text-sm opacity-90">({content.length} sections)</span>
        </div>
        <span className="text-xl">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>

      {/* Table of Contents List */}
      {isExpanded && (
        <div className="p-4 bg-white">
          <nav className="space-y-2">
            {content.map((section, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(index)}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${baseColor} text-sm font-medium`}
              >
                {index + 1}. {section.heading}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
