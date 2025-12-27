export default function KnowledgeFeed() {
  const topic = {
    title: 'Understanding the Cash Rate',
    subtitle: 'How the RBA\'s Official Cash Rate Affects Your Money',
    content: `The cash rate is the interest rate that banks pay to borrow money from other banks overnight. Set by the Reserve Bank of Australia (RBA), it's one of the most powerful tools for managing the economy.

**How it works:**
When the RBA raises the cash rate, borrowing becomes more expensive throughout the economy. Banks pass this cost onto customers through higher interest rates on mortgages, personal loans, and credit cards. This discourages spending and borrowing, helping to cool inflation.

Conversely, when the RBA lowers the cash rate, borrowing becomes cheaper, encouraging spending and investment, which can stimulate economic growth.

**Impact on your finances:**
• **Mortgages:** Variable home loan rates typically move in line with cash rate changes
• **Savings:** Higher cash rates usually mean better returns on savings accounts and term deposits
• **Credit cards:** Interest charges on outstanding balances tend to increase with the cash rate
• **Investments:** Rate changes can affect stock market performance and bond yields

**Current situation:**
The RBA has held the cash rate at 4.35% since November 2023, after a series of increases aimed at controlling inflation. The pause suggests the RBA believes rates are high enough to bring inflation back to its 2-3% target range without further hikes.`,
  }

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <span className="text-3xl">📚</span>
        Thought Leadership
      </h2>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-3xl shadow-lg">
            🎓
          </div>
          <div className="flex-1">
            <div className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full mb-2">
              TODAY'S LESSON
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{topic.title}</h3>
            <p className="text-sm text-indigo-700 font-medium">{topic.subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none">
          {topic.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              // This is a heading
              const text = paragraph.replace(/\*\*/g, '')
              return (
                <h4 key={index} className="text-lg font-bold text-slate-900 mt-6 mb-3 flex items-center gap-2">
                  <span className="text-indigo-600">▸</span>
                  {text}
                </h4>
              )
            } else if (paragraph.startsWith('•')) {
              // This is a bullet list
              const items = paragraph.split('\n').filter(item => item.trim())
              return (
                <ul key={index} className="space-y-2 mb-4">
                  {items.map((item, i) => {
                    const cleanItem = item.replace('•', '').trim()
                    const [boldPart, ...rest] = cleanItem.split(':')
                    return (
                      <li key={i} className="flex items-start gap-3 text-slate-700">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <span>
                          <strong className="text-slate-900">{boldPart}:</strong>
                          {rest.join(':')}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )
            } else {
              return (
                <p key={index} className="text-slate-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              )
            }
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-6 pt-6 border-t-2 border-indigo-200">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <h5 className="font-semibold text-slate-900 mb-1">Want to learn more?</h5>
                <p className="text-xs text-slate-600">
                  Check out the RBA's website for detailed explanations of monetary policy and economic indicators.
                </p>
              </div>
              <a
                href="https://www.rba.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm px-4 py-2"
              >
                Visit RBA
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Topics */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Related Topics to Explore:</h4>
        <div className="flex flex-wrap gap-2">
          {['Inflation', 'GDP', 'Unemployment', 'Bond Yields', 'Currency Exchange'].map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium hover:bg-indigo-100 hover:text-indigo-700 cursor-pointer transition-colors"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
