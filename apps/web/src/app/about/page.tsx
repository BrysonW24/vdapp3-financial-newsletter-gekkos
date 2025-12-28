import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import NewsletterLayout from '@/components/newsletter/NewsletterLayout'

export default function AboutPage() {
  return (
    <NewsletterLayout>
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block w-24 h-24 bg-gecko-500 rounded-full flex items-center justify-center text-6xl shadow-2xl ring-8 ring-gecko-200 mb-6">
            🦎
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            About Gekkos
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your trusted daily digest of finance, markets, and knowledge
          </p>
        </div>

        {/* Mission */}
        <div className="section-card mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            Our Mission
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Gekkos was created to serve the Australian finance community with a comprehensive,
            easy-to-digest daily newsletter that covers everything you need to know about markets,
            economics, and financial news.
          </p>
          <p className="text-slate-700 leading-relaxed">
            We believe that staying informed about financial markets shouldn't require hours of research
            every day. That's why we aggregate, curate, and present the most important financial news
            and data in a format you can consume in just 5-10 minutes over your morning coffee.
          </p>
        </div>

        {/* What We Cover */}
        <div className="section-card mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">📰</span>
            What We Cover
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: '📈', title: 'Trading Feed', desc: 'ASX, global markets, featured stocks, and market movers' },
              { icon: '🏠', title: 'Property Feed', desc: 'Australian property market news and trends' },
              { icon: '💹', title: 'Stocks Feed', desc: 'Major stock market news and company updates' },
              { icon: '₿', title: 'Crypto Feed', desc: 'Cryptocurrency markets and blockchain news' },
              { icon: '🏦', title: 'Economy Feed', desc: 'RBA updates, economic indicators, and macro news' },
              { icon: '💻', title: 'Technology Feed', desc: 'Fintech innovations and tech sector news' },
              { icon: '📚', title: 'Knowledge Feed', desc: 'Educational content to build financial literacy' },
              { icon: '📊', title: 'Daily Graphics', desc: 'Engaging visualizations of financial concepts' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Gecko */}
        <div className="section-card mb-8 bg-gradient-to-br from-gecko-50 to-emerald-50 border-2 border-gecko-300">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">🦎</span>
            Why "Gecko"?
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Like a gecko that's always watching, always aware of its surroundings, we keep our eyes
            on the markets 24/7. Geckos are known for their ability to see in the dark and navigate
            complex environments - just like successful investors need to do in the financial markets.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Plus, geckos are resilient, adaptable creatures that thrive in various conditions.
            We believe these are essential qualities for anyone participating in financial markets.
          </p>
        </div>

        {/* Commitment */}
        <div className="section-card mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">✅</span>
            Our Commitment
          </h2>
          <ul className="space-y-3">
            {[
              'Deliver accurate, timely financial news and data every morning',
              'Present complex financial concepts in accessible, understandable ways',
              'Maintain editorial independence and objectivity',
              'Respect your time with concise, well-organised content',
              'Continuously improve based on community feedback',
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-gecko-600 font-bold mt-1">•</span>
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-6">
          <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            Important Disclaimer
          </h3>
          <p className="text-sm text-amber-900 leading-relaxed">
            Gekkos provides news and information for educational purposes only. Nothing in our
            newsletter constitutes financial advice, investment recommendations, or an offer to buy or
            sell securities. Always consult with a qualified financial advisor before making investment
            decisions. Past performance does not guarantee future results.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-gradient-financial text-white rounded-xl p-8 shadow-lg">
          <div className="text-4xl mb-4">💌</div>
          <h3 className="text-2xl font-bold mb-2">Have Feedback?</h3>
          <p className="text-slate-300 mb-6">
            We'd love to hear from you! Help us make Gekkos even better.
          </p>
          <a href="mailto:feedback@geckosdaily.com" className="btn-primary inline-block">
            Send us your thoughts
          </a>
        </div>
      </div>

      <Footer />
    </NewsletterLayout>
  )
}
