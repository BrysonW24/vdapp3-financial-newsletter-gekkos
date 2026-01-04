'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sections = [
  { id: 'big-picture', title: 'Big Picture', icon: '🌐', path: '/education/big-picture', color: 'blue' },
  { id: 'players', title: 'Big Players', icon: '🏛️', path: '/education/players', color: 'purple' },
  { id: 'indicators', title: 'Indicators', icon: '📊', path: '/education/indicators', color: 'amber' },
  { id: 'stock-selection', title: 'Stock Selection', icon: '🎯', path: '/education/stock-selection', color: 'green' },
  { id: 'strategies', title: 'Strategies', icon: '💡', path: '/education/strategies', color: 'indigo' },
  { id: 'glossary', title: 'Glossary', icon: '📖', path: '/education/glossary', color: 'slate' },
]

const colorClasses = {
  blue: 'bg-blue-600 hover:bg-blue-700 border-blue-700',
  purple: 'bg-purple-600 hover:bg-purple-700 border-purple-700',
  amber: 'bg-amber-600 hover:bg-amber-700 border-amber-700',
  green: 'bg-green-600 hover:bg-green-700 border-green-700',
  indigo: 'bg-indigo-600 hover:bg-indigo-700 border-indigo-700',
  slate: 'bg-slate-600 hover:bg-slate-700 border-slate-700',
}

export default function EducationNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          {sections.map((section) => {
            const isActive = pathname === section.path
            const colorClass = colorClasses[section.color as keyof typeof colorClasses]

            return (
              <Link
                key={section.id}
                href={section.path}
                className={`
                  px-3 py-2 rounded-lg transition-colors duration-200
                  flex items-center gap-2 whitespace-nowrap text-sm font-medium
                  ${isActive
                    ? `${colorClass} text-white shadow-md border-2`
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-transparent'
                  }
                `}
              >
                <span className="text-base">{section.icon}</span>
                <span>{section.title}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
