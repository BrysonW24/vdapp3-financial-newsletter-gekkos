# 🚀 Vercel Deployment Guide - Newsletter Daily

**Status**: ✅ Production Ready
**Last Updated**: November 9, 2024
**Framework**: Next.js 14 + Turborepo (Monorepo)

---

## Quick Overview

This is a Turborepo monorepo with two deployable services:

| Service | Platform | Runtime | Status |
|---------|----------|---------|--------|
| **Web App** (Next.js) | Vercel | Serverless | ✅ Ready |
| **Worker** (Node.js) | Railway/Render | Long-running | ✅ Separate deployment |

**This guide focuses on Web App deployment to Vercel.**

---

## Architecture

```
Root (Monorepo)
├── vercel.json                    ← Vercel config (root)
├── package.json                   ← Has "next" for framework detection
├── pnpm-workspace.yaml           ← Workspace definition
├── turbo.json                    ← Turborepo config
│
├── apps/web/                     ← Next.js app (→ Vercel)
│   ├── vercel.json              ← App-level config
│   ├── package.json
│   ├── next.config.js
│   └── src/
│
└── apps/worker/                  ← Node.js background service (→ Railway/Render)
    ├── package.json
    └── src/
```

---

## Prerequisites

Before deploying to Vercel:

- ✅ GitHub repository created and connected to Vercel
- ✅ All code committed to `main` branch
- ✅ Environment variables ready
- ✅ No schema validation errors in `vercel.json`

---

## Configuration Files

### 1. Root `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "buildCommand": "cd apps/web && npm run build",
  "installCommand": "pnpm install --recursive",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next"
}
```

**What this does:**
- Tells Vercel to use pnpm for monorepo dependency installation
- Tells Vercel to cd into apps/web and run build
- Tells Vercel to look for output in apps/web/.next
- Registers project as Next.js framework

### 2. Root `package.json` (Key Section)

```json
{
  "devDependencies": {
    "next": "^14.1.0",
    "turbo": "^1.12.4",
    "typescript": "^5.3.3",
    "prettier": "^3.2.4"
  }
}
```

**Why `"next"` in root package.json?**

Vercel checks the **root** `package.json` for framework detection **before** running `buildCommand`. Without it, you'll get:

```
Error: No Next.js version detected. Make sure your package.json has "next"
```

### 3. `.vercelignore` (Optional but Recommended)

```
apps/worker
.git
.github
docs
*.md
!README.md
tests
scripts
```

**Why?** Excludes files that don't need to be uploaded, speeds up deployments.

---

## Deployment Flow

When you push to GitHub:

```
1. GitHub webhook → Vercel notification
2. Vercel clones repository
3. Vercel reads root vercel.json
4. Vercel runs: pnpm install --recursive
   ├─ Installs root dependencies (including "next")
   └─ Installs workspace dependencies
5. Vercel runs: cd apps/web && npm run build
   ├─ Installs apps/web dependencies
   ├─ Runs Next.js build
   ├─ Creates output in apps/web/.next
   └─ All within the apps/web directory
6. Vercel detects build output at apps/web/.next
7. Deployment succeeds ✅
```

---

## Environment Variables

Set these in **Vercel Dashboard** → **Settings** → **Environment Variables**:

```env
# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
NEWS_API_KEY=...

# Premium Features (if enabled)
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# General
NODE_ENV=production
```

---

## Expected Build Logs

### ✅ Success Looks Like This

```
17:43:08.417 Cloning github.com/BrysonW24/newsletter-daily-prod (Branch: main)
17:43:10.231 Running "install" command: `pnpm install --recursive`
17:43:25.493 Done in 15.2s
17:43:25.547 Running "build" command: `cd apps/web && npm run build`
17:43:35.450 > next build
17:43:45.800 ✓ Compiled successfully
17:43:46.000 Ready to deploy
17:43:47.123 Deployed to https://newsletter-daily.vercel.app ✅
```

### ❌ Common Errors (Should NOT See)

| Error | Cause | Fix |
|-------|-------|-----|
| `No Next.js version detected` | Missing `"next"` in root package.json | Add `"next": "^14.1.0"` to root devDependencies |
| `Cannot find build output` | Wrong outputDirectory path | Ensure `outputDirectory: "apps/web/.next"` |
| `@newsletter/worker:build` | Worker being built | Ensure buildCommand is `cd apps/web && npm run build` |
| Schema validation error | Invalid vercel.json property | Remove invalid properties, use only valid schema |

---

## Troubleshooting

### Issue: "No Next.js version detected"

**Solution:**
1. Open root `package.json`
2. Add to `devDependencies`:
   ```json
   "next": "^14.1.0"
   ```
3. Commit and push
4. Vercel will auto-rebuild

### Issue: "Cannot find build output"

**Solution:**
1. Verify `vercel.json` has:
   ```json
   "outputDirectory": "apps/web/.next"
   ```
2. Verify `apps/web` has `next.config.js`
3. Verify `apps/web/package.json` has build script

### Issue: Build seems to build worker

**Solution:**
1. Check `buildCommand` in `vercel.json`
2. Should be: `cd apps/web && npm run build`
3. NOT: `turbo run build` (builds everything)

### Issue: pnpm lockfile errors

**Solution:**
If you edit `package.json`, update lockfile:
```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: update lockfile"
git push
```

---

## Post-Deployment

### Verify Deployment Success

1. **Check Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Should show latest commit deployed
   - Build status should be "Ready"

2. **Test Your App**
   - Click deployment URL
   - Homepage should load
   - Check API routes work

3. **Monitor Deployments**
   - Vercel auto-deploys on every push to main
   - Watch logs in Vercel dashboard
   - Set up Slack notifications (optional)

### Set Environment Variables

1. Go to **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Add all variables listed above
3. Redeploy from dashboard (or push new commit)

---

## Monorepo Specifics

### Why Not Use Turbo for buildCommand?

❌ **Bad**:
```json
"buildCommand": "turbo run build"
```

This builds BOTH web AND worker. Vercel can't use the worker (no 60+ second functions), causing confusion.

✅ **Good**:
```json
"buildCommand": "cd apps/web && npm run build"
```

This builds ONLY the web app, which Vercel can deploy.

### Why Two `vercel.json` Files?

Only the root `vercel.json` is strictly necessary. But if you want Vercel to recognize Next.js specifically:

**Root `vercel.json`:**
- Tells Vercel how to work with the monorepo
- Specifies build/install commands
- Points to build output location

**Optional `apps/web/vercel.json`:**
- Provides Next.js-specific hints
- Can override root settings for this app
- Useful for very complex setups

For most cases, just the root `vercel.json` is enough.

---

## Git Commits Reference

Key commits that fixed deployment:

| Commit | Change | Reason |
|--------|--------|--------|
| `0bf0ef3` | Add `"next"` to root package.json | Vercel framework detection |
| `08f0852` | Fix vercel.json buildCommand | Point to apps/web only |
| `4e7b7cf` | Add .vercelignore | Exclude worker files |

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| [SETUP_PREMIUM_INFRASTRUCTURE.md](./SETUP_PREMIUM_INFRASTRUCTURE.md) | Premium features infrastructure |
| [PREMIUM_INTELLIGENCE_FEATURES.md](./PREMIUM_INTELLIGENCE_FEATURES.md) | Premium product specs |
| README.md | Project overview |

---

## Questions?

### "Will Vercel auto-deploy when I push?"

Yes! Vercel watches your GitHub repository and automatically rebuilds and deploys on every push to `main`.

### "Can I deploy the worker to Vercel?"

No. Vercel's 60-second timeout makes it unsuitable for long-running background services. Deploy worker to Railway, Render, or similar.

### "What if build fails?"

1. Check Vercel logs in dashboard
2. Look for error message (usually very clear)
3. Fix the issue locally
4. Commit and push
5. Vercel auto-rebuilds

### "How do I rollback?"

Click the previous deployment in Vercel dashboard → Click "Redeploy".

---

## Deployment Status

✅ **Web App**: Configured and ready for Vercel
✅ **Configuration**: All files valid, no schema errors
✅ **Dependencies**: All in place
✅ **Environment**: Ready to receive variables

**Next Step:** Push to GitHub and watch your deployment in the Vercel dashboard!

---

**Document**: VERCEL_DEPLOYMENT_GUIDE.md
**Last Updated**: November 9, 2024
**Status**: ✅ Current and Production-Ready
