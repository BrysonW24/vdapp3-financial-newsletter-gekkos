import { EducationSection } from './types'

export const bigPictureContent: EducationSection = {
  id: 'big-picture',
  title: 'The Big Picture',
  icon: '🌐',
  description: 'Understand the financial ecosystem, how markets are interconnected, and how money flows through the global economy',
  content: [
    {
      heading: 'Understanding the Financial Ecosystem',
      body: 'The global financial system is a complex network where money, information, and risk flow between different participants. Think of it as a massive circulatory system where cash is the blood, banks are the arteries, and investors are the organs that keep everything functioning.',
      type: 'text',
    },
    {
      heading: 'The Three Main Asset Classes',
      body: 'All investments fall into three broad categories, each serving different purposes in your portfolio:',
      type: 'text',
    },
    {
      heading: 'Equities (Stocks)',
      body: `• Ownership stakes in companies
• Higher risk, higher potential returns
• Examples: ASX 200 stocks, S&P 500 companies
• Best for: Long-term growth, beating inflation
• Typical returns: 8-10% annually (historical average)`,
      type: 'list',
      relatedTerms: ['stock', 'asx', 'market-cap'],
    },
    {
      heading: 'Fixed Income (Bonds)',
      body: `• Loans to governments or corporations
• Lower risk, predictable income
• Examples: Australian Government Bonds, Corporate Bonds
• Best for: Stability, regular income
• Typical returns: 3-5% annually`,
      type: 'list',
      relatedTerms: ['bond', 'yield-curve'],
    },
    {
      heading: 'Alternative Assets',
      body: `• Real estate, commodities, cryptocurrency
• Diversification benefits
• Examples: REITs, gold, Bitcoin
• Best for: Portfolio diversification
• Varies widely by asset type`,
      type: 'list',
      relatedTerms: ['reit', 'cryptocurrency'],
    },
    {
      heading: 'How Markets Are Interconnected',
      body: 'Financial markets don\'t exist in isolation. A change in one market ripples through others. Here are the key relationships:',
      type: 'text',
    },
    {
      heading: 'Stock Markets ↔ Bond Markets',
      body: `When interest rates rise:
• Bonds become more attractive (higher yields)
• Money flows out of stocks into bonds
• Stock prices typically fall
• This is called "risk-off" behavior

When interest rates fall:
• Bonds offer lower returns
• Money flows into stocks for better returns
• Stock prices typically rise
• This is called "risk-on" behavior`,
      type: 'callout',
      relatedTerms: ['cash-rate', 'bull-market', 'bear-market'],
    },
    {
      heading: 'Currency Markets Impact Everything',
      body: `A strong Australian dollar (AUD) means:
• Imports become cheaper (good for consumers)
• Exports become more expensive (bad for miners, agriculture)
• International travel is cheaper
• Foreign investments return less when converted back

A weak Australian dollar means:
• Exports more competitive globally
• Mining and agriculture sectors benefit
• Overseas travel more expensive
• Inflation from imported goods`,
      type: 'callout',
      relatedTerms: ['inflation'],
    },
    {
      heading: 'The Flow of Money: A Day in the Life',
      body: 'Let\'s trace how money moves through the system on a typical day:',
      type: 'text',
    },
    {
      heading: 'Morning: Asian Markets',
      body: `1. Tokyo and Hong Kong markets open
2. Japanese exporters react to overnight US news
3. Chinese economic data releases move commodity prices
4. Australian mining stocks adjust to commodity movements
5. Currency traders position for the European session`,
      type: 'list',
    },
    {
      heading: 'Midday: European Markets',
      body: `1. London, Frankfurt, Paris markets open
2. European Central Bank statements move EUR/USD
3. FTSE 100 reflects UK economic sentiment
4. European bonds trade based on inflation data
5. Forex markets see highest liquidity`,
      type: 'list',
    },
    {
      heading: 'Afternoon: US Markets',
      body: `1. New York opens - highest market volume globally
2. S&P 500, NASDAQ, Dow Jones set the tone
3. Federal Reserve decisions ripple worldwide
4. US economic data (jobs, GDP) moves all asset classes
5. Close of US markets influences Asian opening`,
      type: 'list',
      relatedTerms: ['fed', 'sp500'],
    },
    {
      heading: 'Market Participants: Who\'s Moving the Markets?',
      body: 'Different players have different goals and time horizons:',
      type: 'text',
    },
    {
      heading: 'Retail Investors (You)',
      body: `• Individual investors buying for personal accounts
• Long-term focus (retirement, wealth building)
• Smaller position sizes
• React to news and fundamentals
• Growing influence through platforms like CommSec`,
      type: 'list',
      relatedTerms: ['retail-investor', 'broker'],
    },
    {
      heading: 'Institutional Investors',
      body: `• Pension funds, mutual funds, insurance companies
• Manage billions in assets
• Long-term investment horizon
• Drive major market movements
• Examples: Australian Super, BlackRock, Vanguard`,
      type: 'list',
      relatedTerms: ['institutional-investor'],
    },
    {
      heading: 'Hedge Funds',
      body: `• Actively managed funds seeking absolute returns
• Use leverage and derivatives
• Short-term to medium-term trades
• Can profit in up or down markets
• Higher risk, higher fees`,
      type: 'list',
      relatedTerms: ['leverage', 'short-selling'],
    },
    {
      heading: 'Market Makers',
      body: `• Provide liquidity by always offering to buy and sell
• Profit from bid-ask spreads
• Essential for market functioning
• Reduce volatility
• Examples: Investment bank trading desks`,
      type: 'list',
      relatedTerms: ['market-maker', 'liquidity'],
    },
    {
      heading: 'Economic Cycles: The Big Picture Timeline',
      body: 'Markets move in cycles. Understanding where we are in the cycle helps you make better decisions:',
      type: 'text',
    },
    {
      heading: 'Expansion Phase',
      body: `• GDP growing, unemployment falling
• Corporate profits rising
• Stock markets climbing
• Interest rates low to moderate
• Consumer confidence high
• Best time for: Growth stocks, real estate`,
      type: 'callout',
      relatedTerms: ['gdp', 'bull-market'],
    },
    {
      heading: 'Peak Phase',
      body: `• Economy at maximum output
• Inflation rising
• Central banks raising interest rates
• Stock valuations stretched
• Warning signs appear
• Best time for: Taking profits, adding bonds`,
      type: 'callout',
      relatedTerms: ['inflation', 'pe-ratio'],
    },
    {
      heading: 'Contraction/Recession Phase',
      body: `• GDP declining for 2+ quarters
• Unemployment rising
• Corporate profits falling
• Stock markets declining (bear market)
• Central banks cutting rates
• Best time for: Cash, high-quality bonds, defensive stocks`,
      type: 'callout',
      relatedTerms: ['recession', 'bear-market'],
    },
    {
      heading: 'Recovery Phase',
      body: `• Economy stabilizing
• Early signs of growth
• Unemployment still high but improving
• Stock markets bottoming and starting to rise
• Interest rates at historic lows
• Best time for: Bargain hunting, cyclical stocks`,
      type: 'callout',
      relatedTerms: ['market-cycle'],
    },
    {
      heading: 'Global Linkages: Why Australian Markets Never Sleep',
      body: 'Australia\'s market doesn\'t exist in a vacuum. Here\'s what influences our markets:',
      type: 'text',
    },
    {
      heading: 'China\'s Economic Health',
      body: `Australia's largest trading partner affects:
• Iron ore prices (major export)
• ASX mining stocks (BHP, RIO, FMG)
• Australian dollar strength
• Consumer goods demand
• Education and tourism sectors`,
      type: 'list',
    },
    {
      heading: 'US Federal Reserve Decisions',
      body: `Fed rate changes impact:
• Global interest rate expectations
• AUD/USD exchange rate
• Australian bond yields
• ASX tech stock valuations
• Commodity prices (priced in USD)`,
      type: 'list',
      relatedTerms: ['fed', 'cash-rate'],
    },
    {
      heading: 'Oil Prices',
      body: `Affect Australian economy through:
• Petrol prices (consumer spending)
• Input costs for businesses
• Inflation expectations
• Energy company profitability
• Transportation sector costs`,
      type: 'list',
    },
    {
      heading: 'Key Takeaways',
      body: `1. Everything is connected - stocks, bonds, currencies, and commodities all influence each other
2. Markets operate 24/7 globally - what happens in New York affects Sydney
3. Different participants have different time horizons and goals
4. Economic cycles are predictable patterns - learn to recognize them
5. Australia's market is heavily influenced by China and global commodity prices
6. Understanding the big picture helps you make sense of daily market movements`,
      type: 'list',
    },
    {
      heading: 'Next Steps',
      body: 'Now that you understand the financial ecosystem, dive deeper into specific topics:',
      type: 'text',
    },
  ],
}
