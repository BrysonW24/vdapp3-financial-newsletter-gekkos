import { EducationSection } from './types'

export const indicatorsContent: EducationSection = {
  id: 'indicators',
  title: 'Economic Indicators',
  icon: '📊',
  description: 'Master leading, coincident, and lagging indicators. Understand how upstream factors impact downstream outcomes',
  content: [
    {
      heading: 'Reading the Economy\'s Vital Signs',
      body: 'Economic indicators are like the vital signs of an economy - temperature, blood pressure, heart rate. By monitoring these metrics, you can predict where markets are heading before the move happens.',
      type: 'text',
    },
    {
      heading: 'Three Types of Indicators',
      body: 'Indicators are classified by their timing relative to the economic cycle:',
      type: 'text',
    },
    {
      heading: 'Leading Indicators - The Crystal Ball',
      body: `Change BEFORE the economy changes
• Signal what's coming in 3-12 months
• Most valuable for investors
• Help you position ahead of trends

Key Leading Indicators:
• PMI (Purchasing Managers' Index)
• Consumer Confidence
• Building Approvals
• Stock Market Performance
• Yield Curve Shape

Why They Matter: If PMI falls below 50, expect GDP to decline within 6 months. This gives you time to reduce stock exposure and increase bonds.`,
      type: 'callout',
      relatedTerms: ['pmi', 'yield-curve'],
    },
    {
      heading: 'Coincident Indicators - The Here and Now',
      body: `Change WITH the economy in real-time
• Confirm current economic state
• Validate what leading indicators predicted
• Help avoid false signals

Key Coincident Indicators:
• GDP (Gross Domestic Product)
• Employment Levels
• Retail Sales
• Industrial Production
• Personal Income

Why They Matter: GDP growth confirms we're in expansion. If GDP rises while PMI is falling, trust the leading indicator - trouble ahead.`,
      type: 'callout',
      relatedTerms: ['gdp', 'unemployment-rate'],
    },
    {
      heading: 'Lagging Indicators - The Rearview Mirror',
      body: `Change AFTER the economy has already changed
• Confirm trends are real, not noise
• Show how long trends will persist
• Used by central banks for policy

Key Lagging Indicators:
• CPI (Inflation)
• Corporate Profits
• Average Duration of Unemployment
• Business Spending on Equipment

Why They Matter: Rising CPI 6 months after GDP peaked confirms inflation is sticky. Central banks will keep rates high, keeping pressure on stocks.`,
      type: 'callout',
      relatedTerms: ['cpi', 'inflation'],
    },
    {
      heading: 'PMI (Purchasing Managers\' Index) - The Best Leading Indicator',
      body: `What It Is:
Monthly survey of purchasing managers asking: "Is business getting better or worse?"

How to Read It:
• Above 50 = Expansion (good)
• Below 50 = Contraction (bad)
• Above 55 = Strong growth
• Below 45 = Serious contraction

Types:
• Manufacturing PMI (goods production)
• Services PMI (service sector)
• Composite PMI (combination)

Why It's Powerful:
• Released early in the month
• Predicts GDP with high accuracy
• Purchasing managers know before CEOs
• Works globally (every country tracks PMI)

Australian Context:
• AiGroup releases monthly
• China PMI heavily affects Aus (our biggest customer)
• Services PMI matters more (70% of economy)`,
      type: 'callout',
      relatedTerms: ['pmi'],
      externalLinks: [
        { text: 'AiGroup PMI', url: 'https://www.aigroup.com.au' }
      ],
    },
    {
      heading: 'Cash Rate - The RBA\'s Main Tool',
      body: `What It Is:
Interest rate on overnight loans between banks, controlled by the RBA

How It Works:
When RBA RAISES rates:
• Borrowing becomes more expensive
• Spending slows down
• Inflation decreases
• Housing market cools
• AUD strengthens
• Bank stocks benefit (higher margins)
• Growth stocks suffer (higher discount rates)

When RBA CUTS rates:
• Borrowing becomes cheaper
• Spending increases
• Inflation rises
• Housing market heats up
• AUD weakens
• Growth stocks benefit
• Bank margins compress

Current Cycle:
Check the RBA website for latest rate and future expectations. Markets price in rate changes 6-12 months ahead.`,
      type: 'callout',
      relatedTerms: ['cash-rate', 'rba'],
      externalLinks: [
        { text: 'RBA Cash Rate History', url: 'https://www.rba.gov.au/statistics/cash-rate/' }
      ],
    },
    {
      heading: 'Consumer Price Index (CPI) - Inflation\'s Scorecard',
      body: `What It Measures:
Price changes in a basket of goods and services

Components:
• Food and beverages (16%)
• Housing (23%)
• Transport (11%)
• Health (6%)
• Education (5%)
• Other categories

How to Interpret:
• 2-3% = RBA target (healthy)
• Above 3% = RBA considers rate hikes
• Above 5% = Emergency, aggressive hikes
• Below 2% = Risk of deflation, potential rate cuts

Impact on Investments:
High Inflation (>3%):
• Bonds lose value (fixed payments worth less)
• Growth stocks decline (future profits discounted more)
• Commodities rise (gold, oil)
• Real estate can benefit (rents rise)

Low Inflation (<2%):
• Bonds perform well
• Growth stocks thrive
• Commodities struggle`,
      type: 'callout',
      relatedTerms: ['cpi', 'inflation'],
      externalLinks: [
        { text: 'ABS CPI Data', url: 'https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation' }
      ],
    },
    {
      heading: 'Unemployment Rate - Labor Market Health',
      body: `What It Measures:
Percentage of workforce actively seeking jobs but unable to find them

Australian Context:
• Full employment: ~4-4.5%
• Current rate: Check ABS monthly release
• RBA watches closely for wage pressure

The Employment Cycle:
Expansion Phase:
• Unemployment falls
• Wages rise
• Consumer spending increases
• Companies hire more
• Stock market rises

Peak Phase:
• Unemployment at cycle low (3.5-4%)
• Wage growth accelerates
• Labor shortages emerge
• Inflation pressures build

Contraction Phase:
• Unemployment starts rising
• Wage growth slows
• Spending decreases
• Companies lay off workers
• Stock market falls

Investment Implications:
Low Unemployment (<4%):
• Consumer discretionary stocks benefit
• Retailers perform well
• Wage inflation risk increases
• RBA may raise rates

High Unemployment (>6%):
• Defensive stocks preferred
• Staples outperform discretionary
• Government spending increases
• RBA cuts rates`,
      type: 'callout',
      relatedTerms: ['unemployment-rate'],
    },
    {
      heading: 'Yield Curve - The Recession Predictor',
      body: `What It Is:
Graph showing relationship between bond yields and time to maturity

Normal Yield Curve:
• Longer-term bonds pay higher yields
• Upward sloping
• Indicates healthy economy
• Investors confident in future

Inverted Yield Curve:
• Short-term yields HIGHER than long-term
• Downward sloping
• Predicts recession within 12-18 months
• Has predicted every recession since 1950

Why Inversion Predicts Recession:
1. Investors expect rate cuts (recession response)
2. Demand for long-term bonds increases (safety)
3. Long-term yields fall below short-term
4. Banks can't profit (borrow short, lend long)
5. Credit tightens, slowing economy

How to Use It:
Check the spread between:
• 10-Year Bond Yield
• 2-Year Bond Yield

Spread > 0.5% = Safe, expansion likely
Spread near 0% = Caution, monitor closely
Spread < 0% = Warning, recession 12-18 months

Australian Example:
During COVID: Curve inverted briefly, recession followed
2023: Curve flattened, economy slowed`,
      type: 'callout',
      relatedTerms: ['yield-curve', 'recession'],
    },
    {
      heading: 'The Impact Chain: How Indicators Connect',
      body: 'Understanding how indicators flow into each other helps you predict market moves:',
      type: 'text',
    },
    {
      heading: 'Example Chain 1: Rate Hike Cycle',
      body: `Month 0: PMI drops from 52 to 48 (leading indicator)
↓
Month 2: GDP growth slows from 3% to 1% (coincident)
↓
Month 4: Unemployment rises from 4% to 5% (lagging)
↓
Month 6: CPI falls from 5% to 3% (lagging)
↓
Month 8: RBA cuts cash rate by 0.25%
↓
Month 10: Stock market rallies in anticipation
↓
Month 12: Housing market strengthens

Investment Action: When PMI drops, start reducing stocks and increasing bonds. Buy stocks when RBA signals rate cuts coming.`,
      type: 'callout',
    },
    {
      heading: 'Example Chain 2: Recovery Scenario',
      body: `Month 0: Building approvals surge +15% (leading)
↓
Month 2: Consumer confidence jumps (leading)
↓
Month 4: Retail sales increase (coincident)
↓
Month 6: GDP growth accelerates to 3% (coincident)
↓
Month 8: Unemployment falls to 3.8% (lagging)
↓
Month 10: CPI rises from 2% to 3.5% (lagging)
↓
Month 12: RBA raises rates to slow inflation

Investment Action: When building approvals surge, increase exposure to construction, materials, and retail stocks. Prepare to reduce when CPI gets too high.`,
      type: 'callout',
    },
    {
      heading: 'How to Use Indicators in Your Investing',
      body: `Step 1: Monitor Leading Indicators Weekly
• PMI (monthly release)
• Consumer Confidence (monthly)
• Building Approvals (monthly)
• Yield Curve (check weekly)

Step 2: Watch for Divergences
• If PMI falls but stock market rises = Trouble ahead
• If GDP strong but PMI weak = Peak of cycle
• If unemployment low but retail sales weak = Warning sign

Step 3: Confirm with Coincident Indicators
• Don't act on one data point
• Wait for GDP, employment, retail sales confirmation
• Look for 3-month trends

Step 4: Position Your Portfolio
Based on Indicator Phase:

Early Expansion (PMI rising from below 50):
• Increase stocks to 70%
• Focus on cyclicals, small caps
• Reduce bonds

Late Expansion (PMI above 55, inflation rising):
• Reduce stocks to 50%
• Add inflation hedges (commodities, REITs)
• Quality stocks over growth

Early Contraction (PMI falling below 50):
• Reduce stocks to 30%
• Increase bonds to 50%
• Add defensive stocks (healthcare, staples)

Late Contraction (Unemployment high, PMI stable):
• Start accumulating stocks (bargain prices)
• Target companies that will benefit from recovery
• Prepare for next expansion`,
      type: 'callout',
    },
    {
      heading: 'Key Indicators Calendar',
      body: `When Key Data Releases Happen:

First Week of Month:
• PMI (Manufacturing and Services)
• Building Approvals
• Trade Balance

Second Week:
• Consumer Confidence
• Business Confidence

Mid-Month:
• Employment Data (unemployment rate)
• RBA Meeting Minutes

Third Week:
• Wage Price Index (quarterly)

Fourth Week:
• CPI (quarterly)
• Retail Sales
• GDP (quarterly)

Mark These Dates:
RBA meets first Tuesday of every month (except January)
Markets often volatile around these announcements`,
      type: 'callout',
    },
    {
      heading: 'Common Mistakes to Avoid',
      body: `1. Reacting to Single Data Points
• One bad jobs report doesn't mean recession
• Look for 3-month trends
• Confirm with multiple indicators

2. Ignoring Revisions
• Initial GDP often revised significantly
• Wait for second or third estimate
• Revisions can change the story

3. Fighting the Leading Indicators
• If PMI warns of slowdown, believe it
• Don't assume "this time is different"
• Leading indicators work for a reason

4. Overweighting Lagging Indicators
• CPI confirms what already happened
• Corporate profits are backward-looking
• By the time lagging indicators move, it's too late

5. Ignoring Global Indicators
• China PMI affects Australian mining
• US jobs data moves our markets
• Europe recession impacts our exports`,
      type: 'list',
    },
    {
      heading: 'Key Takeaways',
      body: `1. Leading indicators (PMI, yield curve) predict what's coming - watch them closely
2. Coincident indicators (GDP, employment) confirm current state
3. Lagging indicators (CPI, profits) validate the trend
4. Inverted yield curve predicts recession with high accuracy
5. RBA cash rate is the most powerful policy tool
6. Indicators work in chains - one triggers another
7. Position your portfolio based on indicator phase
8. Don't react to single data points - wait for trends
9. Global indicators matter as much as Australian ones
10. Check economic calendar weekly to stay ahead`,
      type: 'list',
    },
  ],
}
