import Link from 'next/link'

interface EducationCardProps {
  title: string
  description: string
  icon: string
  color: 'blue' | 'purple' | 'amber' | 'green' | 'indigo' | 'slate'
  link?: string
}

const gradientClasses = {
  blue: 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300',
  purple: 'from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300',
  amber: 'from-amber-50 to-amber-100 border-amber-200 hover:border-amber-300',
  green: 'from-green-50 to-green-100 border-green-200 hover:border-green-300',
  indigo: 'from-indigo-50 to-indigo-100 border-indigo-200 hover:border-indigo-300',
  slate: 'from-slate-50 to-slate-100 border-slate-200 hover:border-slate-300',
}

const iconBgClasses = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
  green: 'bg-green-500',
  indigo: 'bg-indigo-500',
  slate: 'bg-slate-500',
}

export default function EducationCard({
  title,
  description,
  icon,
  color,
  link,
}: EducationCardProps) {
  const gradientClass = gradientClasses[color]
  const iconBgClass = iconBgClasses[color]

  const cardContent = (
    <div className={`
      section-card bg-gradient-to-br ${gradientClass}
      transition-all duration-300 hover:shadow-lg cursor-pointer
      h-full flex flex-col
    `}>
      <div className={`
        w-16 h-16 ${iconBgClass} rounded-full
        flex items-center justify-center text-3xl
        shadow-lg ring-4 ring-white/50 mb-4
      `}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {title}
      </h3>
      <p className="text-slate-700 leading-relaxed flex-grow">
        {description}
      </p>
      {link && (
        <div className="mt-4 text-sm font-semibold text-slate-600 flex items-center gap-1">
          Learn more <span className="text-lg">→</span>
        </div>
      )}
    </div>
  )

  if (link) {
    return (
      <Link href={link} className="block h-full">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}
