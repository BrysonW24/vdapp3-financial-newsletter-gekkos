# 💼 Portfolio Personalization - Quick Start

Get personalized news for YOUR investments in 60 seconds.

---

## What You'll See

```
┌─────────────────────────────────────────┐
│  📋 Today's Contents                     │
│  ┌─────────┬──────────┬──────────────┐  │
│  │Trading  │ Stocks   │ Crypto       │  │
│  │📈       │ 💹       │ ₿            │  │
│  ├─────────┼──────────┼──────────────┤  │
│  │Property │Economy   │My Portfolio ✨│  │
│  │🏠       │ 🏦       │ 💼          │  │
│  └─────────┴──────────┴──────────────┘  │
└─────────────────────────────────────────┘

↓ Scroll down ↓

┌─────────────────────────────────────────┐
│  💼 My Portfolio                         │
│                                          │
│  [💼] Add My Portfolio                   │
│       → Click to add your holdings       │
│                                          │
│  When expanded:                          │
│  ┌──────────────────────────────────┐   │
│  │ Symbol    | Name     | Type | Qty│   │
│  ├──────────────────────────────────┤   │
│  │ASX:CBA    | Comm Bank| Stock| 50 │   │
│  │BTC        | Bitcoin  | Crypto|.5 │   │
│  │ASX:RIO    | Rio Tinto| Stock| 30 │   │
│  └──────────────────────────────────┘   │
│                                          │
│  My Portfolio News (15 articles)         │
│  ┌──────────────────────────────────┐   │
│  │ CBA beats earnings expectations   │   │
│  │ Relates to: ASX:CBA             │   │
│  │ Relevance: 95% ⭐               │   │
│  │ [Read →]                        │   │
│  ├──────────────────────────────────┤   │
│  │ Bitcoin rallies on Fed decision  │   │
│  │ Relates to: BTC                 │   │
│  │ Relevance: 87% ⭐               │   │
│  │ [Read →]                        │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## Getting Started

### Step 1: Open Newsletter
```
Navigate to: newsletter-daily.vercel.app
Scroll to: Top of page
```

### Step 2: Expand Portfolio Section
```
Click: 💼 "Add My Portfolio" button
Effect: Form expands
```

### Step 3: Add Your First Holding
```
Symbol:   ASX:CBA
Name:     Commonwealth Bank
Type:     Stock
Quantity: 50

Click: ➕ "Add Holding"
```

### Step 4: Add More Holdings (Optional)
```
Repeat Step 3 for:
- BTC (Bitcoin)
- PROPERTY:Sydney-CBD
- Any other investments
```

### Step 5: See Your News
```
Portfolio news appears automatically
Shows only articles matching your holdings
Sorted by relevance to your investments
```

---

## Examples

### Simple Investor
```
Holdings:
├─ ASX:CBA (50 shares)
└─ BTC (0.5)

Results:
├─ "Commonwealth Bank Q3 earnings"
├─ "Bitcoin hits 2-year high"
├─ "Banking sector analysis"
└─ "Crypto regulation update"
```

### Diversified Investor
```
Holdings:
├─ ASX:CBA (stock)
├─ ASX:RIO (mining)
├─ BTC (crypto)
├─ PROPERTY:Sydney-CBD
└─ VAS (ETF)

Results:
├─ CBA news
├─ Rio Tinto mining updates
├─ Bitcoin + crypto news
├─ Sydney property market
└─ Australian market trends
```

### Property Investor
```
Holdings:
├─ PROPERTY:Sydney-CBD
├─ PROPERTY:Melbourne-South
└─ ASX:JRE (property ETF)

Results:
├─ Sydney CBD office market
├─ Melbourne residential prices
├─ Australian property outlook
└─ Real estate ETF performance
```

---

## How It Works

### 1. You Add Holdings
```
Input: ASX:CBA, Commonwealth Bank, 50 shares
↓
System generates keywords: ["ASX:CBA", "Commonwealth Bank", "bank"]
```

### 2. System Searches Internet
```
NewsAPI query:
(ASX:CBA OR Commonwealth Bank OR bank)

Results: 40 articles found
```

### 3. System Scores Articles
```
Article: "CBA reports strong earnings"
├─ Keywords matched: 2 ("Commonwealth Bank", "CBA") ✓
├─ Published: 2 hours ago (recent!) ✓
└─ Score: 95%
```

### 4. Results Displayed
```
Only showing:
✓ Articles about CBA
✓ Most relevant first (95%, 87%, 82%, ...)
✓ Link to full article
✓ Why it matched your portfolio
```

---

## Key Features

| Feature | What It Does |
|---------|-------------|
| 🎯 Smart Keywords | Auto-generates keywords from holding names |
| 🔍 Smart Search | Searches internet using your holdings |
| 📊 Relevance Score | Shows why each article is relevant (0-100%) |
| 🏷️ Symbol Tags | Highlights which holdings each article relates to |
| 🕐 Recency Boost | Recent articles rank higher (news vs old data) |
| 🔗 Direct Links | Click to read full article at source |
| 📱 Mobile Friendly | Works on phone, tablet, desktop |

---

## Tips & Tricks

### Tip 1: Use Exact Symbols
```
❌ BAD: "Commonwealth"
✓ GOOD: "ASX:CBA"

Why: Ticker symbols are unique and fetch better results
```

### Tip 2: Add Multiple Keywords
```
Holding: Apple Inc.
Keywords auto-generated:
["AAPL", "Apple Inc.", "apple"]

You can manually add:
["AAPL", "Apple Inc.", "Apple", "Steve Jobs"]
```

### Tip 3: Mix Asset Classes
```
Stocks + Crypto + Property = Diverse coverage
You get:
- Tech company news (stocks)
- Crypto market trends (crypto)
- Real estate updates (property)
```

### Tip 4: Adjust Quantity
```
You can edit:
- 50 → 60 (bought more)
- Delete & re-add (easiest for Phase 1)
```

---

## FAQ

### Q: Will my portfolio be saved?
**Phase 1** (Now): Saves during session only (refresh = lost)
**Phase 2** (Soon): Will save to database automatically

### Q: Can I have multiple portfolios?
**Phase 1** (Now): One per session (demo)
**Phase 2** (Soon): Multiple named portfolios

### Q: How often is news updated?
**Real-time**: News fetched on each visit
**Better**: Phase 2 will cache 1-hour old news

### Q: What if I have typos?
Auto-complete coming soon. For now:
- Be specific: "Commonwealth Bank" vs "Commonwealth"
- Use ticker: "ASX:CBA" vs "CBA"

### Q: Why aren't all my holdings showing news?
Possible reasons:
- Holdings very new (no news yet)
- Company name too generic ("Bank" = 1000s of results)
- Crypto very volatile (news searches by price instead)
- News API quota exhausted (retry in 1 hour)

### Q: Can I get email alerts?
**Phase 1** (Now): No
**Phase 3** (Future): Yes, daily/weekly digests

---

## Common Holdings to Try

### Australian Stocks
```
ASX:CBA     Commonwealth Bank
ASX:NAB     National Australia Bank
ASX:ANZ     Australia and New Zealand Banking
ASX:WBC     Westpac
ASX:RIO     Rio Tinto
ASX:BHP     BHP
```

### Cryptocurrencies
```
BTC         Bitcoin
ETH         Ethereum
ADA         Cardano
XRP         Ripple
SOL         Solana
DOGE        Dogecoin
```

### Properties
```
PROPERTY:Sydney-CBD       Sydney Central Business District
PROPERTY:Sydney-Inner     Inner Sydney residential
PROPERTY:Melbourne-CBD    Melbourne CBD office
PROPERTY:Brisbane-QLD     Brisbane residential
```

### ETFs & Funds
```
VAS         Vanguard Australian Shares
VGS         Vanguard Global Shares
DHHF        Diversified ETF (Healthcare, Growth)
```

---

## Troubleshooting

### Issue: "No news found"
```
✓ Try different keyword
✓ Wait a few hours (news cycles)
✓ Use exact ticker symbol (ASX:CBA vs CBA)
✓ Check NewsAPI hasn't hit daily limit
```

### Issue: "Portfolio disappeared after refresh"
```
This is normal in Phase 1 (demo mode)
Solution: Re-add your holdings
Permanent fix: Coming in Phase 2 (database)
```

### Issue: "Irrelevant articles appearing"
```
Example: "Bank holiday" matches "Bank stock"
Temporary: Ignore or use Read button to see context
Better: Phase 2 will add relevance filtering
```

---

## What's Coming

### Phase 2 (Next)
```
✓ Save portfolios to database
✓ User login/accounts
✓ Edit holdings without deleting
✓ Multiple portfolios
✓ Better keyword matching
```

### Phase 3 (Soon After)
```
✓ Real-time price alerts
✓ Portfolio performance tracking
✓ Email digests
✓ Investment recommendations
```

### Phase 4 (Later)
```
✓ Sentiment analysis (is news positive/negative?)
✓ Predictive scoring (which news affects prices?)
✓ Tax reporting
✓ Historical archive
```

---

## Get Help

### See Full Documentation
Read: [PORTFOLIO_PERSONALIZATION.md](./PORTFOLIO_PERSONALIZATION.md)

### Report Issues
GitHub: https://github.com/BrysonW24/newsletter-daily-prod/issues

### Request Features
GitHub Discussions: https://github.com/BrysonW24/newsletter-daily-prod/discussions

---

## Summary

```
You               System              Results
│                 │                    │
├─ Add holdings   │                    │
│                 ├─ Generate keywords │
│                 ├─ Search news API   │
│                 ├─ Score articles    │
│                 ├─ Filter results    │
│                 │                    ├─ Personalized news
│                 │                    ├─ Relevance scores
│                 │                    ├─ Direct links
│                 │                    │
                  └─────────────────────┘
```

**Start now**: Click "💼 Add My Portfolio" button above! 🚀

---

**Feature Status**: ✅ Ready to use
**Commit**: `6419974`
**Deploy**: Live on Vercel
