# Gekkos Newsletter Platform - Onboarding Guide

Welcome to Gekkos! This guide explains how all parts of the project work together to deliver daily financial newsletters.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [System Components](#system-components)
3. [Data Flow](#data-flow)
4. [Getting Started](#getting-started)
5. [Running the Project](#running-the-project)
6. [Key Concepts](#key-concepts)
7. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

Gekkos is a **monorepo** with two main applications and several shared packages:

```
┌─────────────────────────────────────────────────────────┐
│                    WEB APPLICATION                      │
│              (Next.js 14 - Frontend)                    │
│  - User-facing dashboard                                │
│  - Display newsletters                                  │
│  - Real-time data updates                               │
│  - Queue job submission                                 │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ HTTP / Redis Queue
                   ▼
┌──────────────────────────────────────────────────────────┐
│              BACKGROUND WORKER                           │
│          (Node.js - Backend Processing)                 │
│  - Fetch market data                                     │
│  - Aggregate news                                        │
│  - Generate content with AI                             │
│  - Assemble newsletters                                  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ Prisma ORM
                   ▼
┌──────────────────────────────────────────────────────────┐
│           POSTGRESQL DATABASE                            │
│  - Newsletters                                           │
│  - Articles                                              │
│  - Market data cache                                     │
│  - Quotes and graphics                                   │
└──────────────────────────────────────────────────────────┘

                   │
                   │ Redis
                   ▼
┌──────────────────────────────────────────────────────────┐
│              REDIS QUEUE (BullMQ)                        │
│  - Job orchestration                                     │
│  - Retry management                                      │
│  - Job history                                           │
└──────────────────────────────────────────────────────────┘
```

---

## System Components

### 1. **Frontend Web App** (`apps/web`)

**Purpose**: User-facing interface for viewing newsletters

**Key Features**:
- Display daily newsletters
- Real-time market data
- Responsive design
- Queue job submission

**Technology**:
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Recharts for data visualization

**Endpoints**:
- `/` - Homepage/newsletter viewer
- `/api/newsletter/[date]` - Get newsletter for a date
- `/api/market-data` - Fetch live market data
- `/api/jobs/enqueue` - Queue a job

---

### 2. **Background Worker** (`apps/worker`)

**Purpose**: Process data, generate content, and build newsletters

**Key Services**:

#### Market Data Service
- Fetches stock prices, indices, crypto prices
- Integrates with Yahoo Finance and CoinGecko APIs
- Caches data to avoid rate limiting
- Fallback to mock data if APIs fail

**Files**: `src/services/market-data/index.ts`

#### News Service
- Aggregates news from multiple sources
- Supports categories: property, stocks, crypto, economy, technology
- Mock data for initial setup (integrate with real RSS/APIs later)

**Files**: `src/services/news/index.ts`

#### Content Generator
- Uses OpenAI or Anthropic APIs
- Generates trading section summaries
- Summarizes articles
- Creates category insights
- Fallback to template content if AI unavailable

**Files**: `src/services/content/generator.ts`

#### Newsletter Builder
- Assembles all content into complete newsletter
- Saves to database
- Publishes newsletter
- Manages quote of the day

**Files**: `src/services/content/builder.ts`

#### Job Handlers
- Handle different job types
- Orchestrate the entire process
- Implement retry logic

**Files**: `src/jobs/handlers.ts`

**Technology**:
- Node.js + TypeScript
- BullMQ for job queue
- Redis for queue backend
- Prisma ORM for database
- OpenAI/Anthropic SDKs for AI

---

### 3. **Job Queue System** (Redis + BullMQ)

**Purpose**: Reliable, scalable background job processing

**Queue Structure**:

```
┌─────────────────────────────────────────────┐
│       NEWSLETTER GENERATION QUEUE            │
│  (newsletter-generation)                    │
│                                             │
│  Jobs:                                      │
│  - daily-orchestration (main orchestrator)  │
│  - generate-newsletter (content assembly)   │
│  - publish-newsletter (mark as published)   │
└─────────────────────────────────────────────┘
           ↑                    ↑
           │                    │
           │ depends on         │ depends on
           │                    │
┌──────────────────────────────────────────────┐
│    CONTENT FETCH QUEUE                       │
│  (content-fetch)                            │
│                                             │
│  Jobs:                                      │
│  - fetch-markets (market data)              │
│  - fetch-news (news aggregation)            │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│    CONTENT SUMMARIZE QUEUE                   │
│  (content-summarize)                        │
│                                             │
│  Jobs:                                      │
│  - summarize-articles (AI summarization)    │
└──────────────────────────────────────────────┘
```

**Retry Logic**:
- Exponential backoff strategy
- Different retry counts for different queues
- Failed jobs kept for 7 days for analysis

---

### 4. **Shared Packages**

#### `packages/database`
- Prisma schema definition
- Database client
- Models: Newsletter, Article, MarketData, CryptoData, Quote, Graphic

**Usage**:
```typescript
import { prisma } from '@newsletter/database';

const newsletter = await prisma.newsletter.findUnique({
  where: { date: today }
});
```

#### `packages/types`
- Shared TypeScript interfaces
- Newsletter, Article, MarketIndex, Stock types

#### `packages/constants`
- Stock symbols (Big 4 banks, indices, crypto)
- News sources
- API endpoints

#### `packages/utils`
- Formatting utilities (currency, date, percentage, numbers)
- Used throughout both web and worker apps

---

## Data Flow

### Daily Newsletter Generation Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. TRIGGER                                                  │
│    Scheduled job (via cron/API) triggers daily-orchestration│
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. FETCH DATA (Parallel)                                    │
│    ├─ fetch-markets: Get stock prices, indices, crypto      │
│    └─ fetch-news: Aggregate news from sources               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. SUMMARIZE CONTENT                                        │
│    ├─ AI summarizes each article                            │
│    └─ Generates category insights                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. GENERATE NEWSLETTER                                      │
│    ├─ Combine all content                                   │
│    ├─ Generate trading section                              │
│    ├─ Add quote of the day                                  │
│    └─ Save to database                                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. PUBLISH                                                  │
│    ├─ Mark newsletter as published                          │
│    └─ Make available on frontend                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. DISPLAY                                                  │
│    ├─ Web app displays newsletter                           │
│    └─ Users view daily content                              │
└─────────────────────────────────────────────────────────────┘
```

### Real-Time Data Updates

```
┌─────────────────────────────────────────────┐
│ Frontend makes API call every 5 minutes      │
│ GET /api/market-data                        │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ API fetches current market data from:        │
│ - Yahoo Finance (stocks, indices)            │
│ - CoinGecko (crypto prices)                  │
│ - Database cache (fallback)                  │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ Frontend updates display in real-time        │
│ - Price changes                              │
│ - Percentage gains/losses                    │
│ - Color coding (green/red)                   │
└─────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

```bash
# Check Node.js version (18+)
node --version

# Check pnpm version (8+)
pnpm --version

# Ensure PostgreSQL is running
psql --version

# Ensure Redis is running
redis-cli ping
```

### Environment Setup

1. **Clone and Install**:
```bash
cd E:\dev\AiaaS\vivacity-digital-dev\newsletter-daily-prod

# Install dependencies
pnpm install
```

2. **Configure Environment Variables**:
```bash
# Create .env file in project root
touch .env

# Add required variables:
# DATABASE_URL=postgresql://user:password@localhost:5432/gekkos
# REDIS_URL=redis://localhost:6379
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=...
```

3. **Setup Database**:
```bash
# Run migrations
pnpm db:push

# Seed with sample data (optional)
pnpm db:seed
```

---

## Running the Project

### Development Mode

```bash
# Run all apps together
pnpm dev

# Or run individually:
pnpm dev --filter=web      # Frontend only
pnpm dev --filter=worker   # Worker only
```

### Production Build

```bash
# Build all apps
pnpm build

# Start web app
cd apps/web
pnpm start

# Start worker (in another terminal)
cd apps/worker
pnpm start
```

### Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Linting & Type Checking

```bash
# Lint all code
pnpm lint

# Type check
pnpm typecheck

# Format code
pnpm format
```

---

## Key Concepts

### 1. **Job Queue Pattern**

Jobs are units of work that are added to a queue and processed asynchronously:

```typescript
// Queue a job
await newsletterQueue.add('generate-newsletter', {
  marketData: { ... },
  news: [ ... ]
});

// Worker processes it
const worker = new Worker('newsletter-generation', async (job) => {
  // Do work here
  return result;
});
```

**Why use queues?**
- Decouple web app from heavy processing
- Handle failures gracefully with retries
- Scale processing independently
- Persist job history

### 2. **Monorepo Structure**

A single repository with multiple packages:

```
newsletter-daily-prod/
├── apps/
│   ├── web/        # Next.js frontend
│   └── worker/     # Node.js backend
├── packages/
│   ├── database/   # Shared ORM
│   ├── types/      # Shared types
│   ├── utils/      # Shared utilities
│   └── constants/  # Shared constants
└── turbo.json      # Monorepo config
```

**Benefits**:
- Shared code between apps
- Consistent versions
- Single test/lint command
- Easier refactoring

### 3. **AI Integration**

Content is generated using AI with fallbacks:

```typescript
// Try OpenAI first
if (openaiClient) {
  return await openaiClient.chat.completions.create(...);
}

// Fall back to Anthropic
if (anthropicClient) {
  return await anthropicClient.messages.create(...);
}

// Fall back to templates
return fallbackContent;
```

**Why fallbacks?**
- Resilience if one API is down
- Cost optimization (cheaper alternatives)
- Testing without API calls

### 4. **Database Models**

Core data structures:

```prisma
model Newsletter {
  id              String
  date            DateTime
  published       Boolean
  tradingData     Json       // Market indices, stocks
  propertyData    Json       // Property insights
  // ... other sections
}

model Article {
  id              String
  title           String
  summary         String
  category        String     // property|stocks|crypto|economy|technology
}

model MarketData {
  id              String
  symbol          String
  price           Float
  change          Float
}
```

---

## Troubleshooting

### Issue: Redis Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solution**:
```bash
# Start Redis
redis-server

# Or check if it's running:
redis-cli ping
```

### Issue: Database Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**:
```bash
# Start PostgreSQL
# On Windows: search for "Services" and start PostgreSQL
# On Mac: brew services start postgresql
# On Linux: sudo systemctl start postgresql

# Or verify connection string in .env
DATABASE_URL=postgresql://user:password@localhost:5432/gekkos
```

### Issue: API Rate Limiting

```
Error: 429 Too Many Requests
```

**Solution**:
- The worker implements automatic retries with exponential backoff
- Check API rate limits in service files
- Use mock data during development (already implemented)

### Issue: Jobs Not Processing

```
Worker started but jobs not executing
```

**Solutions**:
1. Check if Redis is running: `redis-cli ping`
2. Check logs for errors: `pnpm dev --filter=worker`
3. Verify job names match handler names
4. Check job data format

### Issue: Memory Usage Growing

**Solution**:
The worker automatically removes old completed jobs:
- Keeps last 100 completed jobs (24 hours)
- Keeps failed jobs for 7 days (analysis)
- Configure in `src/queue/queues.ts`

---

## Next Steps

1. **Setup Development Environment**: Follow Getting Started section
2. **Integrate Real Data Sources**: Replace mock data with real APIs
3. **Configure Email**: Add email delivery system
4. **Setup Scheduling**: Add cron jobs for daily execution
5. **Monitoring**: Set up error tracking and logging

---

## Documentation Files

- **[README.md](./README.md)** - Project overview
- **[ONBOARDING.md](./ONBOARDING.md)** - This file
- **docs/ARCHITECTURE.md** - Detailed system design
- **docs/WORKER_JOBS.md** - Job documentation
- **docs/API.md** - API endpoints
- **docs/DATA_SOURCES.md** - Data source integration

---

## Support

For issues or questions:
1. Check this guide's troubleshooting section
2. Review code comments in relevant files
3. Check logs: `pnpm dev` shows all output
4. Create an issue in the project repository

---

**Last Updated**: November 2024
**Version**: 1.0.0
**Status**: Beta (Ready for live deployment)
