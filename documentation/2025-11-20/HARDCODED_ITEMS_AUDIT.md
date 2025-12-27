# Hardcoded Items Audit & Dynamic Data Solutions

## 📋 Current Hardcoded Items Found

### 1. **Quote of the Day** ❌ HARDCODED
**File:** `apps/web/src/app/api/daily-quote/route.ts`
**Issue:** 5 hardcoded quotes that rotate by day of year
**Status:** Currently selects quote based on day number (deterministic rotation)

**Current Implementation:**
```typescript
const quotes = [
  { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs', ... },
  { text: 'The best way to predict the future is to create it.', author: 'Peter Drucker', ... },
  // ... 3 more quotes
];
const quoteIndex = dayOfYear % quotes.length; // Rotates through 5 quotes
```

**Problem:**
- Only 5 quotes available (user sees same 5 quotes on repeat)
- No variation or freshness
- No LLM generation

---

### 2. **Visual Capitalist Graphic of the Day** ❌ HARDCODED
**File:** `apps/web/src/app/api/visual-capitalist/graphic-of-day/route.ts`
**Issue:** Single hardcoded "Evolution of Vivacity Digital" timeline graphic
**Status:** Always returns the same graphic

**Current Implementation:**
```typescript
const graphics = [
  {
    title: 'The Evolution of Vivacity Digital',
    subtitle: '...',
    milestones: [
      { year: '2020', title: 'Foundation', ... },
      { year: '2021', title: 'First Launch', ... },
      // ... 4 more years
    ]
  }
];
return NextResponse.json(graphics[0]); // Always returns the first (only) one
```

**Problem:**
- Only 1 graphic available
- Specific to Vivacity Digital (not relevant news/data)
- Doesn't pull from real Visual Capitalist data

---

### 3. **IPO Data** ❌ HARDCODED
**File:** `apps/web/src/app/api/ipo-data/route.ts`
**Issue:** 3 fictional IPO companies with hardcoded data
**Status:** Always returns same 3 IPOs

**Current Implementation:**
```typescript
const ipos = [
  { companyName: 'TechNova Solutions', symbol: 'TNVA', ... },
  { companyName: 'GreenEnergy Corp', symbol: 'GREN', ... },
  { companyName: 'MediTech Innovations', symbol: 'MDTI', ... }
];
return NextResponse.json({ ipos });
```

**Problem:**
- Fictional companies, not real IPOs
- No connection to actual upcoming IPOs
- Static data never updates

---

## 🎯 Proposed Solutions

### **Quote of the Day → LLM Generated Daily**

#### Best Free Approach:
**Option 1: OpenRouter Free Tier + Fallback**
```bash
Cost: FREE for reasonable usage
Provider: OpenRouter (aggregates multiple LLMs)
Free models available:
- Meta Llama 2 (fast, free)
- Mistral 7B (fast, free)
```

**Option 2: Anthropic Claude (if you have API key)**
- Use your existing ANTHROPIC_API_KEY
- Claude generates better quotes
- Can use batch API for cost optimization

**Option 3: Together AI + Fallback**
```bash
Cost: FREE tier available
Free models: Mistral, Llama, etc.
```

**Implementation Strategy:**
```typescript
// 1. On daily-quote API route
// 2. Check cache (Redis) for today's quote
// 3. If expired/missing:
//    a. Call LLM with prompt for inspirational quote
//    b. Cache result until midnight
//    c. Return quote
// 4. If LLM fails, fall back to hardcoded quotes
```

**Recommended Prompt:**
```
Generate a unique, inspirational quote about business, technology,
or entrepreneurship. Format as JSON:
{
  "text": "quote here",
  "author": "author name",
  "title": "role/title",
  "context": "why this matters",
  "category": "topic"
}
```

---

### **Visual Capitalist Graphic → Real Data Sources**

#### Best Approach:
**Option 1: NewsAPI + ImageGen (Free)**
```bash
1. Fetch trending financial news (NewsAPI - free tier)
2. Extract key statistic/insight
3. Format as graphic-style card
4. Cache until daily rotation
```

**Option 2: Financial Data APIs**
```bash
- Alpha Vantage: Market stats (free)
- CoinGecko: Crypto market cap (free)
- Yahoo Finance scraping: Stock data (free)
→ Convert to "Infographic of the Day"
```

**Option 3: Combined Approach**
```
Mon: Market Cap visualization
Tue: Sector performance chart
Wed: Crypto trends
Thu: Economic indicators
Fri: Weekly recap
```

**Recommended Implementation:**
Instead of "Visual Capitalist", create "Financial Insight of the Day":
- Daily stat/trend from financial data
- Format as a card with icon and value
- Change based on day and data

---

### **IPO Data → Real Live Data**

#### Best Free Sources:

**Option 1: Scrape NASDAQ/NYSE (Free)**
```typescript
// Use cheerio or puppeteer to scrape:
- https://www.nasdaq.com/market-activity/ipos
- https://www.nyse.com/ipo-center/
```

**Option 2: NewsAPI IPO News (Free Tier)**
```typescript
// Fetch IPO-related news and extract upcoming IPOs
// Filter by date and sector
```

**Option 3: IEX Cloud (Free Tier)**
```bash
Cost: Free tier available
- IPO calendar data
- Upcoming IPO announcements
- Historical IPO data
```

**Recommended: Scraping + Caching**
```typescript
// Daily cron job that:
// 1. Scrapes NASDAQ IPO calendar
// 2. Extracts next 5-10 upcoming IPOs
// 3. Caches for 24 hours
// 4. Falls back to hardcoded if scrape fails
```

---

## 📊 Content Selection Strategy

Once we have live data, how to select "most relevant/interesting" items:

### **1. Quote of the Day**
- **Selection:** Rotate daily + cache for consistency
- **Relevance:**
  - Generate based on market mood (bullish/bearish)
  - Topics: leadership, innovation, resilience
- **Freshness:** New quote every 24 hours (via LLM)

### **2. Financial Insight of the Day**
- **Selection:** Choose based on market volatility
- **Relevance:**
  - Highest % change in stocks
  - Trending crypto
  - Major economic news
  - IPO announcements
- **Freshness:** Update every 4 hours or on new data

### **3. IPO Data**
- **Selection:**
  - Upcoming IPOs (next 30 days)
  - Sort by: Expected date, market cap, sector
  - Highlight interesting sectors (AI, Clean energy, Biotech)
- **Relevance:**
  - Filter to sectors in newsletter focus
  - Exclude penny stocks/low cap
  - Highlight venture-backed companies
- **Freshness:** Update daily

### **4. Article Selection (Already Partially Implemented)**
For news sections (crypto, tech, property, etc.):
- **Selection Logic:**
  - Fetch from multiple sources
  - Score by: relevance, source authority, engagement (if available)
  - Deduplicate similar stories
  - Diversify sources
- **Already Implemented:**
  - NewsAPI integration
  - Multiple news sources
  - Article filtering

---

## 🔧 Implementation Roadmap

### Phase 1: Quick Wins (This Week)
- [ ] Add GlobalPolitics section to page.tsx
- [ ] Implement Quote LLM generation (using your existing Claude API key)
- [ ] Add error handling / fallbacks

### Phase 2: Real Data (Next Week)
- [ ] Integrate real IPO data (scraping or API)
- [ ] Create Financial Insight of the Day (from real market data)
- [ ] Implement caching layer (Redis)

### Phase 3: Smart Selection (Following Week)
- [ ] Add relevance scoring for articles
- [ ] Implement market sentiment analysis
- [ ] Create "trending" vs "important" rankings
- [ ] A/B test different selection strategies

---

## 💰 Cost Analysis

### **Free Tier Solutions:**
| Component | Solution | Cost | API |
|-----------|----------|------|-----|
| Quote | Anthropic Claude (your key) | FREE | ✅ |
| IPO Data | NASDAQ scraping | FREE | N/A |
| Financial Insight | Alpha Vantage | FREE | ✅ |
| News | NewsAPI free tier | FREE | ✅ |
| Caching | Redis (your Railway) | FREE | ✅ |

**Total Monthly Cost: $0 (using existing services)**

---

## 🚀 Recommended First Steps

1. **Integrate GlobalPolitics** - Easy win
2. **LLM Quotes** - Use existing Claude API key
3. **Real IPO Data** - Scrape or API
4. **Content Freshness** - Implement caching

---

## 📝 Summary

**Hardcoded Items:** 3
- Quotes (5 static quotes)
- Visual Capitalist graphic (1 Vivacity-specific graphic)
- IPO data (3 fictional companies)

**Best Solution:** Hybrid approach
- LLM for quotes (fresh daily)
- Real data APIs/scraping for IPOs
- Live market data for insights
- News API for articles (already implemented)

**Zero Additional Cost:** All solutions use free tiers or existing services
