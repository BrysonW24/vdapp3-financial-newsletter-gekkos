export default function EntertainmentFeed() {
  const featured = {
    title: 'The Big Short (2015)',
    type: 'Film',
    platform: 'Netflix, Amazon Prime',
    duration: '2h 10min',
    rating: '7.8/10',
    description: `Perfect weekend viewing for finance enthusiasts! This Oscar-winning film tells the true story of investors who predicted the 2008 financial crisis and bet against the housing market.

Starring Christian Bale, Steve Carell, Ryan Gosling, and Brad Pitt, the movie brilliantly breaks down complex financial concepts like CDOs and credit default swaps in an entertaining and accessible way.

**Why you'll love it:**
Learn about the subprime mortgage crisis while being thoroughly entertained by stellar performances and sharp wit. The film provides valuable lessons about market bubbles, risk management, and the importance of independent thinking in finance.

**Perfect for:** Anyone interested in understanding market dynamics, financial history, or just enjoying a well-crafted true story.`,
    image: '🎬',
  }

  const alternativePicks = [
    { title: 'Margin Call (2011)', genre: 'Financial Thriller', platform: 'Stan' },
    { title: 'Money Explained', genre: 'Documentary Series', platform: 'Netflix' },
    { title: 'The Wolf of Wall Street', genre: 'Biography/Drama', platform: 'Netflix' },
  ]

  return (
    <div className="section-card animate-slide-up bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 border-2 border-pink-200">
      <h2 className="section-title">
        <span className="text-3xl">🎬</span>
        Entertainment Feed
        <span className="ml-auto text-sm font-normal bg-pink-500 text-white px-3 py-1 rounded-full">
          Friday Special
        </span>
      </h2>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        {/* Featured Content Header */}
        <div className="flex items-start gap-6 mb-6">
          <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-6xl shadow-xl">
            {featured.image}
          </div>
          <div className="flex-1">
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold rounded-full mb-2">
              WHAT TO WATCH THIS WEEKEND
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">{featured.title}</h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <span>📺</span>
                {featured.type}
              </span>
              <span className="flex items-center gap-1">
                <span>⏱️</span>
                {featured.duration}
              </span>
              <span className="flex items-center gap-1">
                <span>⭐</span>
                {featured.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-sm max-w-none mb-6">
          {featured.description.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              const text = paragraph.replace(/\*\*/g, '')
              return (
                <h4 key={index} className="text-md font-bold text-slate-900 mt-4 mb-2 flex items-center gap-2">
                  <span className="text-purple-600">▸</span>
                  {text}
                </h4>
              )
            } else {
              return (
                <p key={index} className="text-slate-700 leading-relaxed mb-3">
                  {paragraph}
                </p>
              )
            }
          })}
        </div>

        {/* Where to Watch */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <div className="flex-1">
              <h5 className="font-semibold text-slate-900 mb-1">Available on:</h5>
              <p className="text-sm text-slate-700">{featured.platform}</p>
            </div>
          </div>
        </div>

        {/* Alternative Picks */}
        <div>
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span>🍿</span>
            More Finance-Themed Picks
          </h4>
          <div className="grid md:grid-cols-3 gap-3">
            {alternativePicks.map((pick, index) => (
              <div
                key={index}
                className="bg-slate-50 hover:bg-purple-50 border-2 border-slate-200 hover:border-purple-300 rounded-lg p-4 transition-all duration-200 cursor-pointer"
              >
                <h5 className="font-semibold text-slate-900 mb-1">{pick.title}</h5>
                <p className="text-xs text-slate-600 mb-2">{pick.genre}</p>
                <span className="text-xs text-purple-600 font-medium">{pick.platform}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enjoy Your Weekend */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
          <span className="text-2xl">🎉</span>
          <span className="font-semibold">Enjoy your weekend from Gekkos!</span>
        </div>
      </div>
    </div>
  )
}
