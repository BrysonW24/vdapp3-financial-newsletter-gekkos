import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import NewsletterLayout from '@/components/newsletter/NewsletterLayout'
import EducationCard from '@/components/education/EducationCard'
import Link from 'next/link'

const sections = [
  {
    id: 'big-picture',
    title: 'Big Picture',
    description: 'Understand the financial ecosystem, how markets are interconnected, and how money flows through the global economy.',
    icon: '🌐',
    color: 'blue' as const,
    path: '/education/big-picture',
  },
  {
    id: 'players',
    title: 'Big Players',
    description: 'Learn about central banks, investment banks, institutional investors, hedge funds, and their roles in shaping markets.',
    icon: '🏛️',
    color: 'purple' as const,
    path: '/education/players',
  },
  {
    id: 'indicators',
    title: 'Economic Indicators',
    description: 'Master leading, coincident, and lagging indicators. Understand how upstream factors impact downstream outcomes.',
    icon: '📊',
    color: 'amber' as const,
    path: '/education/indicators',
  },
  {
    id: 'stock-selection',
    title: 'Stock Selection',
    description: 'Discover how to choose stocks using fundamental and technical analysis. Learn what metrics to track and when.',
    icon: '🎯',
    color: 'green' as const,
    path: '/education/stock-selection',
  },
  {
    id: 'strategies',
    title: 'Investment Strategies',
    description: 'Explore different investment approaches from value investing to momentum trading, and find what works for you.',
    icon: '💡',
    color: 'indigo' as const,
    path: '/education/strategies',
  },
  {
    id: 'glossary',
    title: 'Glossary',
    description: 'Search our comprehensive financial glossary with definitions, examples, and links to authoritative resources.',
    icon: '📖',
    color: 'slate' as const,
    path: '/education/glossary',
  },
]

export default function EducationHubPage() {
  return (
    <NewsletterLayout>
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-6xl shadow-2xl ring-8 ring-green-200 mb-6 animate-fade-in">
            🎓
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 animate-slide-up">
            Education Hub
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Master the fundamentals of finance and investing. From understanding the big picture
            to selecting individual stocks, we'll guide you through everything you need to know
            to become a confident investor.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="section-card mb-12 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🚀</div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Your Journey to Financial Literacy
              </h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                Whether you're completely new to investing or looking to deepen your understanding,
                our Education Hub provides clear, practical knowledge about how financial markets work.
              </p>
              <p className="text-slate-700 leading-relaxed">
                We believe that financial education should be accessible to everyone. That's why
                all our educational content is completely free and designed to break down complex
                concepts into easy-to-understand lessons.
              </p>
            </div>
          </div>
        </div>

        {/* Section Cards Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">📚</span>
            Explore by Topic
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <EducationCard
                key={section.id}
                title={section.title}
                description={section.description}
                icon={section.icon}
                color={section.color}
                link={section.path}
              />
            ))}
          </div>
        </div>

        {/* Learning Path */}
        <div className="section-card mb-12 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">🗺️</span>
            Suggested Learning Path
          </h2>
          <p className="text-slate-700 mb-6">
            New to investing? We recommend following this learning sequence:
          </p>
          <div className="space-y-3">
            {[
              { num: 1, title: 'Big Picture', desc: 'Start with the financial ecosystem overview' },
              { num: 2, title: 'Big Players', desc: 'Understand who influences the markets' },
              { num: 3, title: 'Economic Indicators', desc: 'Learn to read market signals' },
              { num: 4, title: 'Stock Selection', desc: 'Discover how to evaluate individual stocks' },
              { num: 5, title: 'Investment Strategies', desc: 'Find the approach that fits your goals' },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-3 bg-white rounded-lg p-4">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access to Glossary */}
        <div className="section-card mb-12 text-center bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200">
          <div className="text-5xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Financial Glossary
          </h2>
          <p className="text-slate-700 mb-6 max-w-2xl mx-auto">
            Don't know what a term means? Search our comprehensive glossary of financial
            terms with clear definitions, examples, and links to learn more.
          </p>
          <Link
            href="/education/glossary"
            className="inline-block px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md"
          >
            Browse Glossary →
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-6">
          <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            Educational Purpose Only
          </h3>
          <p className="text-sm text-amber-900 leading-relaxed">
            The content in our Education Hub is provided for educational purposes only and should
            not be considered as financial advice. Always conduct your own research and consult
            with a qualified financial advisor before making investment decisions. Past performance
            is not indicative of future results.
          </p>
        </div>
      </div>

      <Footer />
    </NewsletterLayout>
  )
}
