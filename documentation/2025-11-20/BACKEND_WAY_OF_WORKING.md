# 🔧 Backend Way of Working

> **Purpose:** Define the exact goals, responsibilities, and standards for the newsletter-daily-prod backend. This is the north star for development decisions and code review.

---

## Quick Reference

**Mission:** Discover → Normalize → Rank → Select → Summarise → Deliver

**Daily Schedule:**
- Every 30 min @ :00 — Discover articles from sources
- Every 30 min @ :15 — Normalize & clean content
- Daily @ :55 — LLM classification & ranking
- Daily @ :57 — Deduplication & selection
- Daily @ :58 — Generate summaries
- Daily @ :00 (next) — Publish to `/api/newsletter/today`

**Success Metrics:** Zero hallucinations | 95%+ citation accuracy | < 70 min total latency | < $200/mo cost

---

## Architecture Overview

```
DISCOVER (30-60 min)          NORMALIZE                RANK                SELECT              SUMMARISE            PUBLISH
  ↓                              ↓                       ↓                   ↓                    ↓                    ↓
RSS/APIs (ASX, RBA, etc.)  → Resolve URLs          → LLM classify    → Dedupe &         → Fact extract       → JSON API
                              Extract text            Score (0-1)       diversity         + Write TL;DR        → Email
                              Clean boilerplate       Weight: 0.35*rel   Per-topic caps    3 key points         → Web
                              Compute embeddings      + 0.20*qual        Source limits      why_it_matters
```

---

## System Responsibilities

### ✅ MUST DO

1. **Discover & Harvest** — Poll sources every 30–60 min; detect new articles by URL
2. **Normalize & Clean** — Resolve URLs, extract text, remove boilerplate, compute embeddings
3. **Classify & Score** — LLM labels topic; compute relevance, quality, freshness, impact, uniqueness
4. **Select & Deduplicate** — Enforce per-topic caps, merge near-duplicates (cosine > 0.85), ensure source diversity
5. **Summarise & Enrich** — Extract facts, generate 65–90 word TL;DR, 3 key points, "why it matters"
6. **Assemble & Publish** — Build structured JSON, expose at `/api/newsletter/today`
7. **Operate Reliably** — Log all decisions, retry on failure, alert on anomalies

### ❌ MUST NOT DO

- Hallucinate facts, numbers, tickers, or quotes
- Include unverified sources
- Rank purely by recency
- Cache beyond 24 hours
- Publish partial/stale data

---

## Data Model (Postgres + pgvector)

### Core Tables

```sql
-- Raw articles from sources
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL,                    -- 'ASX', 'RBA', 'Reuters', etc.
  published_at TIMESTAMPTZ,
  title TEXT, description TEXT,
  html TEXT, text_clean TEXT, lang TEXT DEFAULT 'en',
  embedding vector(1536),                  -- OpenAI text-embedding-3-small
  status TEXT DEFAULT 'raw',               -- raw|clean|scored|summarised|selected|failed
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_articles_url ON articles(url);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_embedding ON articles USING ivfflat (embedding vector_cosine_ops);

-- Scores & ranks
CREATE TABLE article_scores (
  article_id UUID PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,                     -- stocks|property|fx|crypto|macro|startups|other
  relevance FLOAT, quality FLOAT,          -- 0-1, from LLM
  freshness FLOAT, impact FLOAT, uniqueness FLOAT,  -- server-computed
  overall FLOAT,                           -- 0.35*rel + 0.20*qual + 0.20*fresh + 0.15*imp + 0.10*uniq
  rationale TEXT,                          -- audit trail
  scored_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_article_scores_overall ON article_scores(overall DESC);

-- Final summaries
CREATE TABLE article_summaries (
  article_id UUID PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  kicker TEXT, headline TEXT NOT NULL,
  tl_dr TEXT NOT NULL,                     -- 65-90 words
  key_points JSONB NOT NULL,               -- ["point1", "point2", "point3"]
  why_it_matters TEXT NOT NULL,
  tickers JSONB, entities JSONB, numbers JSONB, quotes JSONB,
  links JSONB NOT NULL,                    -- [{"title":"Source","url":"..."}]
  summarised_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily issue snapshots
CREATE TABLE newsletter_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_date DATE UNIQUE NOT NULL,
  hero JSONB, sections JSONB,              -- final content
  market_card JSONB,                       -- ASX 200, AUD/USD, BTC, yields
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin: source configuration
CREATE TABLE source_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,               -- "ASX", "RBA", "Reuters Top"
  source_type TEXT,                        -- 'rss'|'api'|'webscrape'
  url TEXT, is_active BOOLEAN DEFAULT TRUE,
  quality_weight FLOAT DEFAULT 1.0,        -- boost/reduce score
  whitelist BOOLEAN DEFAULT TRUE,
  fetch_frequency_mins INT DEFAULT 60,
  last_fetch_at TIMESTAMPTZ,
  config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## API Routes

```
POST /api/sources/pull              # Discover new articles
POST /api/sources/ingest            # Normalize & clean
POST /api/news/score                # LLM classify & rank
POST /api/news/select               # Dedupe & select
POST /api/news/summarise            # Generate summaries
GET  /api/newsletter/today          # Final JSON payload

POST /api/admin/weights             # Adjust ranking weights
POST /api/admin/selection-config    # Per-topic caps
POST /api/admin/reprocess           # Manual trigger
POST /api/admin/pin                 # Pin article to hero
POST /api/admin/ban                 # Exclude domain/article
```

### `/api/newsletter/today` Response

```json
{
  "date": "2025-11-09",
  "hero": [
    {
      "article_id": "uuid",
      "topic": "macro",
      "kicker": "Market Alert",
      "headline": "RBA Signals Potential Rate Cut in 2026",
      "tl_dr": "The RBA hinted at rate cuts in Q1 2026. Current cash rate: 4.35%.",
      "key_points": ["RBA signals flexibility", "Inflation returning to 2-3%", "ASX rallied 1.2%"],
      "why_it_matters": "AU investors should prepare for lower rates affecting bonds & growth stocks.",
      "tickers": ["ASX:XJO"],
      "links": [{"title": "RBA Statement", "url": "..."}]
    }
  ],
  "sections": {
    "stocks": [...],
    "property": [...],
    "macro": [...],
    "crypto": [...],
    "fx": [...],
    "startups": [...]
  },
  "market_card": {
    "asx_200": {"price": 8154.3, "change_pct": 1.2},
    "aud_usd": {"price": 0.6521, "change_pct": -0.3},
    "btc": {"price": 93420, "change_pct": 2.1},
    "yields": {"au_10y_govt": 4.12, "au_3y_govt": 3.85, "us_10y": 4.35}
  },
  "metadata": {
    "total_articles_processed": 152,
    "total_articles_selected": 11,
    "articles_by_topic": {"stocks": 3, "property": 2, "macro": 2, "fx": 1, "crypto": 1, "startups": 2}
  }
}
```

---

## Processing Pipeline

### Stage 1: Discovery (Every 30–60 min)

**Goal:** Poll all sources; detect new articles by URL

```typescript
async function discoverArticles() {
  const sources = await db.query('source_configs', { is_active: true });

  for (const source of sources) {
    try {
      const items = await fetchSource(source); // RSS.parse or API call

      for (const item of items) {
        const exists = await db.findOne('articles', { url: item.url });
        if (!exists) {
          await db.insert('articles', {
            url: item.url,
            source: source.name,
            title: item.title,
            published_at: item.pubDate,
            status: 'raw'
          });
        }
      }

      await db.update('source_configs', source.id, { last_fetch_at: NOW() });
    } catch (error) {
      logger.error(`Failed to fetch ${source.name}`, { error });
    }
  }
}
```

### Stage 2: Ingestion & Normalization (After discovery)

**Goal:** Extract text, compute embeddings, validate quality

```typescript
async function ingestArticles(articleIds: string[]) {
  for (const articleId of articleIds) {
    const article = await db.findOne('articles', { id: articleId });

    try {
      // 1) Resolve URL (follow redirects)
      const finalUrl = await resolveUrl(article.url);

      // 2) Fetch HTML with retry
      const html = await fetchWithRetry(finalUrl, { timeout: 10s, maxRetries: 3 });

      // 3) Extract main content
      const { text } = await extractContent(html);
      const textClean = normalizeText(text);

      // 4) Quality checks
      if (textClean.length < 800) throw new Error('Thin content');
      if (detectLanguage(textClean) !== 'en') throw new Error('Non-English');

      // 5) Compute embedding
      const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: textClean.slice(0, 8000)
      });

      await db.update('articles', articleId, {
        html, text_clean: textClean,
        embedding: embedding.data[0].embedding,
        status: 'clean'
      });
    } catch (error) {
      await db.update('articles', articleId, {
        status: 'failed',
        error_message: error.message
      });
    }
  }
}
```

### Stage 3: Classification & Ranking (Daily @ :55)

**Goal:** LLM scores relevance/quality/impact; compute freshness & uniqueness; weight overall

```typescript
async function scoreArticles() {
  const articles = await db.query('articles', { status: 'clean' });

  for (const article of articles) {
    try {
      // LLM: classify topic and score
      const llmResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: SCORER_SYSTEM_PROMPT },
          { role: 'user', content: `Title: ${article.title}\nSource: ${article.source}\nText:\n${article.text_clean}` }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const { topic, relevance, quality, impact, rationale } = JSON.parse(llmResponse.content);

      // Server-side: freshness (decay over 72h)
      const hoursOld = (NOW() - article.published_at) / 3600000;
      const freshness = Math.max(0, 1 - hoursOld / 72);

      // Server-side: uniqueness (1 - max embedding similarity)
      const neighbors = await db.nearestNeighbors(article.embedding, 3, 1000);
      const uniqueness = neighbors.length > 0
        ? 1 - Math.max(...neighbors.map(n => cosineSimilarity(article.embedding, n.embedding)))
        : 1.0;

      // Weighted overall score
      const overall =
        0.35 * relevance +
        0.20 * quality +
        0.20 * freshness +
        0.15 * impact +
        0.10 * uniqueness;

      await db.insert('article_scores', {
        article_id: article.id,
        topic,
        relevance: clamp(relevance, 0, 1),
        quality: clamp(quality, 0, 1),
        freshness,
        impact: clamp(impact, 0, 1),
        uniqueness,
        overall,
        rationale
      });

      await db.update('articles', article.id, { status: 'scored' });
    } catch (error) {
      logger.error(`Failed to score article ${article.id}`, { error });
    }
  }
}
```

**LLM Prompt (System):**
```
You are a finance news ranker for Australian investors. Classify articles into topics (stocks|property|fx|crypto|macro|startups|other) and score relevance (0-1) and quality (0-1). Be strict: irrelevant or stale items get low scores.
Return JSON: {topic, relevance, quality, impact, rationale}
```

### Stage 4: Selection & Deduplication (Daily @ :57)

**Goal:** Merge near-duplicates, enforce caps, ensure diversity

```typescript
async function selectArticles(config: SelectionConfig) {
  const selectedIds = new Set<string>();

  for (const topic of Object.keys(config)) {
    const { cap } = config[topic];

    // Get top candidates by score
    const candidates = await db.query('article_scores', {
      topic,
      overall: { $gte: config.min_overall_score }
    })
      .sort({ overall: -1 })
      .limit(cap * 2);

    const topicSelected = new Set<string>();
    const sourcesUsed = new Set<string>();

    for (const score of candidates) {
      const article = await db.findOne('articles', { id: score.article_id });

      // Dedup: skip if higher-scoring peer already selected
      const neighbors = await db.nearestNeighbors(article.embedding, 5, 0.85);
      const hasHigherScoringDupe = neighbors.some(n =>
        selectedIds.has(n.id) && (await getScore(n.id)).overall > score.overall
      );
      if (hasHigherScoringDupe) continue;

      // Diversity: max 1 per domain
      const domain = new URL(article.url).hostname;
      if (sourcesUsed.has(domain) || isBlacklisted(domain)) continue;

      topicSelected.add(article.id);
      sourcesUsed.add(domain);

      if (topicSelected.size >= cap) break;
    }

    topicSelected.forEach(id => selectedIds.add(id));
  }

  return { selected_article_ids: Array.from(selectedIds) };
}
```

### Stage 5: Summarisation (Daily @ :58)

**Goal:** Two-pass LLM: fact extract → write TL;DR

```typescript
async function summariseArticles(selectedIds: string[]) {
  for (const articleId of selectedIds) {
    const article = await db.findOne('articles', { id: articleId });

    try {
      // Pass 1: Extract facts
      const factResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: 'Extract: companies, tickers, numbers, dates, quotes. Return JSON.' },
          { role: 'user', content: `Title: ${article.title}\n\nText:\n${article.text_clean}` }
        ],
        temperature: 0,
        response_format: { type: 'json_object' }
      });

      const facts = JSON.parse(factResponse.content);

      // Pass 2: Write TL;DR
      const summaryResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: 'Write 65-90 word TL;DR + 3 bullet points + one-liner "why it matters". Use ONLY facts from JSON. Return JSON.' },
          { role: 'user', content: JSON.stringify({ title: article.title, facts, source: article.source, url: article.url }) }
        ],
        temperature: 0.5,
        response_format: { type: 'json_object' }
      });

      const summary = JSON.parse(summaryResponse.content);

      // Validate: no hallucinated numbers/tickers
      if (!validateSummary(summary, facts)) throw new Error('Summary validation failed');

      const score = await db.findOne('article_scores', { article_id: articleId });

      await db.insert('article_summaries', {
        article_id: articleId,
        topic: score.topic,
        kicker: summary.kicker,
        headline: summary.headline,
        tl_dr: summary.tl_dr,
        key_points: summary.key_points,
        why_it_matters: summary.why_it_matters,
        tickers: facts.tickers,
        links: [{ title: 'Source', url: article.url }, ...(summary.links || [])]
      });

      await db.update('articles', articleId, { status: 'summarised' });
    } catch (error) {
      logger.error(`Failed to summarise article ${articleId}`, { error });
    }
  }
}

function validateSummary(summary: any, facts: any): boolean {
  // Every number in TL;DR must exist in facts.numbers
  const numberRegex = /(\d+(?:\.\d+)?)\s*(%|[A-Z$])/g;
  const numbersInSummary = summary.tl_dr.match(numberRegex) || [];
  const numbersInFacts = facts.numbers?.map((n: any) => n.value) || [];

  return numbersInSummary.every((num: string) =>
    numbersInFacts.some((f: string) => f.includes(num))
  );
}
```

### Stage 6: Assembly & Publication (Daily @ :00)

**Goal:** Build final JSON; publish to `/api/newsletter/today`

```typescript
async function assembleNewsletter(issueDate: string) {
  const summaries = await db.query('article_summaries', {
    created_at: { $gte: issueDate, $lt: addDays(issueDate, 1) }
  });

  const byTopic = groupBy(summaries, 'topic');

  // Hero: top 1-2 overall
  const heroIds = await db.query('article_scores')
    .sort({ overall: -1 })
    .limit(2)
    .pluck('article_id');

  const hero = summaries.filter(s => heroIds.includes(s.article_id));

  // Sections: grouped by topic
  const sections: Record<string, any> = {};
  for (const [topic, articles] of Object.entries(byTopic)) {
    sections[topic] = articles.sort((a, b) => b.overall - a.overall);
  }

  // Market data
  const marketCard = await fetchMarketData();

  const newsletter = {
    date: issueDate,
    hero,
    sections,
    market_card: marketCard,
    metadata: {
      total_articles_processed: await db.count('articles', { created_at: { $gte: issueDate } }),
      total_articles_selected: summaries.length,
      articles_by_topic: Object.fromEntries(
        Object.entries(byTopic).map(([topic, items]) => [topic, items.length])
      )
    }
  };

  await db.insert('newsletter_issues', {
    issue_date: issueDate,
    hero: newsletter.hero,
    sections: newsletter.sections,
    market_card: newsletter.market_card,
    published_at: NOW()
  });

  return newsletter;
}
```

---

## Source Management

### Tier 1 Sources (Free, Real-time)

| Source | Type | Cost | Update | Priority |
|--------|------|------|--------|----------|
| ASX Announcements | RSS | Free | Real-time | ⭐⭐⭐ |
| RBA | RSS | Free | Event-driven | ⭐⭐⭐ |
| APRA | RSS | Free | Event-driven | ⭐⭐⭐ |
| Reuters | API | Free | Real-time | ⭐⭐ |
| Medium Tech | RSS | Free | Real-time | ⭐⭐ |
| Company blogs | RSS | Free | Real-time | ⭐⭐ |

### Tier 2 Sources (Optional, for enrichment)

| Source | Type | Cost | Use Case |
|--------|------|------|----------|
| Tavily | API | $20–200/mo | Web search for explainers |
| EventRegistry | API | Freemium | Global events with sentiment |

---

## Quality Guardrails

### 1. Hallucination Prevention

Every fact in summaries must come from the source.

```typescript
// Validation function
function validateSummary(summary: Summary, facts: Facts): boolean {
  // Check tickers
  for (const ticker of summary.tickers || []) {
    if (!facts.tickers?.includes(ticker)) return false;
  }

  // Check numbers (must exist in facts.numbers)
  const numberRegex = /(\d+(?:\.\d+)?)\s*(%|[A-Z$])/g;
  const numbersInSummary = summary.tl_dr.match(numberRegex) || [];
  const numbersInFacts = facts.numbers.map(n => n.value);

  for (const num of numbersInSummary) {
    if (!numbersInFacts.some(f => f.includes(num))) {
      logger.warn(`Unsourced number: ${num}`);
      return false;
    }
  }

  return true;
}
```

### 2. Content Quality Filters

- **Minimum length:** 800 chars (reject thin content)
- **Language:** Drop non-English
- **Paywall:** Reject `[PAYWALL]` or `[SUBSCRIBER ONLY]`

### 3. Source Credibility

Whitelist trusted sources; blacklist spam.

```typescript
const WHITELIST = ['asxonline.com', 'rba.gov.au', 'reuters.com', ...];
const BLACKLIST = ['get-rich-quick.io', 'crypto-pump.com', ...];

function isBlacklisted(domain: string): boolean {
  return BLACKLIST.some(d => domain.includes(d));
}
```

### 4. Deduplication

Merge articles with embedding cosine similarity > 0.85; keep higher-scoring variant.

### 5. Anomaly Detection

Alert if:
- < 30 articles scored for the day
- All articles in a section have overall < 0.40
- Scoring fails for > 10% of articles
- Key section has 0 articles (e.g., no Stocks)

---

## Performance & Costs

### Latency Targets

| Stage | Target |
|-------|--------|
| Discovery | < 2 min |
| Ingestion | < 30 min |
| Scoring | < 20 min |
| Selection | < 2 min |
| Summarisation | < 15 min |
| Assembly | < 1 min |
| **Total** | **< 70 min** |

### Cost Breakdown (Monthly)

| Component | Cost |
|-----------|------|
| OpenAI API (scoring + summaries) | ~$115 |
| Supabase (Pro, 2GB) | ~$25 |
| Vercel (Pro + Crons) | ~$20 |
| Resend (if > 3k emails) | ~$10 |
| **Total** | **~$170** |

### Token Budget

| Step | Tokens/day |
|------|-----------|
| Scoring (150 articles @ 1.5K ea) | 225K |
| Fact extraction (11 @ 1.2K ea) | 13.2K |
| Newsletter write (11 @ 800 ea) | 8.8K |
| **Daily total** | **247K (~$3.71)** |

---

## Tuning Knobs

### 1. Ranking Weights

Adjust via `/api/admin/weights`:

```json
{
  "relevance_weight": 0.35,
  "quality_weight": 0.20,
  "freshness_weight": 0.20,
  "impact_weight": 0.15,
  "uniqueness_weight": 0.10
}
```

**When to adjust:**
- Earnings season → increase `impact_weight`
- Market volatility → increase `relevance_weight`
- Older content → decrease `freshness_weight`

### 2. Per-Topic Caps

```json
{
  "stocks": { "cap": 3, "include_explainer": true },
  "property": { "cap": 2 },
  "macro": { "cap": 2 },
  "fx": { "cap": 1 },
  "crypto": { "cap": 1 },
  "startups": { "cap": 2 }
}
```

### 3. Minimum Score Threshold

```json
{
  "min_overall_score": 0.45
}
```

Raise if too many low-quality articles; lower if too few.

### 4. Embedding Similarity Threshold

```json
{
  "dedup_threshold": 0.85
}
```

Higher = stricter dedup; lower = merge more aggressively.

---

## Monitoring

### Key Metrics Dashboard

```
Daily digest:
- Articles discovered: 150
- Articles ingested: 147
- Articles scored: 147
- Articles selected: 11
- Articles summarised: 11

By topic:
- Stocks: 3 (avg score: 0.68)
- Property: 2 (avg score: 0.62)
- Macro: 2 (avg score: 0.71)
- Crypto: 1 (avg score: 0.54)

Health:
- Ingestion success: 98%
- Scoring success: 100%
- Summarisation success: 100%
- Dedup merges: 3
- Pipeline duration: 65 min
- Token usage: 247K
```

### Debug Queries

```sql
-- Low-scoring but potentially relevant articles
SELECT id, title, overall FROM article_scores
WHERE topic = 'stocks' AND overall < 0.5
ORDER BY overall DESC;

-- Dedup conflicts
SELECT article_id, dedup_winner_article_id, reason
FROM article_selections
WHERE selected = false AND reason LIKE 'Excluded: duplicate%';

-- Failed ingestions
SELECT id, title, source, error_message FROM articles
WHERE status = 'failed'
ORDER BY created_at DESC;
```

---

## Code Structure

```
apps/web/src/
├── app/api/premium/
│   ├── sources/pull/route.ts
│   ├── sources/ingest/route.ts
│   ├── news/score/route.ts
│   ├── news/select/route.ts
│   ├── news/summarise/route.ts
│   ├── newsletter/today/route.ts
│   └── admin/[action]/route.ts
│
├── lib/services/
│   ├── articleService.ts         # discover, ingest
│   ├── scoringService.ts         # LLM ranking
│   ├── selectionService.ts       # dedup, diversity
│   ├── summaryService.ts         # LLM summaries
│   ├── assemblyService.ts        # build newsletter
│   └── emailService.ts           # delivery
│
├── lib/db/
│   ├── schema.ts                 # types
│   ├── supabase.ts               # client
│   └── migrations/               # SQL schemas
│
├── lib/prompts/
│   ├── scorer.ts                 # scoring prompts
│   ├── factExtractor.ts
│   └── newsWriter.ts
│
├── lib/utils/
│   ├── validation.ts             # schema validation
│   ├── retry.ts                  # exponential backoff
│   ├── logging.ts                # structured logs
│   └── dedup.ts                  # embedding similarity
│
└── lib/constants.ts              # weights, thresholds
```

### TypeScript Types

```typescript
type Article = {
  id: string;
  url: string;
  source: string;
  published_at: Date;
  title: string;
  text_clean?: string;
  embedding?: number[];
  status: 'raw' | 'clean' | 'scored' | 'summarised' | 'failed';
  error_message?: string;
  created_at: Date;
};

type ArticleScore = {
  article_id: string;
  topic: 'stocks' | 'property' | 'fx' | 'crypto' | 'macro' | 'startups';
  relevance: number;  // [0, 1]
  quality: number;
  freshness: number;
  impact: number;
  uniqueness: number;
  overall: number;
  scored_at: Date;
};

type ArticleSummary = {
  article_id: string;
  topic: string;
  headline: string;
  tl_dr: string;
  key_points: string[];
  why_it_matters: string;
  tickers?: string[];
  links: { title: string; url: string }[];
};
```

---

## Cron Schedule

```yaml
Every 30 min @ :00    POST /api/sources/pull      # discover
Every 30 min @ :15    POST /api/sources/ingest    # normalize
Daily @ :55           POST /api/news/score        # rank
Daily @ :57           POST /api/news/select       # dedupe
Daily @ :58           POST /api/news/summarise    # summarize
Daily @ :00 (next)    GET  /api/newsletter/today  # publish
```

---

## Error Handling

```typescript
class PipelineError extends Error {
  constructor(
    public stage: string,
    public code: string,
    message: string,
    public context?: Record<string, any>
  ) {
    super(message);
  }
}

// Retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delayMs = 1000 * Math.pow(2, attempt);
      await sleep(delayMs);
    }
  }
}
```

---

## Summary

**Backend Goal:** Transform raw financial news into a curated, ranked, summarised daily newsletter with zero hallucinations and 95%+ citation accuracy.

**Core Promise:** Every article is picked by algorithm. Every fact is sourced. Every summary is verified.

**Key Principle:** Better 8 great articles than 15 mediocre ones.

---

**Last updated:** 2025-11-09
**Next review:** After Phase 1 launch (Week 4)
