import { EducationSection } from './types'

export const playersContent: EducationSection = {
  id: 'players',
  title: 'Big Players',
  icon: '🏛️',
  description: 'Learn about central banks, investment banks, institutional investors, hedge funds, and their roles in shaping markets',
  content: [
    {
      heading: 'Who Really Moves Markets?',
      body: 'While retail investors like you and me make up a large number of market participants, the real power to move markets lies with a handful of massive institutions. Understanding who they are and what they do helps you make sense of market movements.',
      type: 'text',
    },
    {
      heading: 'Central Banks: The Puppet Masters',
      body: 'Central banks don\'t invest in markets, but they control the most powerful lever of all: interest rates and money supply.',
      type: 'text',
    },
    {
      heading: 'Reserve Bank of Australia (RBA)',
      body: `Role: Australia's central bank and monetary policy setter

Key Powers:
• Sets the cash rate (overnight lending rate between banks)
• Controls money supply through bond purchases/sales
• Manages currency stability
• Publishes economic forecasts and policy statements

Impact on Markets:
• Cash rate changes affect all interest rates in the economy
• Influences AUD/USD exchange rate
• Affects bank profitability (NAB, CBA, ANZ, Westpac)
• Impacts property market through mortgage rates
• Signals economic health to investors

What They Watch:
• Inflation rate (targeting 2-3%)
• Employment levels
• Wage growth
• Housing market stability`,
      type: 'callout',
      relatedTerms: ['rba', 'cash-rate', 'monetary-policy'],
      externalLinks: [
        { text: 'RBA Official Website', url: 'https://www.rba.gov.au' }
      ],
    },
    {
      heading: 'US Federal Reserve (The Fed)',
      body: `Role: Most powerful central bank globally

Why Australians Should Care:
• Fed rate decisions move global markets
• US rates affect AUD/USD exchange rate
• Influences commodity prices (priced in USD)
• US recession affects Australian exports
• Sets global risk sentiment

Key Figures:
• Federal Reserve Chair (currently Jerome Powell)
• Federal Open Market Committee (FOMC)
• 12 regional Federal Reserve Banks

Meeting Schedule:
• 8 scheduled meetings per year
• Emergency meetings for crises
• Markets hang on every word`,
      type: 'callout',
      relatedTerms: ['fed', 'sp500'],
      externalLinks: [
        { text: 'Federal Reserve', url: 'https://www.federalreserve.gov' }
      ],
    },
    {
      heading: 'Other Major Central Banks',
      body: `European Central Bank (ECB):
• Controls euro interest rates
• Affects European stocks and bonds
• Influences EUR/AUD

Bank of Japan (BoJ):
• Known for ultra-low rates
• Major player in currency markets
• Affects Japanese tech exports

People's Bank of China (PBoC):
• Massive influence on commodity prices
• Critical for Australian miners
• Controls yuan exchange rate`,
      type: 'callout',
    },
    {
      heading: 'Investment Banks: The Deal Makers',
      body: 'Investment banks facilitate massive transactions and provide liquidity to markets.',
      type: 'text',
    },
    {
      heading: 'What Investment Banks Do',
      body: `Core Services:
• Underwriting IPOs and bond offerings
• Mergers and acquisitions advisory
• Trading (stocks, bonds, derivatives, commodities)
• Market making (providing liquidity)
• Research and analysis

Major Global Players:
• Goldman Sachs - Premier Wall Street bank
• Morgan Stanley - Wealth management giant
• JP Morgan Chase - Largest US bank
• Bank of America Merrill Lynch
• Citigroup

Australian Players:
• Macquarie Group - Australia's leading investment bank
• UBS Australia
• Deutsche Bank Australia`,
      type: 'list',
      relatedTerms: ['ipo', 'market-maker'],
    },
    {
      heading: 'How They Impact Markets',
      body: `• IPO Underwriting: They price and launch new stocks
• Research Reports: Analyst upgrades/downgrades move stock prices
• Proprietary Trading: Large positions can move markets
• Dark Pools: Private exchanges for institutional trades
• Derivatives Creation: Design complex financial products`,
      type: 'list',
    },
    {
      heading: 'Institutional Investors: The Whale Traders',
      body: 'Institutions manage trillions of dollars and their trades create market trends.',
      type: 'text',
    },
    {
      heading: 'Pension Funds',
      body: `Examples: Australian Super, AustralianSuper, Hostplus

Characteristics:
• Manage retirement savings for millions
• Long-term investment horizon (30+ years)
• Must maintain stable, predictable returns
• Heavily regulated for safety
• Invest across all asset classes

Typical Allocation:
• 50-60% Equities (stocks)
• 25-35% Fixed Income (bonds)
• 10-15% Alternative assets
• 5-10% Cash

Impact: When pension funds rebalance, they move billions, creating price movements across entire sectors.`,
      type: 'callout',
      relatedTerms: ['asset-allocation', 'diversification'],
    },
    {
      heading: 'Mutual Funds',
      body: `Examples: Vanguard, Fidelity, T. Rowe Price

Characteristics:
• Professionally managed investment pools
• Thousands of retail investors combined
• Active or passive management
• Daily liquidity (can buy/sell any day)
• Transparent holdings

Types:
• Index Funds: Track market indices (S&P 500, ASX 200)
• Sector Funds: Focus on specific industries
• Balanced Funds: Mix of stocks and bonds
• International Funds: Global diversification`,
      type: 'callout',
      relatedTerms: ['mutual-fund', 'index'],
    },
    {
      heading: 'The Giants: BlackRock and Vanguard',
      body: `BlackRock:
• World's largest asset manager
• Manages over $10 trillion AUD
• Major shareholder in most public companies
• Creator of iShares ETFs
• Significant voting power in corporate decisions

Vanguard:
• Second-largest asset manager
• Pioneered low-cost index investing
• Manages over $8 trillion AUD
• Known for ETFs and index funds
• Client-owned structure (unique)

Their Influence:
• Together own 5-8% of most ASX 200 companies
• Vote on corporate boards
• Push for ESG (environmental/social) policies
• Can single-handedly move stock prices`,
      type: 'callout',
      relatedTerms: ['institutional-investor', 'etf'],
    },
    {
      heading: 'Hedge Funds: The Risk Takers',
      body: 'Hedge funds use sophisticated strategies to generate returns regardless of market direction.',
      type: 'text',
    },
    {
      heading: 'How Hedge Funds Operate',
      body: `Characteristics:
• Wealthy investors and institutions only
• High fees (2% management + 20% performance fee)
• Use leverage to amplify returns
• Can short stocks and use derivatives
• Less regulated than mutual funds

Common Strategies:
• Long/Short Equity: Buy undervalued, short overvalued
• Global Macro: Bet on economic trends
• Event-Driven: Profit from M&A, bankruptcies
• Arbitrage: Exploit price differences
• Quantitative: Computer-driven trading`,
      type: 'list',
      relatedTerms: ['leverage', 'short-selling'],
    },
    {
      heading: 'Famous Hedge Funds and Managers',
      body: `Bridgewater Associates (Ray Dalio):
• World's largest hedge fund
• Famous for "All Weather" strategy
• Pure Alpha fund

Renaissance Technologies (Jim Simons):
• Quantitative/mathematical approach
• Medallion Fund: Best returns in history
• Uses algorithms and AI

Citadel (Ken Griffin):
• Multi-strategy hedge fund
• Heavy use of technology
• Market making operations

Historical Legends:
• George Soros: "Broke the Bank of England"
• Stanley Druckenmiller: Macro investing master
• Paul Tudor Jones: Predicted 1987 crash`,
      type: 'callout',
    },
    {
      heading: 'Sovereign Wealth Funds: Nation-State Investors',
      body: `Examples:
• Norway Government Pension Fund: $1.4 trillion
• China Investment Corporation: $1.2 trillion
• Abu Dhabi Investment Authority: $700 billion
• Future Fund (Australia): $230 billion AUD

Purpose:
• Invest national resource revenues (oil, gas, minerals)
• Save for future generations
• Stabilize national economies

Impact on Markets:
• Extremely long-term focus (50+ years)
• Can take large positions in companies
• Often invest in infrastructure
• Political implications of investments`,
      type: 'callout',
    },
    {
      heading: 'Retail Brokers: Democratizing Investing',
      body: 'Modern platforms have given individual investors unprecedented access to markets.',
      type: 'text',
    },
    {
      heading: 'Australian Brokers',
      body: `CommSec (Commonwealth Bank):
• Australia's #1 retail broker
• Full-service platform
• Research and education tools
• Higher fees but comprehensive

SelfWealth:
• Flat-fee trading
• Social trading features
• Lower cost alternative

Stake:
• US market specialist
• Fractional shares
• No minimum investment

CMC Markets:
• Advanced trading platform
• CFDs and derivatives
• Professional-grade tools`,
      type: 'list',
      relatedTerms: ['broker', 'retail-investor'],
    },
    {
      heading: 'The Robinhood Effect',
      body: `Recent Changes in Retail Trading:
• Commission-free trading became standard
• Fractional shares allow small investments
• Mobile apps make trading accessible
• Social media drives retail trading
• "Meme stocks" phenomenon (GameStop, AMC)

Impact on Markets:
• Retail trading volume has doubled
• Short squeezes more common
• Greater market volatility
• Options trading by retail surged
• Markets more democratic than ever`,
      type: 'callout',
    },
    {
      heading: 'Rating Agencies: The Scorekeepers',
      body: `The Big Three:
• Standard & Poor's (S&P)
• Moody's
• Fitch Ratings

What They Do:
• Rate creditworthiness of bonds
• Assess default risk
• Influence borrowing costs
• AAA = safest, D = default

Impact:
• Downgrades can crash bond prices
• Upgrades lower borrowing costs
• Required by regulations
• Controversial role in 2008 crisis`,
      type: 'callout',
    },
    {
      heading: 'Key Takeaways',
      body: `1. Central banks control interest rates - the single most powerful market force
2. Investment banks facilitate massive transactions and provide market liquidity
3. Institutional investors (pensions, mutual funds) manage trillions and create long-term trends
4. Hedge funds take concentrated, high-risk bets and can profit in any market
5. Retail investors are more powerful than ever thanks to technology
6. Understanding who's buying and selling helps you time your trades
7. Follow the smart money - institutions research more than individuals can`,
      type: 'list',
    },
  ],
}
