# Gekkos - Web App 🦎

Next.js 14 frontend application for the gorgeous Gekkos newsletter.

## Overview

A modern, beautifully designed finance newsletter featuring:
- **Trading Feed** - Market indices, featured stocks, top movers
- **Property Feed** - Australian property market news
- **Stocks Feed** - ASX and global stock market updates
- **Crypto Feed** - Cryptocurrency markets and news
- **Economy Feed** - RBA updates and economic indicators
- **Technology Feed** - Fintech and tech sector news
- **Knowledge Feed** - Financial education content
- **Entertainment Feed** - Weekend recommendations (Friday only)
- **Graphic of the Day** - Visual financial insights
- **Quote of the Day** - Daily investment wisdom

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom Gecko theme
- **Fonts**: Inter, Outfit, JetBrains Mono (Google Fonts)
- **TypeScript**: Full type safety
- **Components**: React Server Components + Client Components

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies (from web directory)
pnpm install

# Or from monorepo root
cd ../../
pnpm install
```

### Development

```bash
# Run development server
pnpm dev

# Or from monorepo root
pnpm dev --filter=web
```

Visit [http://localhost:3000](http://localhost:3000) to see your newsletter!

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with fonts
│   ├── page.tsx                 # Homepage with all sections
│   ├── globals.css              # Global styles + Tailwind
│   ├── about/                   # About page
│   └── archive/                 # Newsletter archive
│
├── components/
│   └── newsletter/
│       ├── NewsletterLayout.tsx # Main layout wrapper
│       ├── Header.tsx           # Branded header
│       ├── Footer.tsx           # Footer with links
│       ├── TableOfContents.tsx  # Section navigation
│       └── sections/            # All content sections
│           ├── TradingFeed.tsx
│           ├── PropertyFeed.tsx
│           ├── StocksFeed.tsx
│           ├── CryptoFeed.tsx
│           ├── EconomyFeed.tsx
│           ├── TechnologyFeed.tsx
│           ├── KnowledgeFeed.tsx
│           ├── EntertainmentFeed.tsx
│           ├── GraphicOfTheDay.tsx
│           └── QuoteOfTheDay.tsx
│
└── lib/                         # Utilities and configs
```

## Features

### Design
- ✨ Beautiful gradient backgrounds with animated blur effects
- 🎨 Custom Gecko green theme + financial color palette
- 📱 Fully responsive mobile-first design
- 🔄 Smooth animations and transitions
- 🎯 Sticky table of contents for easy navigation

### Content Sections
All sections currently use mock data and are ready for API integration:
- Interactive market data displays
- Clickable article links
- Visual charts and indicators
- Educational content with formatting
- Special Friday-only entertainment section

### Pages
- **/** - Today's newsletter (all sections)
- **/archive** - Browse past editions
- **/about** - Mission and coverage details

## Customization

### Colors
Edit the Gecko theme in `tailwind.config.ts`:
```typescript
gecko: {
  500: '#22c55e',  // Main brand color
  600: '#16a34a',  // Hover states
  // ...
}
```

### Fonts
Modify fonts in `src/app/layout.tsx`

### Sections
Add/remove sections in `src/app/page.tsx`

## Next Steps

1. **Install Dependencies**: Run `pnpm install` in the monorepo root
2. **Start Dev Server**: Run `pnpm dev`
3. **View the Site**: Open http://localhost:3000
4. **Integrate APIs**: Replace mock data with real API calls
5. **Deploy**: Deploy to Vercel for production

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm install -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## Contributing

This is part of the Gekkos monorepo. See the main README for contribution guidelines.
