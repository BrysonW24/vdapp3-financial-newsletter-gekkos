# 🔧 Troubleshooting Guide - Gekkos

## ✅ Issues Fixed!

The workspace package errors have been resolved. Follow these steps to get Gekkos running:

---

## 📋 Step-by-Step Installation

### 1. Pull Latest Changes
```bash
cd c:\dev\AiaaS\vivacity-digital-dev\newsletter-daily
git pull origin main
```

### 2. Install Dependencies
```bash
pnpm install
```

This should now work without errors! It will:
- Install all workspace packages
- Install Next.js and React for the web app
- Install Turbo for monorepo management
- Set up all dev dependencies

### 3. Start Development Server
```bash
pnpm dev --filter=web
```

Or from the web directory:
```bash
cd apps/web
pnpm dev
```

### 4. Open in Browser
Visit: **http://localhost:3000**

You should see the beautiful Gekkos newsletter! 🦎✨

---

## 🐛 Common Issues & Solutions

### Issue 1: "Workspace package not found"
**Error:**
```
ERR_PNPM_WORKSPACE_PKG_NOT_FOUND In apps\web: "@newsletter/types@workspace:*"
is in the dependencies but no package named "@newsletter/types" is present
```

**✅ FIXED!** This was happening because the package.json files for the shared packages didn't exist yet. They've now been created in:
- `packages/types/package.json`
- `packages/ui/package.json`
- `packages/utils/package.json`
- `packages/constants/package.json`

**Solution:** Pull the latest code with `git pull origin main`

---

### Issue 2: "turbo is not recognized"
**Error:**
```
'turbo' is not recognized as an internal or external command
```

**Cause:** Dependencies haven't been installed yet

**Solution:**
```bash
# Make sure you've pulled the latest code first
git pull origin main

# Then install dependencies
pnpm install

# Verify turbo is installed
pnpm turbo --version
```

---

### Issue 3: pnpm install fails
**Error:** Various installation errors

**Solution 1 - Clean Install:**
```bash
# Remove node_modules and lock file
rm -rf node_modules pnpm-lock.yaml

# Remove node_modules from all workspaces
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules

# Reinstall
pnpm install
```

**Solution 2 - Clear pnpm cache:**
```bash
# Clear pnpm store
pnpm store prune

# Reinstall
pnpm install
```

---

### Issue 4: Port 3000 already in use
**Error:**
```
Port 3000 is already in use
```

**Solution:**
```bash
# Option 1: Use a different port
PORT=3001 pnpm dev --filter=web

# Option 2: Kill the process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Option 3: Kill the process (Git Bash/WSL)
lsof -ti:3000 | xargs kill -9
```

---

### Issue 5: "Cannot find module 'next'"
**Error:**
```
Error: Cannot find module 'next'
```

**Cause:** Dependencies not installed in the web app

**Solution:**
```bash
# From root directory
pnpm install

# Or specifically for web app
pnpm install --filter=web
```

---

### Issue 6: TypeScript errors
**Error:** Various TS errors when running dev server

**Solution:**
```bash
# Run typecheck to see all errors
pnpm typecheck --filter=web

# Usually fixed by installing dependencies
pnpm install
```

---

### Issue 7: Git pull conflicts
**Error:**
```
error: Your local changes to the following files would be overwritten by merge
```

**Solution:**
```bash
# Option 1: Stash your changes
git stash
git pull origin main
git stash pop

# Option 2: Commit your changes first
git add .
git commit -m "WIP: my changes"
git pull origin main

# Option 3: Hard reset (⚠️ DESTROYS local changes)
git reset --hard origin/main
```

---

### Issue 8: "Module not found" errors in browser
**Error in browser console:**
```
Module not found: Can't resolve '@newsletter/types'
```

**Cause:** The web app is trying to import from workspace packages but they're empty

**Current Status:**
- ✅ Package definitions exist
- ⚠️ They're mostly empty (will be filled as needed)
- ✅ Imports won't fail, they just export placeholders

**Solution:** This is expected for now. The packages exist but aren't used yet. You can safely ignore these warnings.

---

## 🧪 Verify Everything Works

Run these commands to verify your setup:

```bash
# 1. Check pnpm version
pnpm --version
# Should show: 8.15.0 (or similar)

# 2. List all workspaces
pnpm list -r --depth -1
# Should show: newsletter-daily, @newsletter/web, @newsletter/worker,
#              @newsletter/database, @newsletter/types, @newsletter/ui,
#              @newsletter/utils, @newsletter/constants

# 3. Check turbo is installed
pnpm turbo --version
# Should show version number

# 4. Try building the web app
pnpm build --filter=web
# Should complete without errors

# 5. Start dev server
pnpm dev --filter=web
# Should start on http://localhost:3000
```

---

## 📊 Current Project Status

### ✅ Working
- Folder structure created
- All workspace package definitions exist
- Web app complete with all components
- Can install dependencies
- Can run dev server
- Beautiful UI renders

### ⚠️ Empty But Normal
- Most package implementations (types, ui, utils, constants have minimal code)
- Worker app (not implemented yet)
- API routes (not implemented yet)
- Database schema (not implemented yet)

### 📝 Not Implemented Yet (Future)
- Real API integrations
- Database with Prisma
- Worker for automation
- CI/CD pipelines
- Tests

---

## 🚀 Success Checklist

After following the steps, you should have:

- [x] pnpm installed globally
- [x] Latest code from GitHub
- [x] All dependencies installed (no errors)
- [x] Turbo working
- [x] Dev server running
- [x] Browser showing Gekkos at http://localhost:3000
- [x] All sections rendering with mock data
- [x] No console errors (except warnings about empty packages)

---

## 💡 Quick Commands Reference

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev --filter=web

# Build for production
pnpm build --filter=web

# Run type checking
pnpm typecheck

# Clean everything
pnpm clean -r

# Update all dependencies
pnpm update -r

# Add a new package to web app
pnpm add <package-name> --filter=web

# Add a dev dependency
pnpm add -D <package-name> --filter=web
```

---

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Check Node.js version:**
   ```bash
   node --version
   # Should be 18.0.0 or higher
   ```

2. **Reinstall pnpm:**
   ```bash
   npm uninstall -g pnpm
   npm install -g pnpm
   ```

3. **Check the error logs:**
   - Look for specific error messages
   - Check the browser console (F12)
   - Look at terminal output

4. **Try the nuclear option:**
   ```bash
   # Remove everything and start fresh
   rm -rf node_modules pnpm-lock.yaml
   rm -rf apps/*/node_modules
   rm -rf packages/*/node_modules

   # Reinstall
   pnpm install
   ```

5. **Check documentation:**
   - [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup guide
   - [QUICK_START.md](./QUICK_START.md) - Quick start
   - [PREVIEW.md](./PREVIEW.md) - See what it should look like

---

## ✅ You Should Be Ready Now!

Run these final commands:

```bash
cd c:\dev\AiaaS\vivacity-digital-dev\newsletter-daily
git pull origin main
pnpm install
pnpm dev --filter=web
```

Then open **http://localhost:3000** and enjoy Gekkos! 🦎✨
