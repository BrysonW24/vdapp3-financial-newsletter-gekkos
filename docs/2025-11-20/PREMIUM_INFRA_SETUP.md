# 🔧 Premium Intelligence Features - Infrastructure Setup Guide

This guide walks through setting up the complete infrastructure for Premium Intelligence Features (Thought Leadership Briefs, Strategic Moat Finder, Disruption Radar).

---

## 📋 Prerequisites

- Node.js 18+
- pnpm installed
- Supabase account (free tier OK for development)
- OpenAI API key (GPT-4o access)
- GitHub account (for Actions/secrets)

---

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → Log in / Sign up
2. Click "New Project"
3. **Name**: `newsletter-premium-dev`
4. **Database Password**: Save securely in password manager
5. **Region**: Select closest to your deployment region (e.g., US-East for Vercel)
6. Click "Create new project" (takes ~2 min)

### 1.2 Get Connection Details

Once project loads:
- Go to **Settings → Database**
- Note these values (save in `.env.local`):
  - Connection string: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`
  - Direct URL: `postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

### 1.3 Run Database Migrations

```bash
# Copy the SQL below into Supabase SQL Editor and execute

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT NOT NULL,
  source_url TEXT,
  category TEXT DEFAULT 'general',
  published_at TIMESTAMP,
  fetched_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_documents_source ON documents(source);
CREATE INDEX idx_documents_published ON documents(published_at DESC);
CREATE INDEX idx_documents_category ON documents(category);

-- 3. Document embeddings (pgvector)
CREATE TABLE IF NOT EXISTS document_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  embedding vector(3072),  -- OpenAI text-embedding-3-large dimension
  chunk_text TEXT NOT NULL,
  chunk_index INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_embeddings_document ON document_embeddings(document_id);
CREATE INDEX idx_embeddings_similarity ON document_embeddings
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 4. Generated briefs
CREATE TABLE IF NOT EXISTS briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  brief_type TEXT NOT NULL,  -- 'thought_leadership' | 'moat_finder' | 'disruption_radar'
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  pdf_url TEXT,
  status TEXT DEFAULT 'generated',  -- 'generating' | 'generated' | 'failed'
  error_message TEXT,
  tokens_used INT DEFAULT 0,
  cost_cents INT DEFAULT 0,
  generated_at TIMESTAMP DEFAULT NOW(),
  source_documents TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_briefs_user ON briefs(user_id);
CREATE INDEX idx_briefs_type ON briefs(brief_type);
CREATE INDEX idx_briefs_generated ON briefs(generated_at DESC);

-- 5. User subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free',  -- 'free' | 'pro' | 'enterprise'
  status TEXT DEFAULT 'active',
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  monthly_briefs_used INT DEFAULT 0,
  monthly_briefs_limit INT,
  cumulative_cost_cents INT DEFAULT 0,
  cumulative_cost_limit_cents INT,
  renews_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- 6. API usage logs (for analytics)
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  brief_type TEXT,
  tokens_input INT,
  tokens_output INT,
  cost_cents INT,
  latency_ms INT,
  status TEXT,  -- 'success' | 'error'
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_usage_user ON api_usage_logs(user_id);
CREATE INDEX idx_api_usage_created ON api_usage_logs(created_at DESC);

-- 7. Data sources configuration
CREATE TABLE IF NOT EXISTS data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  source_type TEXT NOT NULL,  -- 'news_api' | 'rss' | 'youtube' | 'arxiv' | 'custom'
  endpoint TEXT,
  api_key_encrypted TEXT,
  config JSONB DEFAULT '{}',
  enabled BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMP,
  sync_interval_minutes INT DEFAULT 60,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_data_sources_enabled ON data_sources(enabled);

-- 8. Sync jobs (for tracking ingestion)
CREATE TABLE IF NOT EXISTS sync_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_source_id UUID NOT NULL REFERENCES data_sources(id),
  status TEXT DEFAULT 'pending',  -- 'pending' | 'running' | 'completed' | 'failed'
  documents_fetched INT DEFAULT 0,
  documents_processed INT DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sync_jobs_source ON sync_jobs(data_source_id);
CREATE INDEX idx_sync_jobs_status ON sync_jobs(status);
```

---

## Step 2: Environment Variables

### 2.1 Create `.env.local`

```bash
cd apps/web
cp .env.example .env.local
```

### 2.2 Add Premium Feature Variables

```env
# Supabase
SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]

# OpenAI
OPENAI_API_KEY=[YOUR_OPENAI_KEY]
OPENAI_EMBEDDING_MODEL=text-embedding-3-large
OPENAI_GENERATION_MODEL=gpt-4o-2024-11-20

# Data Sources
NEWS_API_KEY=[GET FROM newsapi.org - free tier]
TAVILY_API_KEY=[GET FROM tavily.com - free tier for testing]

# Optional: YouTube (fallback to non-auth transcript API)
YOUTUBE_API_KEY=[optional]

# Email
RESEND_API_KEY=[GET FROM resend.com]
SENDGRID_API_KEY=[optional]

# Stripe (for payments)
STRIPE_SECRET_KEY=[GET FROM stripe.com]
STRIPE_PUBLISHABLE_KEY=[GET FROM stripe.com]
STRIPE_WEBHOOK_SECRET=[FROM webhook settings]

# Analytics
LANGFUSE_PUBLIC_KEY=[GET FROM langfuse.com]
LANGFUSE_SECRET_KEY=[GET FROM langfuse.com]
POSTHOG_API_KEY=[GET FROM posthog.com]

# Feature flags
ENABLE_PREMIUM_FEATURES=true
PREMIUM_DEBUG_MODE=false
```

---

## Step 3: Install Dependencies

```bash
# From project root
pnpm install

# Add new packages
pnpm add langchain openai @langchain/openai zod
pnpm add @supabase/supabase-js
pnpm add react-pdf pdfkit
pnpm add resend
pnpm add stripe
pnpm add langfuse posthog-js
```

---

## Step 4: Create API Stubs

```bash
# Create directory structure
mkdir -p apps/web/src/app/api/premium/{briefs,intelligence,chat,sources,admin}

# Create route files (stubs)
touch apps/web/src/app/api/premium/briefs/generate/route.ts
touch apps/web/src/app/api/premium/briefs/list/route.ts
touch apps/web/src/app/api/premium/intelligence/thought-leadership/route.ts
touch apps/web/src/app/api/premium/intelligence/moat-finder/route.ts
touch apps/web/src/app/api/premium/intelligence/disruption-radar/route.ts
touch apps/web/src/app/api/premium/chat/route.ts
touch apps/web/src/app/api/premium/sources/sync/route.ts
touch apps/web/src/app/api/cron/ingest-daily/route.ts
```

---

## Step 5: Test the Setup

### 5.1 Test Database Connection

```bash
# Create a test script
cat > test-db.js << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

async function test() {
  const { data, error } = await supabase
    .from('documents')
    .select('count(*)')

  if (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }

  console.log('✅ Database connection successful')
  console.log('Document count:', data)
}

test()
EOF

# Run test
node --loader ts-node/esm test-db.js
```

### 5.2 Test OpenAI Connection

```bash
# Create test script
cat > test-openai.js << 'EOF'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

const model = openai('gpt-4o-2024-11-20')

async function test() {
  try {
    const response = await generateText({
      model,
      messages: [
        {
          role: 'user',
          content: 'Say "Hello from Vivacity Premium" in one sentence.',
        },
      ],
    })

    console.log('✅ OpenAI connection successful')
    console.log('Response:', response.text)
  } catch (error) {
    console.error('OpenAI connection failed:', error)
    process.exit(1)
  }
}

test()
EOF

# Run test
node --loader ts-node/esm test-openai.js
```

---

## Step 6: Set Up Data Ingestion

### 6.1 Create NewsAPI Ingestion Service

```typescript
// apps/web/src/lib/services/ingestionService.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function ingestNewsAPI(topic: string) {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&sortBy=publishedAt&pageSize=20`,
    {
      headers: {
        'X-API-Key': process.env.NEWS_API_KEY!,
      },
    }
  )

  const data = await response.json()

  // Insert documents into Supabase
  const documents = data.articles.map((article: any) => ({
    title: article.title,
    content: article.description || article.content,
    source: article.source.name,
    source_url: article.url,
    published_at: article.publishedAt,
    category: 'news',
    metadata: {
      image_url: article.urlToImage,
      author: article.author,
    },
  }))

  const { error } = await supabase
    .from('documents')
    .insert(documents)

  if (error) throw error

  return documents.length
}
```

### 6.2 Set Up Vercel Cron Job

```typescript
// apps/web/src/app/api/cron/ingest-daily/route.ts
import { NextResponse } from 'next/server'
import { ingestNewsAPI } from '@/lib/services/ingestionService'

export const runtime = 'nodejs'

// Runs at 6 AM UTC daily
export async function GET(req: Request) {
  // Verify cron secret
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const topics = [
      'artificial intelligence',
      'startup funding',
      'market disruption',
      'technology trends',
    ]

    const results = await Promise.all(
      topics.map((topic) => ingestNewsAPI(topic))
    )

    const totalDocuments = results.reduce((a, b) => a + b, 0)

    return NextResponse.json({
      success: true,
      message: `Ingested ${totalDocuments} documents`,
    })
  } catch (error) {
    console.error('Ingestion cron failed:', error)
    return NextResponse.json(
      { error: 'Ingestion failed' },
      { status: 500 }
    )
  }
}
```

---

## Step 7: Deploy to Vercel

### 7.1 Add Secrets to Vercel

```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY
vercel env add NEWS_API_KEY
vercel env add CRON_SECRET
# ... (add all env vars)
```

### 7.2 Configure Cron Jobs

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/ingest-daily",
      "schedule": "0 6 * * *"  // 6 AM UTC daily
    }
  ]
}
```

### 7.3 Deploy

```bash
git add .
git commit -m "feat: premium intelligence features infrastructure"
git push origin main
# Vercel auto-deploys!
```

---

## Step 8: Test End-to-End

### 8.1 Manual Brief Generation

```bash
curl -X POST http://localhost:3000/api/premium/briefs/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "thought_leadership",
    "topic": "AI in Healthcare 2024"
  }'
```

### 8.2 Check Database

```sql
-- In Supabase SQL Editor
SELECT * FROM documents LIMIT 10;
SELECT * FROM briefs ORDER BY created_at DESC LIMIT 1;
SELECT COUNT(*) FROM document_embeddings;
```

---

## Next Steps

1. **Build Frontend Dashboard** (`/premium` page)
2. **Implement PDF Export** (react-pdf)
3. **Add Stripe Integration** (payment processing)
4. **Set Up Chat Strategist** (RAG + streaming)
5. **Monitoring & Analytics** (Sentry, LangFuse)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| pgvector not found | Run `CREATE EXTENSION vector;` first |
| OpenAI rate limit | Add delays between requests, use queue |
| Supabase connection timeout | Check firewall, increase pool connections |
| Missing embeddings | Run embedding job: `POST /api/cron/embed` |

---

**Need help?** Check:
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [LangChain Docs](https://js.langchain.com/)
- [OpenAI API Docs](https://platform.openai.com/docs)
