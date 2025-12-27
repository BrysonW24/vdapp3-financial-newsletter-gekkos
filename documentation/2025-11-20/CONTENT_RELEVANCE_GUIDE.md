# Content Relevance Scoring System

## Overview

The content relevance scoring system provides intelligent ranking and selection algorithms to surface the most relevant, authoritative, and timely content in the newsletter.

Located at: `apps/web/src/lib/utils/contentScoring.ts`

## Features

### 1. Article Scoring & Ranking
Scores articles based on three weighted factors:

- **Source Authority (40%)**: Recognizes trusted news sources
  - Reuters, AP, Bloomberg, Financial Times, WSJ: 0.90-0.95
  - CNBC, CoinDesk, TechCrunch: 0.85
  - MarketWatch, Seeking Alpha: 0.75-0.80
  - Unknown sources: 0.50 (default)

- **Recency (30%)**: Prioritizes newer content
  - Published < 1 hour ago: 1.0
  - < 4 hours: 0.95
  - < 12 hours: 0.85
  - < 24 hours: 0.75
  - < 72 hours: 0.45
  - > 72 hours: 0.30

- **Topic Relevance (30%)**: Matches article content to topics
  - Checks 50+ keywords across 6 major topics:
    - Technology (AI, machine learning, cloud, blockchain, etc.)
    - Finance (banking, fintech, crypto, stocks, etc.)
    - Clean Energy (renewable, solar, wind, battery, etc.)
    - Healthcare (biotech, pharmaceutical, medical, etc.)
    - Entertainment (streaming, gaming, media, etc.)
    - Property (real estate, housing, development, etc.)

### 2. IPO Scoring & Ranking
Ranks IPOs by attractiveness based on:

- **Sector Interest (40%)**: Boost for hot sectors
  - Artificial Intelligence: 0.95
  - Biotechnology, Clean Energy, Cybersecurity: 0.95
  - Technology, Healthcare Tech: 0.85
  - Finance/Fintech: 0.80

- **Market Cap (30%)**: Mid-cap IPOs preferred
  - $1B-$5B: 0.90 (most attractive)
  - $500M-$1B: 0.80
  - $5B+: 0.75
  - < $500M: 0.50

- **Date Proximity (30%)**: Upcoming IPOs more interesting
  - This week: 0.95
  - Next 2 weeks: 0.85
  - Next month: 0.70
  - Next 3 months: 0.55
  - > 3 months: 0.30
  - Already happened: 0.30

## Usage Examples

### Basic Article Scoring

```typescript
import {
  scoreArticle,
  scoreAndSortArticles,
  getTopArticles
} from '@/lib/utils/contentScoring';

// Score a single article
const article = {
  title: 'AI Breakthrough in Drug Discovery',
  source: 'Bloomberg',
  url: 'https://example.com/article',
  description: 'Researchers use machine learning to accelerate pharmaceutical development',
  publishedAt: new Date().toISOString()
};

const scoredArticle = scoreArticle(article);
console.log(scoredArticle.finalScore); // 0.75 (example)
console.log(scoredArticle.authorityScore); // 0.90
console.log(scoredArticle.recencyScore); // 1.0
console.log(scoredArticle.relevanceScore); // 0.60
```

### Sorting Articles by Relevance

```typescript
// Get all articles sorted by relevance
const articles = [
  { title: 'Tech News 1', source: 'TechCrunch', ... },
  { title: 'Market Update', source: 'Reuters', ... },
  // ... more articles
];

const sorted = scoreAndSortArticles(articles);
sorted.forEach(article => {
  console.log(`${article.title}: ${article.finalScore.toFixed(2)}`);
});
```

### Get Top N Articles

```typescript
// Get top 5 most relevant articles
const topArticles = getTopArticles(articles, 5);

// Only use articles with high relevance
const highQualityArticles = topArticles.filter(a => a.finalScore > 0.70);
```

### IPO Scoring

```typescript
import { scoreIPO, scoreAndSortIPOs, getTopIPOs } from '@/lib/utils/contentScoring';

const ipos = [
  {
    companyName: 'AITech Corp',
    symbol: 'AITI',
    sector: 'Artificial Intelligence',
    marketCap: '$2.5B',
    expectedDate: '2025-01-20'
  },
  // ... more IPOs
];

// Get top 3 most attractive IPOs
const topIPOs = getTopIPOs(ipos, 3);

topIPOs.forEach(ipo => {
  console.log(`${ipo.companyName}: ${ipo.finalScore.toFixed(2)}`);
  console.log(`  Sector Score: ${ipo.relevanceScore.toFixed(2)}`);
  console.log(`  Attractiveness: ${ipo.attractivenessScore.toFixed(2)}`);
});
```

### Curated Content Selection

```typescript
import { selectBestContent } from '@/lib/utils/contentScoring';

const selection = selectBestContent(articles, ipos);

// Use the selection:
selection.topArticles.forEach(article => {
  // Render top 5 articles
});

selection.topIPOs.forEach(ipo => {
  // Render top 3 IPOs
});

// Check if we have interesting content
if (selection.hasHotIPOs) {
  // Show IPO alerts
}

if (selection.hasRelevantTechNews) {
  // Highlight tech news
}
```

## Integration with Feed Components

### Example: Enhanced Technology Feed

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getTopArticles } from '@/lib/utils/contentScoring';

export default function TechnologyFeed() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchAndRankNews = async () => {
      const response = await fetch('/api/technology-news');
      const data = await response.json();

      // Score and rank articles
      const rankedArticles = getTopArticles(data.articles, 5);
      setArticles(rankedArticles);
    };

    fetchAndRankNews();
  }, []);

  return (
    <div className="section-card">
      <h2 className="section-title">
        <span className="text-3xl">💻</span>
        Technology Feed
        <span className="ml-auto text-xs text-blue-600">
          RANKED BY RELEVANCE
        </span>
      </h2>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
            {/* Show relevance score indicator */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Score: {(article.finalScore * 100).toFixed(0)}%
              </span>
              {article.finalScore > 0.80 && (
                <span className="text-xs font-bold text-orange-600">🔥 TRENDING</span>
              )}
            </div>

            <h3 className="font-bold text-gray-900">
              <a href={article.url} className="hover:text-blue-600">
                {article.title}
              </a>
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {article.description}
            </p>
            <div className="text-xs text-gray-500 mt-2 flex justify-between">
              <span>{article.source}</span>
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Customization

### Adjust Scoring Weights

To change the importance of different factors, modify the weights in `scoreArticle()`:

```typescript
// Current: Authority 40%, Recency 30%, Relevance 30%
const finalScore =
  (authorityScore * 0.40) +  // ← Adjust these weights
  (recencyScore * 0.30) +
  (relevanceScore * 0.30);
```

### Add New Authority Sources

Add to `SOURCE_AUTHORITY` map:

```typescript
const SOURCE_AUTHORITY: Record<string, number> = {
  'Reuters': 0.95,
  'Bloomberg': 0.90,
  'YOUR_SOURCE': 0.85,  // ← Add here
};
```

### Add Hot Sectors

Modify `HOT_SECTORS` array:

```typescript
const HOT_SECTORS = [
  'Artificial Intelligence',
  'Biotechnology',
  'Your New Hot Sector',  // ← Add here
];
```

### Add Topic Keywords

Expand `TOPIC_KEYWORDS`:

```typescript
const TOPIC_KEYWORDS: Record<string, string[]> = {
  'your-topic': [
    'keyword1',
    'keyword2',
    'keyword3',
  ],
};
```

## API Integration Strategy

### For News Feeds

```typescript
// 1. Fetch articles from API
const articles = await fetchArticles();

// 2. Score and rank them
const topArticles = getTopArticles(articles, 10);

// 3. Return ranked articles to frontend
return { articles: topArticles };
```

### For IPO Data

```typescript
// 1. Fetch IPO data from NASDAQ/IEX Cloud
const ipos = await fetchIPOs();

// 2. Score by attractiveness
const topIPOs = getTopIPOs(ipos, 5);

// 3. Filter by sector relevance
const techIPOs = ipos.filter(ipo =>
  ipo.sector.toLowerCase().includes('technology')
);

// 4. Return curated data
return {
  topIPOs,
  techIPOs,
  hasHotIPOs: topIPOs.some(ipo => ipo.finalScore > 0.80)
};
```

## Performance Considerations

- **Caching**: Results are cached for 1-4 hours since scoring is deterministic
- **Batch Processing**: Score articles in batches for large datasets
- **Lazy Evaluation**: Only score articles that will be displayed

Example caching implementation:

```typescript
function getCachedScoredArticles(articles: Article[]): ScoredArticle[] {
  const cacheKey = `articles:${articles.length}:${Date.now() / 3600000 | 0}`;

  if (cacheKey in globalThis.__scoring_cache) {
    return globalThis.__scoring_cache[cacheKey];
  }

  const scored = scoreAndSortArticles(articles);
  globalThis.__scoring_cache[cacheKey] = scored;
  return scored;
}
```

## Testing Scoring

```typescript
// Test different article types
const testArticles = [
  {
    title: 'Breaking: AI Breakthrough',
    source: 'Reuters',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Minor Market Update',
    source: 'Unknown Blog',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

scoreAndSortArticles(testArticles).forEach(article => {
  console.table({
    title: article.title.substring(0, 30),
    finalScore: article.finalScore.toFixed(2),
    authority: article.authorityScore.toFixed(2),
    recency: article.recencyScore.toFixed(2),
    relevance: article.relevanceScore.toFixed(2),
  });
});
```

## Future Enhancements

1. **Engagement Signals**: Incorporate article shares, comments, views
2. **Sentiment Analysis**: Score articles by market sentiment (bullish/bearish)
3. **Topic Clustering**: Group similar articles and rank by cluster quality
4. **User Preferences**: Personalize scoring based on user interests
5. **A/B Testing**: Test different weighting strategies
6. **ML-Based Scoring**: Use ML to learn optimal weights

## Summary

The content relevance scoring system enables:

✅ **Smart Ranking**: Order articles by authority, recency, and relevance
✅ **IPO Selection**: Highlight the most attractive upcoming IPOs
✅ **Topic Filtering**: Find articles matching specific sectors
✅ **Customizable**: Adjust weights and add new sources/sectors
✅ **Performant**: Lightweight scoring without external dependencies
✅ **Extensible**: Easy to add ML-based improvements

This system ensures newsletter readers always see the most important, relevant, and timely content!
