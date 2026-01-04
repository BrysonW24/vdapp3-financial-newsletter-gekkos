import { EducationSection } from './types'

export const stockSelectionContent: EducationSection = {
  id: 'stock-selection',
  title: 'Stock Selection',
  icon: '🎯',
  description: 'Discover how to choose stocks using fundamental and technical analysis. Learn what metrics to track and when',
  content: [
    {
      heading: 'Finding Winning Stocks',
      body: 'Stock selection is both art and science. You need to understand what makes a company valuable (fundamentals) and when to buy it (technicals). Master both and you\'ll consistently beat the market.',
      type: 'text',
    },
    {
      heading: 'Two Approaches to Stock Analysis',
      body: `Fundamental Analysis: "What to buy"
• Analyzes company financials
• Determines intrinsic value
• Focuses on long-term prospects
• Answers: Is this a good company?

Technical Analysis: "When to buy"
• Studies price charts and patterns
• Identifies entry and exit points
• Focuses on timing
• Answers: Is this a good time?

Best Approach: Use both
• Fundamentals find quality companies
• Technicals time your entry
• Combine for maximum success`,
      type: 'callout',
    },
    {
      heading: 'Fundamental Analysis: Understanding Company Value',
      body: 'Before buying any stock, analyze these key financial metrics:',
      type: 'text',
    },
    {
      heading: 'Revenue Growth - The Top Line',
      body: `What It Tells You:
Is the company growing sales?

How to Analyze:
• Compare revenue year-over-year
• Look for consistent growth (10%+ annually)
• Check revenue sources (diversified or concentrated)
• Compare to industry average

Red Flags:
• Declining revenue
• One-off sales boosting numbers
• Revenue growing slower than competitors

Where to Find It:
Annual reports, quarterly earnings, ASX announcements`,
      type: 'callout',
      relatedTerms: ['eps'],
    },
    {
      heading: 'Earnings Per Share (EPS) - Profitability',
      body: `Formula: Net Income ÷ Shares Outstanding

What It Tells You:
How much profit each share generates

Good vs Bad:
• Rising EPS = Good (company getting more profitable)
• Stable EPS = Okay (predictable profits)
• Falling EPS = Bad (losing profitability)

What to Look For:
• Consistent EPS growth (15%+ annually)
• EPS growing faster than revenue (margins improving)
• Compare to past 5 years
• Check quarterly trends

Australian Examples:
• CBA: Consistently growing EPS ($5-6 range)
• BHP: Cyclical EPS (depends on commodity prices)
• CSL: Steady EPS growth (healthcare defensive)`,
      type: 'callout',
      relatedTerms: ['eps', 'pe-ratio'],
    },
    {
      heading: 'P/E Ratio - Valuation',
      body: `Formula: Stock Price ÷ Earnings Per Share

What It Tells You:
How much you pay for each dollar of earnings

Interpretation:
• Low P/E (5-15): Potentially undervalued or slow growth
• Medium P/E (15-25): Fairly valued
• High P/E (25+): Expensive or high growth expected

Context Matters:
• Banks typically have P/E of 10-15
• Tech companies can have P/E of 30-50+
• Compare within same sector

How to Use It:
1. Find company's current P/E
2. Compare to:
   • Its own 5-year average
   • Competitors
   • Market average (ASX 200 ~15-18)

Example:
Stock A: P/E of 25, growing earnings 20% annually = Reasonable
Stock B: P/E of 25, earnings flat = Expensive

Warning Signs:
• P/E over 30 without growth to justify
• P/E much higher than sector average
• P/E falling while stock price rises`,
      type: 'callout',
      relatedTerms: ['pe-ratio', 'valuation'],
    },
    {
      heading: 'Dividend Yield - Income Generation',
      body: `Formula: (Annual Dividends ÷ Stock Price) × 100

What It Tells You:
Annual income as percentage of investment

Australian Context:
• Australian stocks love dividends
• Franking credits make dividends tax-efficient
• Big 4 banks typically yield 5-7%

Good Yields by Sector:
• Banks: 5-7%
• Mining: 3-5% (variable)
• REITs: 4-6%
• Tech: 0-2%

Red Flags:
• Yield above 10% (unsustainable)
• Yield rising because price falling
• Payout ratio >80% (not sustainable)

Dividend Aristocrats:
Companies with 25+ years of increasing dividends
• CBA, Westpac, ANZ (mostly consistent)
• Washington H. Soul Pattinson
• Australian Foundation Investment Company`,
      type: 'callout',
      relatedTerms: ['dividend-yield', 'franking-credits'],
    },
    {
      heading: 'Return on Equity (ROE) - Efficiency',
      body: `Formula: (Net Income ÷ Shareholders' Equity) × 100

What It Tells You:
How efficiently company uses shareholder money

Good ROE:
• 15%+ = Excellent
• 10-15% = Good
• <10% = Needs improvement

Why It Matters:
High ROE means company doesn't need much capital to grow
• Can reinvest profits for compounding growth
• Less need to raise new capital
• Usually translates to higher stock returns

Compare Within Sectors:
• Banks: 10-15% ROE typical
• Tech: 20-30% ROE common
• Manufacturing: 8-12% ROE normal`,
      type: 'callout',
      relatedTerms: ['roe'],
    },
    {
      heading: 'Debt-to-Equity Ratio - Financial Health',
      body: `Formula: Total Debt ÷ Total Equity

What It Tells You:
How much debt company uses vs equity

Interpretation:
• <0.5 = Conservative (low debt)
• 0.5-1.0 = Moderate (balanced)
• >1.0 = Aggressive (high debt)
• >2.0 = Risky (very leveraged)

When Debt is Good:
• Interest rates are low
• ROE exceeds interest rate
• Stable, predictable cash flows

When Debt is Bad:
• Interest rates rising
• Cyclical industry (mining, construction)
• Uncertain cash flows

Sector Differences:
• Utilities, REITs: High debt normal (1.5-2.0)
• Tech, Healthcare: Low debt preferred (<0.5)
• Banks: Different metrics (use capital ratios)`,
      type: 'callout',
      relatedTerms: ['debt-to-equity', 'leverage'],
    },
    {
      heading: 'Technical Analysis: Timing Your Trades',
      body: 'Once you\'ve found a quality company, technical analysis helps you buy at the right time.',
      type: 'text',
    },
    {
      heading: 'Support and Resistance Levels',
      body: `Support (Floor):
Price level where buying interest is strong enough to prevent further decline

How to Identify:
• Price bounces off same level multiple times
• Previous lows become support
• Round numbers (e.g., $50, $100)
• Moving averages act as support

Resistance (Ceiling):
Price level where selling interest prevents further rise

How to Identify:
• Price fails to break through multiple times
• Previous highs become resistance
• Psychological levels
• Moving averages act as resistance

Trading Strategy:
• Buy near support levels
• Sell near resistance levels
• When resistance breaks, it becomes new support
• Set stop-losses below support

Example:
CBA stock:
• Support at $100 (bounced 3 times in 2023)
• Resistance at $110 (failed to break)
• Buy around $102, sell around $108`,
      type: 'callout',
    },
    {
      heading: 'Moving Averages - Trend Identification',
      body: `What They Are:
Average price over specific time period

Common Periods:
• 50-day MA (short-term trend)
• 200-day MA (long-term trend)

How to Use Them:
Golden Cross (Bullish):
• 50-day MA crosses above 200-day MA
• Signals beginning of uptrend
• Time to buy

Death Cross (Bearish):
• 50-day MA crosses below 200-day MA
• Signals beginning of downtrend
• Time to sell or reduce position

Price vs MA:
• Price above both MAs = Strong uptrend
• Price below both MAs = Strong downtrend
• Price between MAs = Consolidation

Dynamic Support/Resistance:
• 50-day MA often acts as support in uptrends
• 200-day MA strong support/resistance level`,
      type: 'callout',
    },
    {
      heading: 'Volume Analysis - Confirmation',
      body: `Why Volume Matters:
Price movements with high volume are more significant

Key Patterns:
Rising Prices + High Volume = Strong bullish signal
Rising Prices + Low Volume = Weak move, likely reversal
Falling Prices + High Volume = Strong bearish signal
Falling Prices + Low Volume = Weak move, may bounce

Volume Spikes:
• News announcements
• Earnings releases
• Institutional buying/selling
• Breakouts or breakdowns

How to Use It:
• Confirm price moves with volume
• Breakouts with high volume = Valid
• Breakouts with low volume = False signal
• Watch for volume surges (3x average)`,
      type: 'callout',
      relatedTerms: ['volume'],
    },
    {
      heading: 'What to Track: Your Monitoring Checklist',
      body: 'Stay on top of your stocks with regular monitoring:',
      type: 'text',
    },
    {
      heading: 'Daily (5 minutes)',
      body: `• Check stock price and % change
• Read any ASX announcements
• Note volume (normal or unusual?)
• Check market sentiment (ASX 200 direction)

When to Act:
• Price falls >5% on no news = Buying opportunity?
• Volume spike = Investigate why
• ASX announcement = Read immediately`,
      type: 'callout',
    },
    {
      heading: 'Weekly (15 minutes)',
      body: `• Review portfolio performance vs ASX 200
• Check support/resistance levels
• Update moving averages
• Read weekly sector news

Actions:
• Rebalance if any stock >25% of portfolio
• Add to positions near support
• Take profits near resistance`,
      type: 'callout',
    },
    {
      heading: 'Monthly (30 minutes)',
      body: `• Review fundamental metrics (if data updated)
• Compare to initial investment thesis
• Check for dividend announcements
• Review analyst upgrades/downgrades
• Assess sector trends

Questions to Ask:
• Is company still meeting growth targets?
• Has competitive position changed?
• Are valuations still reasonable?
• Should I add, hold, or trim?`,
      type: 'callout',
    },
    {
      heading: 'Quarterly (1 hour)',
      body: `• Read full quarterly earnings report
• Listen to earnings call (if available)
• Update financial model
• Review management guidance
• Check insider buying/selling

Deep Dive:
• Compare results to expectations
• Analyze margin trends
• Assess competitive threats
• Review balance sheet changes`,
      type: 'callout',
    },
    {
      heading: 'Red Flags to Avoid',
      body: `Financial Red Flags:
• Declining revenue for 2+ quarters
• Margins shrinking
• Debt increasing while revenue flat
• Cash flow negative (unless early growth stage)
• Goodwill >50% of assets

Management Red Flags:
• CEO selling significant shares
• Board turnover
• Accounting restatements
• Overly optimistic guidance never met
• Excessive executive compensation

Market Red Flags:
• Stock price down >50% while market flat
• Very high short interest
• Analysts downgrading en masse
• Dividend cut
• Credit rating downgrade`,
      type: 'list',
    },
    {
      heading: 'Building Your Stock Selection Framework',
      body: `Step 1: Screen for Quality
• ROE >15%
• Debt-to-Equity <1.0
• Revenue growth >10%
• Positive free cash flow

Step 2: Value Reasonably
• P/E ratio below sector average or growth rate
• Compare to 5-year average valuation
• Check if price near 52-week low

Step 3: Technical Confirmation
• Price above 200-day MA
• Recent golden cross or approaching one
• Support level nearby for entry

Step 4: Risk Management
• Position size max 5% of portfolio
• Set stop-loss 10-15% below entry
• Define exit criteria before buying
• Know your holding period (1 year? 5 years?)

Step 5: Monitor and Adjust
• Track metrics quarterly
• Sell if thesis breaks
• Let winners run
• Cut losers quickly`,
      type: 'list',
    },
    {
      heading: 'Key Takeaways',
      body: `1. Use fundamentals to find quality companies worth owning
2. P/E ratio, ROE, and debt levels are essential metrics
3. Technical analysis helps you time entry and exit points
4. Support and resistance guide buying and selling decisions
5. Volume confirms price movements
6. Monitor daily for news, weekly for trends, quarterly for fundamentals
7. Red flags are warnings - don't ignore them
8. Build a systematic selection process
9. Quality + reasonable price + good timing = winning combination
10. Never stop learning - markets evolve, so must you`,
      type: 'list',
    },
  ],
}
