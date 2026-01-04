import { EducationSection } from './types'

export const strategiesContent: EducationSection = {
  id: 'strategies',
  title: 'Investment Strategies',
  icon: '💡',
  description: 'Explore different investment approaches from value investing to momentum trading, and find what works for you',
  content: [
    {
      heading: 'Finding Your Investment Philosophy',
      body: 'There\'s no single "best" way to invest. The key is finding a strategy that matches your personality, goals, time horizon, and risk tolerance. Let\'s explore the major approaches and help you discover what fits you.',
      type: 'text',
    },
    {
      heading: 'Value Investing - The Warren Buffett Way',
      body: `Philosophy:
"Buy wonderful businesses at fair prices"

Core Principles:
• Invest in undervalued companies
• Focus on intrinsic value vs market price
• Hold for very long term (5-10+ years)
• Ignore short-term market noise
• Margin of safety (buy below intrinsic value)

Who It's For:
• Patient investors
• Those who enjoy fundamental analysis
• Long-term thinkers
• People comfortable going against the crowd

Key Metrics to Watch:
• P/E ratio below market average
• P/B ratio <2.0
• ROE >15%
• Consistent earnings growth
• Strong competitive moats

Australian Examples:
• Warren Buffett's Berkshire Hathaway approach
• Buying bank stocks during 2020 crash
• Investing in quality miners when commodities slump

How to Implement:
1. Find undervalued quality companies
2. Calculate intrinsic value
3. Buy when price is 20-30% below value
4. Hold until price reaches or exceeds value
5. Reinvest dividends
6. Ignore daily price movements

Famous Value Investors:
• Warren Buffett
• Benjamin Graham
• Charlie Munger
• Seth Klarman`,
      type: 'callout',
      relatedTerms: ['value-investing', 'pe-ratio', 'book-value'],
    },
    {
      heading: 'Growth Investing - Riding the Rocket Ships',
      body: `Philosophy:
"Pay any price for exceptional growth"

Core Principles:
• Invest in fast-growing companies
• Prioritize revenue growth over current profits
• Accept high valuations for future potential
• Hold through volatility
• Focus on disruption and innovation

Who It's For:
• Higher risk tolerance
• Belief in technological progress
• Willingness to pay premium valuations
• Long holding period (3-7 years)

Key Metrics to Watch:
• Revenue growth >20% annually
• Market share expansion
• Total Addressable Market (TAM) size
• Customer acquisition trends
• Gross margins improving

Australian Examples:
• Afterpay (before Block acquisition)
• Xero (accounting software)
• WiseTech Global (logistics software)
• Technology sector stocks

How to Implement:
1. Identify disruptive trends early
2. Find companies with competitive advantages
3. Verify revenue growth is accelerating
4. Buy on pullbacks (15-20% corrections)
5. Hold through volatility
6. Sell if growth thesis breaks

Risks:
• High valuations vulnerable to selloffs
• Growth may slow unexpectedly
• Capital intensive (burns cash)
• Interest rate sensitive

Famous Growth Investors:
• Cathie Wood (ARK Invest)
• Peter Lynch (Fidelity)
• Philip Fisher`,
      type: 'callout',
      relatedTerms: ['growth-investing'],
    },
    {
      heading: 'Dividend Investing - The Income Approach',
      body: `Philosophy:
"Get paid to wait"

Core Principles:
• Focus on consistent dividend payers
• Reinvest dividends for compounding
• Prefer stable, mature companies
• Australian franking credits provide tax benefits
• Income > capital gains

Who It's For:
• Retirees needing income
• Conservative investors
• Those who value predictability
• Australian tax residents (franking credits)

Key Metrics to Watch:
• Dividend yield >4%
• Payout ratio 50-70% (sustainable)
• Dividend growth rate
• Years of consecutive payments
• Franking percentage

Australian Dividend Stars:
• Big 4 Banks (5-7% yields typically)
• Telstra (telecommunications)
• Wesfarmers (conglomerate)
• REITs (Scentre, GPT, Stockland)

Dividend Aristocrats Strategy:
Find companies with:
• 10+ years of increasing dividends
• Fully franked (30% tax credit)
• Strong balance sheets
• Defensive business models

How to Implement:
1. Screen for yield >4%, payout <80%
2. Verify dividend history (10+ years)
3. Check balance sheet health
4. Buy on dips in price
5. Reinvest all dividends (DRIP)
6. Build portfolio of 15-20 stocks

Franking Credit Advantage:
$1000 dividend + $429 franking = $1429 total
(If your tax rate is below 30%, you get refund)

Risks:
• Dividend cuts during recessions
• High yield may signal distress
• Lower capital appreciation
• Interest rate sensitive`,
      type: 'callout',
      relatedTerms: ['dividend-investing', 'dividend-yield', 'franking-credits'],
    },
    {
      heading: 'Index Investing - The Passive Approach',
      body: `Philosophy:
"Don't try to beat the market, become the market"

Core Principles:
• Buy entire market via index funds/ETFs
• Ultra-low fees (0.05-0.20%)
• No stock picking required
• Diversification automatic
• Proven to beat 80%+ of active managers

Who It's For:
• Busy professionals
• Hands-off investors
• Those who don't want to research stocks
• Long-term wealth builders
• Cost-conscious investors

Popular Australian ETFs:
• VAS (Vanguard ASX 300): 0.10% fee
• IOZ (iShares ASX 200): 0.09% fee
• A200 (BetaShares ASX 200): 0.07% fee
• VGS (Vanguard Global): 0.18% fee
• DHHF (Diversified High Growth): 0.19% fee

How to Implement:
1. Choose 2-4 broad index ETFs
2. Set asset allocation (e.g., 50% Aus, 50% Int'l)
3. Buy regularly (monthly/quarterly)
4. Rebalance annually
5. Never sell (except retirement)
6. Reinvest distributions

Dollar-Cost Averaging:
Invest same amount every month
• $1000/month into VAS
• Buy more shares when price low
• Buy fewer when price high
• Averages out market timing

Performance:
ASX 200: ~8% annually (historical)
S&P 500: ~10% annually (historical)
Low fees mean you keep more returns

Why It Works:
• Markets trend up long-term
• No emotion in decisions
• Compound growth over decades
• Minimal time required`,
      type: 'callout',
      relatedTerms: ['etf', 'dollar-cost-averaging', 'diversification'],
    },
    {
      heading: 'Momentum Trading - Riding the Trend',
      body: `Philosophy:
"The trend is your friend"

Core Principles:
• Buy what's going up
• Sell what's going down
• Use technical indicators
• Shorter holding periods (weeks to months)
• Cut losses quickly

Who It's For:
• Active traders
• Those comfortable with charts
• Higher risk tolerance
• Time to monitor markets daily

Key Indicators:
• 50-day and 200-day moving averages
• Relative Strength Index (RSI)
• MACD (Moving Average Convergence Divergence)
• Volume confirmation
• Breakout patterns

How to Implement:
1. Screen for stocks in strong uptrends
2. Buy on breakouts above resistance
3. Use stop-losses (5-10% below entry)
4. Take profits at resistance levels
5. Never fight the trend
6. Exit when trend breaks

Entry Rules:
• Price above 50-day & 200-day MA
• Volume increasing on up days
• RSI between 50-70
• Recent golden cross

Exit Rules:
• Stop-loss hit
• Price closes below 50-day MA
• Volume dries up
• RSI above 80 (overbought)

Risks:
• Whipsaws in choppy markets
• Requires discipline
• Time intensive
• Higher transaction costs`,
      type: 'callout',
    },
    {
      heading: 'Sector Rotation - Following Economic Cycles',
      body: `Philosophy:
"Different sectors perform in different economic phases"

The Sector Rotation Cycle:

Early Expansion:
• Financials (banks lending more)
• Consumer Discretionary (spending increases)
• Real Estate (property market strengthens)
Example: CBA, JB Hi-Fi, Scentre Group

Mid Expansion:
• Industrials (manufacturing ramps up)
• Materials (construction booms)
• Technology (business spending)
Example: Boral, BHP, Xero

Late Expansion / Peak:
• Energy (demand peaks)
• Healthcare (defensive positioning)
• Utilities (preparing for slowdown)
Example: Woodside, CSL, APA Group

Early Contraction:
• Consumer Staples (defensive)
• Healthcare (recession-proof)
• Utilities (stable dividends)
Example: Woolworths, CSL, AGL

Late Contraction / Recovery:
• Technology (bargain hunting)
• Financials (preparing for recovery)
• Consumer Discretionary (early positioning)

How to Implement:
1. Identify current economic phase (use PMI, GDP)
2. Allocate to appropriate sectors
3. Rotate every 3-6 months
4. Maintain 3-4 sectors minimum
5. Use sector ETFs for simplicity

Sector ETFs:
• MVA (ASX 200 Industrials)
• MVB (ASX 200 Financials)
• MVW (ASX 200 Materials)`,
      type: 'callout',
      relatedTerms: ['pmi', 'gdp'],
    },
    {
      heading: 'The Druckenmiller Macro Approach',
      body: `Philosophy:
"Invest based on big-picture economic trends"

Stanley Druckenmiller's Method:
1. Analyze global economic trends
2. Identify major shifts early
3. Size positions based on conviction
4. Use leverage when very confident
5. Move quickly when wrong

Key Focus Areas:
• Central bank policies
• Currency movements
• Commodity super-cycles
• Geopolitical events
• Demographic trends

Australian Application:
Monitor:
• China economic data (our biggest customer)
• Iron ore and coal prices
• AUD/USD exchange rate
• RBA policy relative to Fed
• Asian regional growth

How Pros Use It:
• Big bet on China recovery → Buy miners
• Fed raising rates faster than RBA → Short AUD
• Oil price spike → Buy energy stocks
• Recession warning → Shift to bonds

For Retail Investors:
• Follow global macro trends
• Adjust asset allocation quarterly
• Don't use leverage
• Keep positions manageable
• Combine with other strategies`,
      type: 'callout',
      externalLinks: [
        { text: 'Economic Charts (Druckenmiller-style)', url: '/economic-charts' }
      ],
    },
    {
      heading: 'Risk Management Across All Strategies',
      body: `Universal Rules:

Position Sizing:
• No single stock >5% of portfolio
• No sector >25% of portfolio
• Keep 10-20 stocks for diversification
• Scale in gradually (3 purchases)

Stop-Losses:
• Value: -20% or thesis breaks
• Growth: -25% (more volatile)
• Dividend: -15% or dividend cut
• Index: Never (stay invested)
• Momentum: -7% to -10%

Portfolio Allocation by Age:
Age 20-30:
• 90% stocks, 10% bonds
• Can afford volatility
• Time to recover from losses

Age 30-50:
• 80% stocks, 20% bonds
• Peak earning years
• Still growth focused

Age 50-65:
• 60% stocks, 40% bonds
• Approaching retirement
• Preserve capital

Age 65+:
• 40% stocks, 60% bonds/cash
• Generate income
• Minimize volatility

Rebalancing:
• Quarterly or annually
• Sell winners, buy losers
• Return to target allocation
• Forces "buy low, sell high"`,
      type: 'callout',
      relatedTerms: ['asset-allocation', 'diversification', 'rebalancing'],
    },
    {
      heading: 'Combining Strategies - The Hybrid Approach',
      body: `Most successful investors blend strategies:

Example Portfolio:
• 40% Index (VAS, VGS) - Core passive holding
• 30% Dividend (Big 4 banks, Telstra) - Income generation
• 20% Growth (Tech stocks) - Capital appreciation
• 10% Value (Undervalued quality) - Opportunistic

Benefits of Hybrid:
• Diversification of approaches
• Smoother returns
• Multiple income sources
• Flexibility to adapt

Tactical Allocation:
Increase growth in bull markets
Increase dividends in bear markets
Always maintain index core
Adjust other 60% tactically`,
      type: 'callout',
    },
    {
      heading: 'Choosing Your Strategy: Decision Framework',
      body: `Ask Yourself:

Time Available:
• <1 hour/week → Index investing
• 1-3 hours/week → Dividend or Value
• 5+ hours/week → Growth or Momentum
• Full-time → Any strategy

Risk Tolerance:
• Low → Dividend, Index
• Medium → Value, Sector Rotation
• High → Growth, Momentum

Investment Horizon:
• 20+ years → Growth, Index
• 10-20 years → Value, Dividend
• 5-10 years → Dividend, Value
• <5 years → Not recommended for stocks

Financial Goals:
• Current income → Dividend
• Future wealth → Growth, Index
• Beat the market → Value, Momentum
• Match the market → Index

Personality:
• Patient → Value
• Active → Momentum
• Passive → Index
• Income-focused → Dividend
• Analytical → Growth`,
      type: 'list',
    },
    {
      heading: 'Key Takeaways',
      body: `1. No single strategy is "best" - choose what fits you
2. Value investing requires patience and contrarian thinking
3. Growth investing accepts high valuations for future potential
4. Dividend investing generates income with Australian tax benefits
5. Index investing beats most active managers long-term
6. Momentum trading requires discipline and time
7. Sector rotation follows economic cycles
8. Macro approach focuses on big-picture trends
9. Most investors benefit from hybrid approach
10. Risk management is crucial regardless of strategy
11. Start simple, add complexity as you learn
12. Stay consistent - strategy-hopping destroys returns`,
      type: 'list',
    },
  ],
}
