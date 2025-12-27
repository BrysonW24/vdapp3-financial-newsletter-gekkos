# Gekkos

A modern, automated finance newsletter platform built with Next.js 14, TypeScript, and a monorepo architecture.

## Overview

**Gekkos** delivers a comprehensive daily finance newsletter with real-time market data covering:
- 📈 Trading Feed (Live stock indices, Big 4 banks, AUD/USD)
- 🏠 Property Updates
- 📊 Stock Market Analysis
- 💰 Cryptocurrency Trends (Live prices via CoinGecko)
- 📉 Economic Insights
- 🚀 Technology News
- 📚 Knowledge Feed
- 🎬 Entertainment
- 🎨 Daily Graphics
- 💭 Inspirational Quotes

## Architecture

This is a **monorepo** powered by Turborepo and pnpm workspaces:

- **apps/web**: Next.js 14 frontend (App Router)
- **apps/worker**: Background processing engine for content generation
- **packages/database**: Shared Prisma database layer
- **packages/types**: Shared TypeScript types
- **packages/ui**: Shared React components
- **packages/utils**: Shared utilities
- **packages/constants**: Shared constants
- **packages/config**: Shared tooling configuration

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Node.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Data Sources**:
  - Yahoo Finance API (real-time stock market data)
  - CoinGecko API (cryptocurrency prices)
  - Alternative.me (Fear & Greed Index)
- **AI**: OpenAI/Anthropic for content generation
- **Deployment**: Vercel (web), Railway/Render (worker)
- **Queue**: BullMQ with Redis
- **Testing**: Jest, React Testing Library, Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+
- Redis (for job queue)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
pnpm db:setup

# Run development servers
pnpm dev
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run specific app
pnpm dev --filter=web
pnpm dev --filter=worker

# Build all apps
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint

# Type check
pnpm typecheck
```

## Features

### Live Data Integration (Phase 2 - Completed)
- ✅ Real-time market data from Yahoo Finance API
- ✅ Live cryptocurrency prices from CoinGecko API
- ✅ Auto-refresh every 5 minutes
- ✅ Beautiful loading states and error handling
- ✅ Trading Feed component with live stock indices and Big 4 bank prices

### Interactive UI
- ✅ Smooth scroll navigation with table of contents
- ✅ Responsive design for all screen sizes
- ✅ Custom Gekkos branding (green: #22c55e)
- ✅ Animated sections and hover effects
- ✅ Clean, modern newsletter layout

### Background Worker (Phase 3 - In Progress)
- ✅ BullMQ-based job queue system with Redis
- ✅ Market data fetching service
- ✅ News aggregation from multiple sources
- ✅ AI-powered content generation (OpenAI/Anthropic)
- ✅ Automated newsletter assembly
- ✅ Database persistence with Prisma
- ✅ Job orchestration and retry logic
- 🔄 Scheduled daily newsletter generation
- 🔄 Email delivery system

### Coming Soon (Phase 4)
- 🔄 Email delivery integration
- 🔄 Advanced analytics and tracking
- 🔄 User preferences and customization
- 🔄 Multi-language support

## Project Structure

This is a monorepo structure managed by Turborepo. For detailed documentation about the system architecture and setup, see the [Documentation](./documentation/2024-11-24/) folder.

## Documentation

Current session documentation (2024-11-24):
- [Status Ready for Vercel](./documentation/2024-11-24/STATUS_READY_FOR_VERCEL.md) - Deployment checklist and current phase status
- [Vercel Environment Setup](./documentation/2024-11-24/VERCEL_ENV_SETUP.md) - Step-by-step Vercel configuration guide
- [API Credentials Requirements](./documentation/2024-11-24/API_CREDENTIALS_REQUIREMENTS.md) - All required credentials and setup
- [Quick Start](./documentation/2024-11-24/QUICK_START.md) - Quick reference for getting started
- [Phase 2 Worker Jobs Complete](./documentation/2024-11-24/PHASE_2_WORKER_JOBS_COMPLETE.md) - Background job system documentation
- [Phase 3 Frontend Complete](./documentation/2024-11-24/PHASE_3_FRONTEND_COMPLETE.md) - Frontend components documentation
- [API Reference](./documentation/2024-11-24/API_REFERENCE.md) - API endpoints and integration details

See [documentation/2024-11-24/](./documentation/2024-11-24/) for the complete documentation index.

## License

MIT License