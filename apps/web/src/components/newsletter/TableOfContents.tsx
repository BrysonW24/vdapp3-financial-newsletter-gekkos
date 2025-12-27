'use client'

import { useState } from 'react'

interface Section {
  id: string
  title: string
  icon: string
}

interface TableOfContentsProps {
  sections: Section[]
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Get the sticky header element (the TableOfContents itself)
      const headerElement = document.querySelector('.sticky')
      let headerHeight = 0

      if (headerElement) {
        // Get the actual rendered height of the sticky header
        const headerRect = headerElement.getBoundingClientRect()
        headerHeight = headerRect.height
      }

      // Add 16px breathing room below the header
      const totalOffset = headerHeight + 16

      // Get element position from document top
      const elementPosition = element.offsetTop
      const targetPosition = Math.max(0, elementPosition - totalOffset)

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      })
    }
    // Close menu on mobile after selection
    if (window.innerWidth < 768) {
      setIsExpanded(false)
    }
  }

  return (
    <div className="sticky top-0 md:top-4 z-50 md:z-10 animate-fade-in">
      {/* Mobile Header - Collapsible */}
      <div className="md:hidden bg-white border-b-2 border-slate-200 shadow-md">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <span className="font-bold text-slate-900">Today's Contents</span>
          </div>
          <span className={`text-xl transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {/* Mobile Expanded Menu */}
        {isExpanded && (
          <div className="bg-slate-50 border-t-2 border-slate-200 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 p-3">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="flex flex-col items-center gap-1 px-3 py-3 bg-white hover:bg-gecko-50 hover:border-gecko-300 border-2 border-slate-200 rounded-lg transition-all duration-200 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                    {section.icon}
                  </span>
                  <span className="text-xs font-medium text-slate-700 group-hover:text-gecko-700 text-center">
                    {section.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Card - Collapsible */}
      <div className="hidden md:block section-card">
        <button
          onClick={() => setIsDesktopExpanded(!isDesktopExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors mb-2"
        >
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <span>Today's Contents</span>
          </h2>
          <span className={`text-xl transition-transform duration-300 ${isDesktopExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {isDesktopExpanded && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-gecko-50 hover:border-gecko-300 border-2 border-slate-200 rounded-lg transition-all duration-200 text-left group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                    {section.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-gecko-700">
                    {section.title}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center">
                Click any section above to jump directly to it
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
