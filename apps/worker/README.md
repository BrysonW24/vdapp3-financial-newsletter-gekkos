# Gekkos Newsletter Worker

Background processing engine for automated daily newsletter generation.

## Overview

The worker handles all resource-intensive tasks:
- **Market Data Fetching**: Real-time stock prices, indices, and cryptocurrency prices
- **News Aggregation**: Articles from multiple sources across different categories
- **AI Content Generation**: OpenAI/Anthropic integration for intelligent summaries and insights
- **Newsletter Assembly**: Combines all content into complete, publishable newsletters
- **Job Orchestration**: BullMQ-based job queue with retry logic and failure handling

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Installation & Running

```bash
# Install dependencies
pnpm install

# Set up database
pnpm db:push

# Development with hot reload
pnpm dev

# Production build and start
pnpm build
pnpm start
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gekkos

# Redis Queue
REDIS_URL=redis://localhost:6379

# AI Providers (at least one required)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=claude-...

# Optional
AI_PROVIDER=openai      # Default: openai
DEBUG=false            # Enable debug logging
```

## Architecture

### Three-Queue Job System

```
Content Fetch Queue          Content Summarize Queue       Newsletter Queue
├── fetch-markets (3s)       ├── summarize-articles        ├── daily-orchestration
└── fetch-news (3s)          └── (2s)                      ├── generate-newsletter (1s)
                                                            └── publish-newsletter
```

**Legend**: (Ns) = concurrency level

| Queue | Purpose | Concurrency | Retries | Cleanup |
|-------|---------|-------------|---------|---------|
| `content-fetch` | Raw data collection | 3 | 2 | 500 jobs / 12 hrs |
| `content-summarize` | Content enrichment | 2 | 3 | 500 jobs / 12 hrs |
| `newsletter-generation` | Assembly & publishing | 1 | 3 | 100 jobs / 24 hrs |

### Service Architecture

```
src/
├── queue/                    # BullMQ Configuration
│   ├── connection.ts        # Redis connection
│   ├── queues.ts            # Queue definitions
│   └── worker.ts            # Placeholder
├── services/
│   ├── market-data/         # Yahoo Finance, CoinGecko
│   ├── news/                # News aggregation
│   └── content/
│       ├── generator.ts     # AI-powered generation
│       └── builder.ts       # Newsletter assembly
├── jobs/
│   └── handlers.ts          # Job processors
├── utils/
│   └── logger.ts            # Logging
└── index.ts                 # Worker entry point
```

## Services

### Market Data Service
**File**: `src/services/market-data/index.ts`

Fetches real-time financial data:
- **Stock Indices**: ASX 200, S&P 500, Nikkei 225, FTSE 100
- **Big 4 Banks**: CBA, WBC, NAB, ANZ
- **Cryptocurrencies**: BTC, ETH, BNB, SOL (via CoinGecko API)

Features:
- Fallback to mock data if APIs fail
- Caching to prevent rate limiting
- Parallel data fetching

### News Service
**File**: `src/services/news/index.ts`

Aggregates news from multiple categories:
- Property market insights
- Stock market analysis
- Cryptocurrency trends
- Economic indicators
- Technology news

Currently uses mock data (ready to integrate with RSS/News APIs).

### Content Generator
**File**: `src/services/content/generator.ts`

AI-powered content creation with fallbacks:
- **Trading Section**: Market summary with key points
- **Category Insights**: AI analysis of top articles
- **Article Summaries**: Condensed news summaries
- **Fallback Content**: Template-based content if AI unavailable

Supports both OpenAI GPT-3.5 and Anthropic Claude.

### Newsletter Builder
**File**: `src/services/content/builder.ts`

Assembles complete newsletters:
- Combines all section data
- Manages quote of the day
- Saves to PostgreSQL
- Handles publication state
- Updates article database

## Job Handlers

**File**: `src/jobs/handlers.ts`

Available jobs:

```typescript
handleFetchMarkets()        // Market data fetching
handleFetchNews()          // News aggregation
handleGenerateNewsletter() // Newsletter assembly
handleSummarizeArticles()  // Article summarization
handlePublishNewsletter()  // Mark as published
handleDailyOrchestration() // Main orchestrator
```

## Data Flow

### Daily Newsletter Generation

```
Daily Orchestration Job
    │
    ├─→ Fetch Markets Job       ─→ Market data from Yahoo Finance / CoinGecko
    └─→ Fetch News Job           ─→ Articles from multiple sources
         │
         └─→ Summarize Articles Job
              │
              └─→ Generate Newsletter Job  ─→ Save to Database
                   │
                   └─→ Publish Newsletter Job  ─→ Make available on web
```

### Real-Time Updates

Frontend polls every 5 minutes:
```
Frontend Request
    └─→ API endpoint
         └─→ Fetch from Yahoo Finance / CoinGecko
              └─→ Update display with latest prices
```

## Logging

Structured, timestamped logging:

```
[INFO] 2024-01-15T09:00:00.000Z - Market data fetch completed
[WARN] 2024-01-15T09:00:05.000Z - Retrying Redis connection...
[ERROR] 2024-01-15T09:00:10.000Z - Failed to fetch crypto prices
[DEBUG] 2024-01-15T09:00:15.000Z - Job data: {...}  (DEBUG=true only)
```

Enable debugging:
```bash
DEBUG=true pnpm dev
```

## Testing Jobs Locally

```bash
# Start Redis and PostgreSQL
redis-server
psql -c "CREATE DATABASE gekkos;"

# In first terminal
pnpm dev

# In second terminal, queue a test job
node -e "
const { newsletterQueue } = require('./dist/queue/queues.js');
newsletterQueue.add('daily-orchestration', {});
"
```

Watch the worker process the job in the first terminal.

## Configuration

### Customize Queue Settings

Edit `src/queue/queues.ts`:

```typescript
export const contentFetchQueue = new Queue(QUEUE_NAMES.CONTENT_FETCH, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,           // Retry count
    backoff: {
      type: 'exponential',
      delay: 1000,         // Initial delay
    },
    removeOnComplete: {
      count: 500,          // Max completed jobs to keep
      age: 12 * 3600,     // Max age (seconds)
    },
  },
});
```

### Adjust Worker Concurrency

Edit `src/index.ts`:

```typescript
const contentFetchWorker = new Worker(..., {
  connection: redisConnection,
  concurrency: 3,  // Max parallel jobs
});
```

## Adding New Jobs

1. Create handler in `src/jobs/handlers.ts`:
```typescript
export async function handleMyJob(job: Job): Promise<any> {
  logger.info(`Processing ${job.name}...`);
  // Implementation
  return { success: true };
}
```

2. Register in worker in `src/index.ts`:
```typescript
switch (job.name) {
  case 'my-job':
    return handleMyJob(job);
}
```

3. Queue from web app or elsewhere:
```typescript
await myQueue.add('my-job', { /* data */ });
```

## Performance Tips

- **Parallel Processing**: Market and news fetch run simultaneously
- **Data Caching**: Prevents excessive API calls
- **Job Cleanup**: Automatic removal of old jobs prevents memory bloat
- **Retry Strategy**: Exponential backoff reduces server load

## Deployment

### Environment

Set these before deploying:
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis server
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
- `NODE_ENV=production`

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build
CMD ["pnpm", "start"]
```

### Railway/Render

```bash
pnpm build
pnpm start
```

## Troubleshooting

### Redis Connection Failed
```
Error: connect ECONNREFUSED
```
Ensure Redis is running: `redis-cli ping`

### Database Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
Check `DATABASE_URL` in `.env` and ensure PostgreSQL is running.

### Jobs Not Processing
1. Check worker is running and shows startup message
2. Verify Redis connection: `redis-cli ping` → `PONG`
3. Check database connectivity
4. Review logs for errors

### High Memory Usage
Jobs are auto-cleaned. If still high:
- Check Redis memory: `redis-cli INFO memory`
- Reduce `removeOnComplete.count` in queue config
- Monitor with: `node --inspect` for profiling

## Commands

```bash
pnpm dev              # Development with hot reload
pnpm build            # Compile TypeScript
pnpm start            # Run compiled worker
pnpm lint             # Code style check
pnpm typecheck        # Type validation
pnpm test             # Run tests
pnpm test:watch       # Test watch mode
```

## Useful Tools

```bash
redis-cli             # Redis command line
psql -d gekkos        # PostgreSQL CLI
WATCH='src' npm test  # Watch and test
```

## Integration Points

- **Database**: Prisma ORM (PostgreSQL)
- **Queue**: BullMQ (Redis)
- **Market Data**: Yahoo Finance, CoinGecko
- **News**: Mock (ready for RSS/APIs)
- **AI**: OpenAI or Anthropic APIs
- **Frontend**: Web app queues jobs via API

## Next Steps

1. Integrate real news sources (RSS feeds, news APIs)
2. Add cron scheduling for daily execution
3. Implement email delivery
4. Add error monitoring (Sentry)
5. Set up performance monitoring

## See Also

- [Main README](../../README.md)
- [Onboarding Guide](../../ONBOARDING.md)
- [Prisma Schema](../../packages/database/prisma/schema.prisma)
- [BullMQ Docs](https://docs.bullmq.io/)
