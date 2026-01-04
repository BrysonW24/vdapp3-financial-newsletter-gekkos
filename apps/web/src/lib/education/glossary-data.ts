import { GlossaryTerm } from './types'

export const glossaryTerms: GlossaryTerm[] = [
  // MARKET TERMS
  {
    id: 'asx',
    term: 'ASX (Australian Securities Exchange)',
    definition: 'Australia\'s primary securities exchange where stocks, bonds, and other financial instruments are traded. The ASX 200 is the benchmark index tracking the top 200 companies.',
    category: 'market',
    relatedTerms: ['index', 'stock-exchange', 'asx-200'],
    example: 'The ASX 200 rose 1.2% today, indicating positive investor sentiment in Australian equities.',
    externalLinks: [
      { text: 'ASX Official', url: 'https://www.asx.com.au' }
    ],
  },
  {
    id: 'bull-market',
    term: 'Bull Market',
    definition: 'A market condition characterized by rising prices and investor optimism. Typically defined as a 20% or more increase from recent lows.',
    category: 'market',
    relatedTerms: ['bear-market', 'market-cycle'],
    example: 'The stock market entered a bull market phase in 2023 after recovering from the previous year\'s downturn.',
  },
  {
    id: 'bear-market',
    term: 'Bear Market',
    definition: 'A market condition characterized by falling prices and investor pessimism. Typically defined as a 20% or more decline from recent highs.',
    category: 'market',
    relatedTerms: ['bull-market', 'market-cycle', 'correction'],
    example: 'During the 2022 bear market, many investors shifted to defensive stocks and bonds.',
  },
  {
    id: 'market-cap',
    term: 'Market Capitalization',
    definition: 'The total market value of a company\'s outstanding shares, calculated by multiplying share price by total number of shares. Used to categorize companies as large-cap, mid-cap, or small-cap.',
    category: 'market',
    relatedTerms: ['shares', 'large-cap', 'mid-cap', 'small-cap'],
    example: 'CBA has a market cap of approximately $180 billion, making it one of Australia\'s largest companies.',
    liveDataExample: true,
  },
  {
    id: 'liquidity',
    term: 'Liquidity',
    definition: 'The ease with which an asset can be bought or sold in the market without affecting its price. High liquidity means you can trade quickly at stable prices.',
    category: 'market',
    relatedTerms: ['volume', 'bid-ask-spread'],
    example: 'Major ASX stocks like BHP have high liquidity, while small-cap stocks may have lower liquidity.',
  },
  {
    id: 'volume',
    term: 'Trading Volume',
    definition: 'The number of shares or contracts traded in a security or market during a given period. High volume often indicates strong interest.',
    category: 'market',
    relatedTerms: ['liquidity', 'market-depth'],
    example: 'Today\'s trading volume on the ASX was above average, suggesting increased market activity.',
    liveDataExample: true,
  },
  {
    id: 'index',
    term: 'Stock Index',
    definition: 'A measurement of a section of the stock market, calculated from the prices of selected stocks. Examples include ASX 200, S&P 500, and NASDAQ.',
    category: 'market',
    relatedTerms: ['asx', 'sp500', 'nasdaq'],
    example: 'The S&P 500 index tracks 500 of the largest US companies and is widely used as a market benchmark.',
  },
  {
    id: 'volatility',
    term: 'Volatility',
    definition: 'The degree of variation in a trading price over time. Higher volatility means larger price swings, indicating greater risk.',
    category: 'market',
    relatedTerms: ['vix', 'beta', 'risk'],
    example: 'Crypto markets typically have higher volatility than traditional stock markets.',
  },
  {
    id: 'bid-ask-spread',
    term: 'Bid-Ask Spread',
    definition: 'The difference between the highest price a buyer is willing to pay (bid) and the lowest price a seller will accept (ask). Tighter spreads indicate better liquidity.',
    category: 'market',
    relatedTerms: ['liquidity', 'market-maker'],
    example: 'Large-cap stocks typically have tight bid-ask spreads of a few cents.',
  },

  // ECONOMIC INDICATORS
  {
    id: 'cash-rate',
    term: 'Cash Rate',
    definition: 'The interest rate on overnight loans between financial institutions, set by the Reserve Bank of Australia. It\'s the RBA\'s primary tool for implementing monetary policy.',
    category: 'indicator',
    relatedTerms: ['rba', 'monetary-policy', 'interest-rates'],
    example: 'When the RBA raises the cash rate from 4.10% to 4.35%, it makes borrowing more expensive to slow inflation.',
    externalLinks: [
      { text: 'RBA Cash Rate', url: 'https://www.rba.gov.au/statistics/cash-rate/' }
    ],
    liveDataExample: true,
  },
  {
    id: 'cpi',
    term: 'CPI (Consumer Price Index)',
    definition: 'A measure of the average change in prices paid by consumers for goods and services over time. The primary indicator of inflation.',
    category: 'indicator',
    relatedTerms: ['inflation', 'purchasing-power'],
    example: 'If CPI increases by 3% annually, the same goods that cost $100 last year now cost $103.',
    externalLinks: [
      { text: 'ABS CPI Data', url: 'https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation' }
    ],
    liveDataExample: true,
  },
  {
    id: 'gdp',
    term: 'GDP (Gross Domestic Product)',
    definition: 'The total monetary value of all finished goods and services produced within a country during a specific period. Key measure of economic health.',
    category: 'indicator',
    relatedTerms: ['economic-growth', 'recession'],
    example: 'Australia\'s GDP grew by 2.1% in 2023, indicating moderate economic expansion.',
    externalLinks: [
      { text: 'ABS GDP Statistics', url: 'https://www.abs.gov.au/statistics/economy/national-accounts' }
    ],
  },
  {
    id: 'unemployment-rate',
    term: 'Unemployment Rate',
    definition: 'The percentage of the labor force that is unemployed and actively seeking employment. A key indicator of economic health.',
    category: 'indicator',
    relatedTerms: ['labor-market', 'employment'],
    example: 'An unemployment rate of 3.5% is considered near full employment in Australia.',
    liveDataExample: true,
  },
  {
    id: 'inflation',
    term: 'Inflation',
    definition: 'The rate at which the general level of prices for goods and services rises, eroding purchasing power. Measured by CPI.',
    category: 'indicator',
    relatedTerms: ['cpi', 'purchasing-power', 'cash-rate'],
    example: 'High inflation of 7% means your money buys 7% less than it did a year ago.',
  },
  {
    id: 'pmi',
    term: 'PMI (Purchasing Managers\' Index)',
    definition: 'A leading indicator of economic health based on surveys of purchasing managers. Above 50 indicates expansion, below 50 indicates contraction.',
    category: 'indicator',
    relatedTerms: ['leading-indicator', 'manufacturing'],
    example: 'A PMI reading of 52 suggests the manufacturing sector is growing.',
  },
  {
    id: 'yield-curve',
    term: 'Yield Curve',
    definition: 'A graph showing the relationship between interest rates and bonds of different maturities. An inverted yield curve (short-term rates higher than long-term) often predicts recession.',
    category: 'indicator',
    relatedTerms: ['bonds', 'interest-rates', 'recession'],
    example: 'The yield curve inverted in early 2022, preceding economic uncertainty.',
  },

  // INVESTMENT INSTRUMENTS
  {
    id: 'stock',
    term: 'Stock (Share)',
    definition: 'A unit of ownership in a company. Stockholders own a portion of the company and may receive dividends and voting rights.',
    category: 'instrument',
    relatedTerms: ['dividend', 'equity', 'shareholder'],
    example: 'If you own 100 BHP shares, you own a tiny fraction of the mining company.',
  },
  {
    id: 'bond',
    term: 'Bond',
    definition: 'A debt instrument where an investor loans money to an entity (government or corporation) for a defined period at a fixed interest rate.',
    category: 'instrument',
    relatedTerms: ['yield', 'coupon', 'fixed-income'],
    example: 'A 10-year Australian government bond pays regular interest and returns principal at maturity.',
  },
  {
    id: 'etf',
    term: 'ETF (Exchange-Traded Fund)',
    definition: 'A basket of securities that trades on an exchange like a stock. ETFs can track indices, sectors, commodities, or other assets.',
    category: 'instrument',
    relatedTerms: ['index-fund', 'diversification'],
    example: 'VAS is an ETF that tracks the ASX 300, giving you exposure to 300 Australian companies in one trade.',
  },
  {
    id: 'mutual-fund',
    term: 'Mutual Fund',
    definition: 'A pool of money from multiple investors that is professionally managed and invested in stocks, bonds, or other securities.',
    category: 'instrument',
    relatedTerms: ['managed-fund', 'unit-trust'],
    example: 'A balanced mutual fund might invest 60% in stocks and 40% in bonds.',
  },
  {
    id: 'derivative',
    term: 'Derivative',
    definition: 'A financial contract whose value is derived from an underlying asset, such as stocks, bonds, commodities, or currencies. Includes options and futures.',
    category: 'instrument',
    relatedTerms: ['options', 'futures', 'leverage'],
    example: 'Call options give the right to buy a stock at a specific price before expiration.',
  },
  {
    id: 'reit',
    term: 'REIT (Real Estate Investment Trust)',
    definition: 'A company that owns, operates, or finances income-producing real estate. REITs trade like stocks and must distribute most income as dividends.',
    category: 'instrument',
    relatedTerms: ['dividend', 'real-estate', 'income'],
    example: 'Australian REITs like Scentre Group own shopping centers and pay regular dividends.',
  },

  // FUNDAMENTAL ANALYSIS
  {
    id: 'pe-ratio',
    term: 'P/E Ratio (Price-to-Earnings)',
    definition: 'A valuation metric calculated by dividing the stock price by earnings per share. Indicates how much investors pay for each dollar of earnings.',
    category: 'strategy',
    relatedTerms: ['eps', 'valuation', 'fundamental-analysis'],
    example: 'A P/E ratio of 20 means investors pay $20 for every $1 of annual earnings.',
    liveDataExample: true,
  },
  {
    id: 'eps',
    term: 'EPS (Earnings Per Share)',
    definition: 'A company\'s profit divided by the number of outstanding shares. Key metric for evaluating profitability.',
    category: 'strategy',
    relatedTerms: ['pe-ratio', 'profit', 'revenue'],
    example: 'If a company earns $10 million and has 1 million shares, EPS is $10.',
    liveDataExample: true,
  },
  {
    id: 'dividend',
    term: 'Dividend',
    definition: 'A portion of a company\'s earnings distributed to shareholders, usually paid quarterly or semi-annually.',
    category: 'instrument',
    relatedTerms: ['dividend-yield', 'payout-ratio', 'income-investing'],
    example: 'CBA pays dividends twice a year, providing income to shareholders.',
    liveDataExample: true,
  },
  {
    id: 'dividend-yield',
    term: 'Dividend Yield',
    definition: 'Annual dividends per share divided by the stock price, expressed as a percentage. Shows income return on investment.',
    category: 'strategy',
    relatedTerms: ['dividend', 'income-investing'],
    example: 'A stock trading at $100 paying $4 annual dividends has a 4% dividend yield.',
    liveDataExample: true,
  },
  {
    id: 'roe',
    term: 'ROE (Return on Equity)',
    definition: 'A measure of profitability calculated by dividing net income by shareholder equity. Indicates how efficiently a company uses shareholder capital.',
    category: 'strategy',
    relatedTerms: ['profitability', 'fundamental-analysis'],
    example: 'An ROE of 15% means the company generates $0.15 profit for every dollar of equity.',
  },
  {
    id: 'debt-to-equity',
    term: 'Debt-to-Equity Ratio',
    definition: 'A measure of financial leverage calculated by dividing total debt by total equity. Higher ratios indicate more debt financing.',
    category: 'strategy',
    relatedTerms: ['leverage', 'balance-sheet', 'risk'],
    example: 'A debt-to-equity ratio of 0.5 means the company has $0.50 of debt for every $1 of equity.',
  },
  {
    id: 'book-value',
    term: 'Book Value',
    definition: 'The net asset value of a company calculated as total assets minus intangible assets and liabilities. Used in P/B ratio.',
    category: 'strategy',
    relatedTerms: ['pb-ratio', 'balance-sheet'],
    example: 'If a company has $100M in assets and $40M in liabilities, book value is $60M.',
  },
  {
    id: 'pb-ratio',
    term: 'P/B Ratio (Price-to-Book)',
    definition: 'A valuation metric comparing a stock\'s market value to its book value. Useful for valuing asset-heavy companies.',
    category: 'strategy',
    relatedTerms: ['book-value', 'valuation'],
    example: 'A P/B ratio of 1.5 means investors pay $1.50 for every $1 of book value.',
  },

  // INVESTMENT STRATEGIES
  {
    id: 'value-investing',
    term: 'Value Investing',
    definition: 'An investment strategy of buying stocks trading below their intrinsic value. Popularized by Benjamin Graham and Warren Buffett.',
    category: 'strategy',
    relatedTerms: ['fundamental-analysis', 'margin-of-safety'],
    example: 'Value investors look for stocks with low P/E ratios and strong fundamentals.',
  },
  {
    id: 'growth-investing',
    term: 'Growth Investing',
    definition: 'An investment strategy focusing on companies expected to grow earnings faster than the market average, even if shares appear expensive.',
    category: 'strategy',
    relatedTerms: ['pe-ratio', 'revenue-growth'],
    example: 'Technology companies often attract growth investors due to high revenue growth rates.',
  },
  {
    id: 'dividend-investing',
    term: 'Dividend Investing',
    definition: 'A strategy focused on buying stocks that pay regular dividends, providing steady income alongside potential capital gains.',
    category: 'strategy',
    relatedTerms: ['dividend', 'dividend-yield', 'income'],
    example: 'Australian bank stocks are popular with dividend investors due to high yields.',
  },
  {
    id: 'dollar-cost-averaging',
    term: 'Dollar-Cost Averaging (DCA)',
    definition: 'An investment strategy of regularly investing a fixed amount regardless of price, reducing the impact of volatility.',
    category: 'strategy',
    relatedTerms: ['risk-management', 'volatility'],
    example: 'Investing $1000 monthly into an index fund uses dollar-cost averaging.',
  },
  {
    id: 'diversification',
    term: 'Diversification',
    definition: 'The practice of spreading investments across different assets, sectors, or regions to reduce risk.',
    category: 'strategy',
    relatedTerms: ['risk-management', 'portfolio', 'asset-allocation'],
    example: 'A diversified portfolio might include Australian stocks, international stocks, bonds, and property.',
  },
  {
    id: 'asset-allocation',
    term: 'Asset Allocation',
    definition: 'The process of dividing investments among different asset categories such as stocks, bonds, and cash based on risk tolerance and goals.',
    category: 'strategy',
    relatedTerms: ['diversification', 'portfolio', 'risk'],
    example: 'A common allocation is 60% stocks, 30% bonds, and 10% cash.',
  },
  {
    id: 'rebalancing',
    term: 'Portfolio Rebalancing',
    definition: 'The process of realigning portfolio weightings by buying or selling assets to maintain desired asset allocation.',
    category: 'strategy',
    relatedTerms: ['asset-allocation', 'portfolio'],
    example: 'If stocks outperform and become 70% of your portfolio instead of 60%, rebalancing sells stocks to return to target.',
  },

  // RISK & TRADING
  {
    id: 'beta',
    term: 'Beta',
    definition: 'A measure of a stock\'s volatility relative to the overall market. A beta of 1 moves with the market, >1 is more volatile, <1 is less volatile.',
    category: 'strategy',
    relatedTerms: ['volatility', 'risk', 'systematic-risk'],
    example: 'A stock with beta of 1.5 typically moves 50% more than the market.',
  },
  {
    id: 'stop-loss',
    term: 'Stop-Loss Order',
    definition: 'An order to sell a security when it reaches a specific price, limiting potential losses on a position.',
    category: 'strategy',
    relatedTerms: ['risk-management', 'limit-order'],
    example: 'Setting a stop-loss at 10% below purchase price limits maximum loss to 10%.',
  },
  {
    id: 'limit-order',
    term: 'Limit Order',
    definition: 'An order to buy or sell a security at a specific price or better. Only executes if the market reaches that price.',
    category: 'strategy',
    relatedTerms: ['market-order', 'stop-loss'],
    example: 'A limit buy order at $50 only executes if the stock trades at $50 or lower.',
  },
  {
    id: 'market-order',
    term: 'Market Order',
    definition: 'An order to buy or sell immediately at the current market price. Guarantees execution but not price.',
    category: 'strategy',
    relatedTerms: ['limit-order'],
    example: 'A market order to buy 100 shares executes immediately at whatever price sellers are offering.',
  },
  {
    id: 'short-selling',
    term: 'Short Selling',
    definition: 'Borrowing shares to sell them, hoping to buy them back later at a lower price and profit from the difference.',
    category: 'strategy',
    relatedTerms: ['leverage', 'bear-market'],
    example: 'Short sellers profit when stock prices fall but face unlimited potential losses.',
  },
  {
    id: 'leverage',
    term: 'Leverage',
    definition: 'Using borrowed money to increase the potential return of an investment. Amplifies both gains and losses.',
    category: 'strategy',
    relatedTerms: ['margin', 'risk'],
    example: 'With 2x leverage, a 10% gain becomes 20%, but a 10% loss becomes 20%.',
  },
  {
    id: 'margin',
    term: 'Margin',
    definition: 'Borrowing money from a broker to purchase securities. Requires maintaining minimum equity in the account.',
    category: 'strategy',
    relatedTerms: ['leverage', 'margin-call'],
    example: 'Buying $10,000 worth of stock with $5,000 cash and $5,000 margin is 2x leverage.',
  },

  // GENERAL FINANCIAL TERMS
  {
    id: 'compound-interest',
    term: 'Compound Interest',
    definition: 'Interest calculated on both the initial principal and accumulated interest from previous periods. Often called "interest on interest".',
    category: 'general',
    relatedTerms: ['time-value-of-money', 'investing'],
    example: '$10,000 at 8% annual compound interest grows to $21,589 in 10 years.',
  },
  {
    id: 'capital-gains',
    term: 'Capital Gains',
    definition: 'The profit from selling an asset for more than its purchase price. Subject to capital gains tax.',
    category: 'general',
    relatedTerms: ['cost-basis', 'taxation'],
    example: 'Buying a stock at $50 and selling at $70 results in $20 capital gains per share.',
  },
  {
    id: 'broker',
    term: 'Broker',
    definition: 'An individual or firm that acts as an intermediary between investors and securities exchanges.',
    category: 'general',
    relatedTerms: ['brokerage-account', 'trading'],
    example: 'CommSec and NAB Trade are popular brokers for Australian investors.',
  },
  {
    id: 'portfolio',
    term: 'Portfolio',
    definition: 'A collection of financial investments like stocks, bonds, commodities, cash, and cash equivalents.',
    category: 'general',
    relatedTerms: ['asset-allocation', 'diversification'],
    example: 'A balanced portfolio might include 20 different stocks across various sectors.',
  },
  {
    id: 'benchmark',
    term: 'Benchmark',
    definition: 'A standard against which investment performance is measured. Often an index like the ASX 200 or S&P 500.',
    category: 'general',
    relatedTerms: ['index', 'performance'],
    example: 'If your portfolio returns 12% while the ASX 200 returns 8%, you outperformed the benchmark by 4%.',
  },
  {
    id: 'blue-chip',
    term: 'Blue Chip Stock',
    definition: 'Shares of large, well-established, financially sound companies with a history of reliable performance.',
    category: 'general',
    relatedTerms: ['large-cap', 'dividend'],
    example: 'The Big 4 Australian banks (CBA, NAB, ANZ, Westpac) are considered blue chip stocks.',
  },
  {
    id: 'ipo',
    term: 'IPO (Initial Public Offering)',
    definition: 'The first sale of stock by a company to the public, transitioning from private to publicly traded.',
    category: 'general',
    relatedTerms: ['listing', 'equity'],
    example: 'When a startup goes public through an IPO, early investors can sell shares to public investors.',
  },
  {
    id: 'franking-credits',
    term: 'Franking Credits',
    definition: 'A uniquely Australian tax benefit where dividends come with a tax credit for company tax already paid, reducing double taxation.',
    category: 'general',
    relatedTerms: ['dividend', 'taxation'],
    example: 'Fully franked dividends from Australian companies come with a 30% tax credit.',
    externalLinks: [
      { text: 'ATO Franking Credits', url: 'https://www.ato.gov.au/individuals-and-families/investments-and-assets/dividends/franking-credits' }
    ],
  },

  // MARKET PARTICIPANTS
  {
    id: 'rba',
    term: 'RBA (Reserve Bank of Australia)',
    definition: 'Australia\'s central bank responsible for monetary policy, financial system stability, and issuing currency.',
    category: 'general',
    relatedTerms: ['cash-rate', 'monetary-policy'],
    example: 'The RBA meets monthly to decide whether to adjust the cash rate.',
    externalLinks: [
      { text: 'RBA Official', url: 'https://www.rba.gov.au' }
    ],
  },
  {
    id: 'fed',
    term: 'Federal Reserve (The Fed)',
    definition: 'The central banking system of the United States, responsible for monetary policy and financial stability.',
    category: 'general',
    relatedTerms: ['federal-funds-rate', 'monetary-policy'],
    example: 'Fed decisions on interest rates significantly impact global markets.',
    externalLinks: [
      { text: 'Federal Reserve', url: 'https://www.federalreserve.gov' }
    ],
  },
  {
    id: 'institutional-investor',
    term: 'Institutional Investor',
    definition: 'Organizations that invest large sums of money on behalf of others, such as pension funds, mutual funds, and insurance companies.',
    category: 'general',
    relatedTerms: ['retail-investor', 'fund-manager'],
    example: 'BlackRock and Vanguard are major institutional investors managing trillions in assets.',
  },
  {
    id: 'retail-investor',
    term: 'Retail Investor',
    definition: 'Individual investors who buy and sell securities for their personal account, not for an organization.',
    category: 'general',
    relatedTerms: ['institutional-investor', 'broker'],
    example: 'You are a retail investor when you buy stocks through your CommSec account.',
  },

  // CRYPTOCURRENCY & MODERN FINANCE
  {
    id: 'cryptocurrency',
    term: 'Cryptocurrency',
    definition: 'A digital or virtual currency secured by cryptography, operating on decentralized blockchain networks.',
    category: 'instrument',
    relatedTerms: ['bitcoin', 'blockchain'],
    example: 'Bitcoin and Ethereum are the two largest cryptocurrencies by market capitalization.',
  },
  {
    id: 'blockchain',
    term: 'Blockchain',
    definition: 'A distributed ledger technology that records transactions across multiple computers, ensuring transparency and security.',
    category: 'general',
    relatedTerms: ['cryptocurrency', 'bitcoin'],
    example: 'Bitcoin transactions are recorded on a public blockchain that anyone can verify.',
  },
  {
    id: 'esg',
    term: 'ESG (Environmental, Social, Governance)',
    definition: 'A set of criteria used to evaluate companies based on their environmental impact, social responsibility, and governance practices.',
    category: 'strategy',
    relatedTerms: ['sustainable-investing', 'ethical-investing'],
    example: 'ESG-focused funds avoid companies with poor environmental records or governance issues.',
  },

  // ADDITIONAL IMPORTANT TERMS
  {
    id: 'recession',
    term: 'Recession',
    definition: 'A significant decline in economic activity lasting more than a few months, typically defined as two consecutive quarters of negative GDP growth.',
    category: 'indicator',
    relatedTerms: ['gdp', 'economic-cycle'],
    example: 'The COVID-19 pandemic triggered a brief but severe recession in 2020.',
  },
  {
    id: 'correction',
    term: 'Market Correction',
    definition: 'A decline of 10% or more in a stock, index, or market from its recent peak. Less severe than a bear market.',
    category: 'market',
    relatedTerms: ['bear-market', 'volatility'],
    example: 'A market correction is normal and healthy, occurring roughly once per year on average.',
  },
  {
    id: 'market-maker',
    term: 'Market Maker',
    definition: 'A firm or individual that provides liquidity by continuously buying and selling securities at quoted prices.',
    category: 'general',
    relatedTerms: ['liquidity', 'bid-ask-spread'],
    example: 'Market makers profit from the bid-ask spread while providing liquidity to markets.',
  },
  {
    id: 'vix',
    term: 'VIX (Volatility Index)',
    definition: 'A measure of expected market volatility based on S&P 500 options prices, often called the "fear gauge".',
    category: 'indicator',
    relatedTerms: ['volatility', 'options'],
    example: 'A VIX above 30 indicates high expected volatility and market uncertainty.',
    liveDataExample: true,
  },
  {
    id: 'earnings-season',
    term: 'Earnings Season',
    definition: 'The period when most publicly traded companies release their quarterly earnings reports, occurring four times per year.',
    category: 'general',
    relatedTerms: ['eps', 'financial-results'],
    example: 'Stock prices often become more volatile during earnings season as companies report results.',
  },
]

export function searchGlossary(query: string, category?: string): GlossaryTerm[] {
  const lowerQuery = query.toLowerCase()

  let filtered = glossaryTerms.filter(term =>
    term.term.toLowerCase().includes(lowerQuery) ||
    term.definition.toLowerCase().includes(lowerQuery) ||
    term.relatedTerms.some(rt => rt.toLowerCase().includes(lowerQuery))
  )

  if (category && category !== 'all') {
    filtered = filtered.filter(term => term.category === category)
  }

  return filtered
}

export function getTermById(id: string): GlossaryTerm | undefined {
  return glossaryTerms.find(term => term.id === id)
}

export function getTermsByCategory(category: string): GlossaryTerm[] {
  return glossaryTerms.filter(term => term.category === category)
}

export function getRelatedTerms(termId: string): GlossaryTerm[] {
  const term = getTermById(termId)
  if (!term) return []

  return term.relatedTerms
    .map(id => getTermById(id))
    .filter(Boolean) as GlossaryTerm[]
}
