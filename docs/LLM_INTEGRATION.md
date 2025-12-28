# LLM Integration - Free Hugging Face Implementation

This document explains the free LLM (Large Language Model) infrastructure for the Gekkos Financial Newsletter application.

## Overview

We use **Meta's Llama 3.1 70B Instruct** via the free Hugging Face Inference API for all AI analysis features. This provides professional-grade AI analysis at **zero cost**.

### Why Free LLM?

- ✅ **Zero API costs** - No paid subscriptions required
- ✅ **70B parameter model** - Professional analysis quality
- ✅ **Rate limited but sufficient** - Handles typical usage patterns
- ✅ **Fallback system** - Graceful degradation when rate limited
- ✅ **No API keys needed** - Simpler deployment

### Previous Implementation

The backend previously used paid LLM providers (Anthropic Claude, OpenAI GPT-4) which have been **commented out** but preserved for reference in:
- `apps/backend/app/services/llm_service.py`

All paid LLM code is now disabled and raises `NotImplementedError` with migration guidance.

---

## Architecture

### Frontend LLM Library

**File:** `apps/web/src/lib/ai-analysis.ts`

This TypeScript library handles all AI analysis using the free Hugging Face API.

#### Main Functions

##### 1. Market News Analysis

```typescript
import { analyzeMarketNewsWithAI } from '@/lib/ai-analysis'

const articles = [
  {
    title: 'ASX hits record high',
    content: 'The Australian stock market...',
    category: 'stocks'
  }
]

const analysis = await analyzeMarketNewsWithAI(articles)
```

**Returns:**
```typescript
{
  articles: string[]              // Article references
  keyInsights: Array<{
    insight: string               // The insight
    source: string                // Which article
    implication: string           // What it means
    urgency: 'high' | 'medium' | 'low'
  }>
  tradingOpportunities: string[]  // Investment opportunities
  riskFactors: string[]           // Risks to watch
  marketSentiment: {
    stocks: string                // ASX sentiment
    crypto: string                // Crypto sentiment
    property: string              // Property sentiment
    overall: string               // Overall assessment
  }
  actionableRecommendations: string[]  // What to do
}
```

##### 2. Portfolio Insights

```typescript
import { generatePortfolioInsights } from '@/lib/ai-analysis'

const assets = [
  {
    symbol: 'CBA',
    type: 'stock',
    quantity: 100,
    currentPrice: 105.50
  }
]

const insights = await generatePortfolioInsights(assets)
```

**Returns:**
```typescript
{
  diversificationScore: string    // e.g., "7/10"
  riskLevel: 'low' | 'medium' | 'high'
  suggestions: string[]           // Portfolio improvements
  newsToWatch: string[]           // Relevant news categories
}
```

##### 3. Single Article Analysis

```typescript
import { analyzeSingleArticle } from '@/lib/ai-analysis'

const summary = await analyzeSingleArticle(
  'ASX Record High',
  'The Australian stock market reached...',
  'stocks'
)
```

---

## API Endpoints

### POST /api/analyze-news

Analyzes financial news articles.

**Request:**
```json
{
  "articles": [
    {
      "title": "Article title",
      "content": "Article content...",
      "category": "stocks"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "keyInsights": [...],
    "tradingOpportunities": [...],
    "riskFactors": [...],
    "marketSentiment": {...},
    "actionableRecommendations": [...]
  },
  "model": "Meta Llama 3.1 70B Instruct (Free)",
  "provider": "Hugging Face Inference API"
}
```

### POST /api/analyze-portfolio

Generates portfolio insights.

**Request:**
```json
{
  "assets": [
    {
      "symbol": "CBA",
      "type": "stock",
      "quantity": 100,
      "currentPrice": 105.50
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "insights": {
    "diversificationScore": "7/10",
    "riskLevel": "medium",
    "suggestions": [...],
    "newsToWatch": [...]
  },
  "model": "Meta Llama 3.1 70B Instruct (Free)",
  "provider": "Hugging Face Inference API"
}
```

---

## Fallback System

When Hugging Face API is unavailable or rate limited, the system automatically uses intelligent fallback analysis:

### Fallback Features

1. **Keyword Extraction** - Identifies key terms and topics
2. **Sentence Analysis** - Extracts important statements
3. **Pattern Recognition** - Detects common financial patterns
4. **Structured Output** - Returns same format as AI analysis
5. **Australian Context** - Tailored for Australian markets

### When Fallback Activates

- Hugging Face API returns non-200 status
- Response format is unexpected
- JSON parsing fails
- Network errors

The user experience remains seamless - they still receive useful analysis, just generated algorithmically instead of via LLM.

---

## Model Details

### Meta Llama 3.1 70B Instruct

- **Parameters:** 70 billion
- **Type:** Instruction-tuned language model
- **Training:** Optimized for following instructions and analysis tasks
- **Context Window:** Large enough for multiple news articles
- **Capabilities:**
  - Financial analysis
  - Risk assessment
  - Sentiment analysis
  - Strategic recommendations
  - JSON-formatted output

### Hugging Face Inference API

- **URL:** `https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3.1-70B-Instruct`
- **Cost:** FREE (public inference API)
- **Rate Limits:** Yes, but sufficient for typical usage
- **Authentication:** None required (public API)
- **SLA:** Best effort (free tier)

---

## Australian Market Focus

All prompts and analysis are tailored for Australian investors:

### Analysis Includes:

- **ASX-specific insights** - Australian stock market analysis
- **AUD currency context** - Exchange rate impacts
- **Australian property markets** - Major capital cities
- **Local economic indicators** - RBA decisions, local policy
- **Australian English** - Uses "analyse", "optimise" etc.

### Market Categories:

- **Stocks** - ASX companies, sectors, indices
- **Crypto** - Bitcoin, Ethereum, DeFi
- **Property** - Residential, commercial, REITs
- **Economy** - GDP, employment, interest rates
- **Tech** - Innovation, digital transformation

---

## Integration Examples

### News Intelligence Page

```typescript
'use client'
import { useState } from 'react'
import { analyzeMarketNewsWithAI } from '@/lib/ai-analysis'

export default function NewsPage() {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async (articles) => {
    setLoading(true)
    try {
      const result = await analyzeMarketNewsWithAI(articles)
      setAnalysis(result)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Display analysis results */}
      {analysis && (
        <div>
          <h2>Market Insights</h2>
          {analysis.keyInsights.map((insight, idx) => (
            <div key={idx}>
              <p><strong>{insight.insight}</strong></p>
              <p>{insight.implication}</p>
              <span>{insight.urgency}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Portfolio Tracker

```typescript
'use client'
import { useState } from 'react'
import { generatePortfolioInsights } from '@/lib/ai-analysis'

export default function PortfolioPage() {
  const [insights, setInsights] = useState(null)
  const [assets, setAssets] = useState([])

  const handleAnalyzePortfolio = async () => {
    const result = await generatePortfolioInsights(assets)
    setInsights(result)
  }

  return (
    <div>
      {/* Display portfolio insights */}
      {insights && (
        <div>
          <h3>Diversification: {insights.diversificationScore}</h3>
          <h3>Risk Level: {insights.riskLevel}</h3>
          <h4>Suggestions:</h4>
          <ul>
            {insights.suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

---

## Performance

### Response Times

- **With AI (Hugging Face):** 3-8 seconds (varies with API load)
- **With Fallback:** <100ms (instant)

### Accuracy

- **AI Analysis:** Professional-grade insights from 70B model
- **Fallback Analysis:** Reliable algorithmic analysis with Australian market context

### Rate Limits

The free Hugging Face API has rate limits, but they're sufficient for:
- Individual user analysis requests
- Periodic batch analysis
- Development and testing

For high-volume production usage, consider:
- Hugging Face Pro subscription
- Self-hosted Llama model
- Request caching

---

## Troubleshooting

### "Model is currently loading"

Hugging Face cold-starts models. Wait 20-30 seconds and retry. The fallback system handles this automatically.

### Rate Limit Errors

The system automatically uses fallback analysis. No action needed.

### JSON Parse Errors

The system catches these and uses fallback. If persistent, check the model's response format.

---

## Migration from Paid LLMs

If you previously used the paid backend LLM service, here's how to migrate:

### Backend (Python)

**Old:**
```python
from app.services.llm_service import LLMService

llm = LLMService(provider="anthropic")
result = await llm.summarize_transcript(text)
```

**New:**
This is now disabled. Use frontend instead.

### Frontend (TypeScript)

**New:**
```typescript
import { analyzeMarketNewsWithAI } from '@/lib/ai-analysis'

const analysis = await analyzeMarketNewsWithAI(articles)
```

---

## Future Enhancements

Potential improvements to consider:

1. **Caching** - Cache AI responses for repeated queries
2. **Batch Processing** - Analyze multiple articles in parallel
3. **Custom Fine-tuning** - Train on Australian financial data
4. **Real-time Analysis** - Stream analysis as articles arrive
5. **Sentiment Tracking** - Historical sentiment trends
6. **Alert System** - Notify on high-urgency insights

---

## Support

For questions or issues:
1. Check the fallback system is working
2. Review Hugging Face API status
3. Check browser console for errors
4. Verify article/asset data format

## Related Documentation

- [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index)
- [Llama 3.1 Model Card](https://huggingface.co/meta-llama/Meta-Llama-3.1-70B-Instruct)
- [News Integration Guide](./NEWS_INTEGRATION.md)
