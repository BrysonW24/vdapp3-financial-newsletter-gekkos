# 📦 Complete Setup Guide - Gekkos

## What is pnpm?

**pnpm** (performant npm) is a fast, disk-space-efficient package manager for Node.js. Think of it as a better version of npm (Node Package Manager).

### Why pnpm instead of npm?

| Feature | npm | pnpm |
|---------|-----|------|
| **Speed** | ⚡ Fast | ⚡⚡⚡ **3x Faster** |
| **Disk Space** | Uses 1GB+ | Uses **~300MB** (shares packages) |
| **Monorepo Support** | Basic | **Excellent** (built-in workspaces) |
| **Strict** | Allows accessing unlisted deps | **Strict** - prevents dependency bugs |

### How pnpm Works

- **Shared Store**: All packages are stored once in a global store (`~/.pnpm-store`)
- **Hard Links**: Projects link to packages instead of copying them
- **Faster Installs**: Doesn't duplicate packages across projects
- **Perfect for Monorepos**: Manages multiple packages efficiently

## Installing pnpm

### Windows

**Option 1: Using npm (if you already have Node.js)**
```bash
npm install -g pnpm
```

**Option 2: Using PowerShell (standalone installer)**
```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

**Option 3: Using Chocolatey**
```bash
choco install pnpm
```

### macOS

**Option 1: Using npm**
```bash
npm install -g pnpm
```

**Option 2: Using Homebrew**
```bash
brew install pnpm
```

### Linux

**Option 1: Using npm**
```bash
npm install -g pnpm
```

**Option 2: Using curl**
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Verify Installation

```bash
pnpm --version
# Should output something like: 8.15.0
```

## Understanding the Folder Structure

### Why Are Many Folders Empty?

This is **completely normal** for a new monorepo project! The folder structure was created to:

1. **Organize the codebase** - Shows where code WILL live
2. **Follow best practices** - Separation of concerns
3. **Scale easily** - Add features to the right place
4. **Team clarity** - Everyone knows where to put new code

### Current Folder Structure Explained

```
newsletter-daily/
│
├── 📁 apps/                          # Applications (main code)
│   ├── 📁 web/                       # ✅ IMPLEMENTED - Next.js frontend
│   │   ├── 📁 src/
│   │   │   ├── 📁 app/              # Next.js 14 pages
│   │   │   │   ├── layout.tsx       # ✅ Root layout
│   │   │   │   ├── page.tsx         # ✅ Homepage
│   │   │   │   ├── globals.css      # ✅ Global styles
│   │   │   │   ├── 📁 about/        # ✅ About page
│   │   │   │   ├── 📁 archive/      # ✅ Archive page
│   │   │   │   └── 📁 api/          # ⚠️ EMPTY - Future API routes
│   │   │   │       ├── edition/     # ⚠️ Will fetch newsletter data
│   │   │   │       ├── trigger/     # ⚠️ Will trigger generation
│   │   │   │       └── health/      # ⚠️ Health check endpoint
│   │   │   │
│   │   │   ├── 📁 components/       # React components
│   │   │   │   ├── 📁 newsletter/   # ✅ All newsletter components
│   │   │   │   └── 📁 ui/           # ⚠️ EMPTY - Future shared UI
│   │   │   │
│   │   │   ├── 📁 lib/              # Utilities
│   │   │   │   ├── 📁 hooks/        # ⚠️ EMPTY - React hooks (future)
│   │   │   │   ├── 📁 utils/        # ⚠️ EMPTY - Helper functions
│   │   │   │   └── 📁 config/       # ⚠️ EMPTY - Configuration
│   │   │   │
│   │   │   └── 📁 styles/           # Styling
│   │   │       └── 📁 themes/       # ⚠️ EMPTY - Theme variations
│   │   │
│   │   └── 📁 public/               # Static assets
│   │       └── 📁 images/           # ⚠️ EMPTY - Images (future)
│   │
│   └── 📁 worker/                    # ⚠️ EMPTY - Background processor
│       ├── 📁 src/
│       │   ├── 📁 jobs/             # ⚠️ Will orchestrate daily tasks
│       │   ├── 📁 services/         # ⚠️ API integrations
│       │   ├── 📁 generators/       # ⚠️ Content generation
│       │   ├── 📁 summarizers/      # ⚠️ AI summarization
│       │   ├── 📁 queue/            # ⚠️ Job queue management
│       │   └── 📁 utils/            # ⚠️ Worker utilities
│       │
│       └── package.json             # ✅ Dependencies defined
│
├── 📁 packages/                      # Shared code across apps
│   ├── 📁 database/                  # ⚠️ EMPTY - Prisma database layer
│   │   ├── 📁 prisma/
│   │   │   ├── schema.prisma        # ⚠️ Will define database schema
│   │   │   └── 📁 migrations/       # ⚠️ Database migrations
│   │   └── 📁 src/
│   │       └── 📁 repositories/     # ⚠️ Data access layer
│   │
│   ├── 📁 types/                     # ⚠️ EMPTY - Shared TypeScript types
│   │   └── 📁 src/                  # ⚠️ Type definitions
│   │
│   ├── 📁 ui/                        # ⚠️ EMPTY - Shared UI components
│   │   └── 📁 src/
│   │       └── 📁 components/       # ⚠️ Reusable components
│   │
│   ├── 📁 utils/                     # ⚠️ EMPTY - Shared utilities
│   │   └── 📁 src/
│   │       ├── 📁 formatters/       # ⚠️ Format currency, dates, etc.
│   │       └── 📁 validators/       # ⚠️ Validation functions
│   │
│   ├── 📁 constants/                 # ⚠️ EMPTY - Shared constants
│   │   └── 📁 src/                  # ⚠️ Stock symbols, etc.
│   │
│   └── 📁 config/                    # ⚠️ EMPTY - Shared configurations
│       ├── 📁 eslint/               # ⚠️ Linting rules
│       ├── 📁 typescript/           # ⚠️ TypeScript configs
│       └── 📁 prettier/             # ⚠️ Code formatting
│
├── 📁 .github/                       # GitHub configuration
│   ├── 📁 workflows/                # ⚠️ EMPTY - CI/CD pipelines
│   └── 📁 ISSUE_TEMPLATE/           # ⚠️ EMPTY - Issue templates
│
├── 📁 docs/                          # ⚠️ EMPTY - Documentation
│   ├── ARCHITECTURE.md              # ⚠️ System architecture
│   ├── API.md                       # ⚠️ API documentation
│   └── DEPLOYMENT.md                # ⚠️ Deployment guide
│
├── 📁 scripts/                       # ⚠️ EMPTY - Utility scripts
│   ├── dev-seed.mjs                 # ⚠️ Seed sample data
│   └── generate-newsletter.ts       # ⚠️ Manual generation
│
├── 📁 tests/                         # ⚠️ EMPTY - Tests
│   ├── 📁 e2e/                      # ⚠️ End-to-end tests
│   └── 📁 integration/              # ⚠️ Integration tests
│
├── 📄 package.json                   # ✅ Root monorepo config
├── 📄 pnpm-workspace.yaml            # ✅ Workspace definition
├── 📄 turbo.json                     # ✅ Turborepo configuration
├── 📄 README.md                      # ✅ Main documentation
├── 📄 QUICK_START.md                 # ✅ Quick start guide
└── 📄 .gitignore                     # ✅ Git ignore rules
```

### Legend
- ✅ **IMPLEMENTED** - Has code/files
- ⚠️ **EMPTY** - Placeholder for future development
- 📁 **Folder**
- 📄 **File**

## Why This Structure?

### 1. **Monorepo Benefits**
- **Share code** between web and worker
- **Single repository** for everything
- **Unified dependencies** and tooling
- **Easier to maintain** and deploy

### 2. **Scalability**
```
Current (Phase 1):
└── apps/web (frontend with mock data)

Phase 2:
├── apps/web (frontend)
└── apps/worker (background jobs)

Phase 3:
├── apps/web
├── apps/worker
└── packages/database (shared database)

Phase 4:
├── apps/web
├── apps/worker
├── packages/database
├── packages/types
└── packages/ui (shared components)
```

### 3. **Team Collaboration**
- **Frontend devs** work in `apps/web`
- **Backend devs** work in `apps/worker`
- **Shared code** goes in `packages/`
- **Clear boundaries** - no confusion

## What Gets Filled When?

### ✅ Already Filled (Phase 1 - MVP)
- `apps/web/src/app/` - All pages
- `apps/web/src/components/newsletter/` - All newsletter sections
- `apps/web/src/app/globals.css` - Global styles
- Root config files (package.json, pnpm-workspace.yaml, turbo.json)

### 📋 Next to Fill (Phase 2 - Data Integration)
- `apps/web/src/app/api/` - API routes to fetch data
- `apps/web/src/lib/hooks/` - React hooks for data fetching
- `apps/web/src/lib/utils/` - Helper functions
- `packages/database/prisma/` - Database schema
- `packages/types/src/` - TypeScript interfaces

### 🚀 Future (Phase 3 - Automation)
- `apps/worker/` - All worker code for automated generation
- `packages/ui/` - Shared UI components
- `packages/utils/` - Shared utilities
- `.github/workflows/` - CI/CD pipelines

## Getting Started

### 1. Install pnpm (see above)

### 2. Install Dependencies
```bash
cd c:\dev\AiaaS\vivacity-digital-dev\newsletter-daily
pnpm install
```

This command:
- Installs all dependencies for ALL packages
- Creates `node_modules/` in each app/package
- Creates a `pnpm-lock.yaml` file (like package-lock.json)

### 3. Run Development Server
```bash
# From root directory
pnpm dev --filter=web

# Or navigate to web app
cd apps/web
pnpm dev
```

### 4. View the Site
Open http://localhost:3000 in your browser!

## Common pnpm Commands

### Installing Packages
```bash
# Add to specific workspace
pnpm add axios --filter=web          # Add to web app only
pnpm add -D typescript --filter=web  # Add as dev dependency

# Add to root (affects all workspaces)
pnpm add -w turbo                    # Add to root workspace

# Add to all workspaces
pnpm add lodash -r                   # Add to all packages
```

### Running Scripts
```bash
# Run in all workspaces
pnpm dev                             # Run dev in all apps

# Run in specific workspace
pnpm dev --filter=web                # Run only web app
pnpm build --filter=worker           # Build only worker

# Run multiple
pnpm build --filter=web --filter=worker
```

### Workspace Commands
```bash
# List all workspaces
pnpm list -r --depth -1

# Update all dependencies
pnpm update -r

# Clean all node_modules
pnpm clean -r
```

## Troubleshooting

### "pnpm: command not found"
**Solution**: Reinstall pnpm globally
```bash
npm install -g pnpm
```

### "Cannot find module"
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Empty folders warning
**This is normal!** The empty folders are:
- **Intentional** - part of the project structure
- **For future development** - will be filled as you build features
- **Best practice** - shows the intended architecture

Don't delete them! They'll be populated as you develop the application.

## Next Steps

1. ✅ Install pnpm
2. ✅ Run `pnpm install`
3. ✅ Run `pnpm dev --filter=web`
4. ✅ View at http://localhost:3000
5. 📝 Start building! See [QUICK_START.md](./QUICK_START.md) for next steps

## Resources

- **pnpm Documentation**: https://pnpm.io
- **pnpm Workspaces**: https://pnpm.io/workspaces
- **Turborepo**: https://turbo.build/repo
- **Next.js**: https://nextjs.org
