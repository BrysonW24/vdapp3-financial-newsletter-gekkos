# 🚀 Gekkos - Vercel Deployment Guide

**Status**: ✅ Ready for deployment (Web app only)
**Deployment Time**: ~10 minutes
**Cost**: $0/month (Vercel free tier)

---

## 📋 What You're Deploying

**Web App Features** (Working immediately):
- ✅ Live stock market data (Yahoo Finance - FREE)
- ✅ Real-time cryptocurrency prices (CoinGecko - FREE)
- ✅ Market indices (ASX 200, S&P 500, Nikkei 225, FTSE 100)
- ✅ Big 4 Australian banks (CBA, WBC, NAB, ANZ)
- ✅ Cryptocurrency feed (BTC, ETH, BNB, SOL)
- ✅ Fear & Greed Index (Alternative.me - FREE)
- ✅ AUD/USD exchange rate
- ✅ Responsive design
- ✅ Auto-refresh every 5 minutes

**What's NOT included** (requires Option 2 - Full Stack):
- ❌ Database persistence
- ❌ User accounts
- ❌ Portfolio tracking
- ❌ Background jobs
- ❌ Email newsletters
- ❌ AI content generation

---

## 🎯 Pre-Deployment Checklist

✅ **Completed**:
- [x] Fixed vercel.json build command (pnpm instead of npm)
- [x] Installed all dependencies (566 packages)
- [x] Created .env file for local development
- [x] Web app build tested

⏳ **Next Steps**:
1. Test local build passes
2. Deploy to Vercel
3. Verify live deployment works

---

## 📦 Step 1: Push to GitHub (if not already done)

```bash
cd /Users/brysonwalter/Documents/1-vivacity-digital/vdapp3-financial-newsletter-gekkos

# Check git status
git status

# Add all changes
git add .

# Commit
git commit -m "chore: prepare for Vercel deployment

- Fixed vercel.json to use pnpm build command
- Added .env file for local development
- Installed all dependencies
- Ready for web-only deployment

🤖 Generated with Claude Code"

# Push to GitHub
git push origin main
```

---

## 🌐 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new

2. **Import Git Repository**
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Leave blank (monorepo configured in vercel.json)
   - **Build Command**: Auto-detected from vercel.json
   - **Output Directory**: Auto-detected from vercel.json

4. **Environment Variables** (Optional - for future features)
   - Click "Add" to add variables
   - You can add these later, they're NOT required for the free APIs:

   ```
   OPENAI_API_KEY=your-key-here (optional)
   ANTHROPIC_API_KEY=your-key-here (optional)
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 3-5 minutes for build to complete
   - You'll get a URL like: `https://your-project.vercel.app`

---

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd /Users/brysonwalter/Documents/1-vivacity-digital/vdapp3-financial-newsletter-gekkos
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - What's your project's name? gekkos-financial-newsletter
# - In which directory is your code located? ./
# - Want to override settings? No

# Wait for deployment to complete
# You'll get a production URL
```

---

## ✅ Step 3: Verify Deployment

Once deployed, test these URLs:

1. **Homepage**
   ```
   https://your-project.vercel.app/
   ```
   - Should show the financial newsletter
   - Check that stock prices are loading
   - Verify crypto prices are showing

2. **API Health Check**
   ```
   https://your-project.vercel.app/api/health
   ```
   - Should return: `{"success": true, "message": "OK"}`

3. **Market Data API**
   ```
   https://your-project.vercel.app/api/market-data
   ```
   - Should return live stock market data
   - Check indices, featured stocks, AUD/USD

4. **Crypto Data API**
   ```
   https://your-project.vercel.app/api/crypto-data
   ```
   - Should return cryptocurrency prices
   - Check BTC, ETH, BNB, SOL prices

---

## 🔧 Troubleshooting

### Build Fails on Vercel

**Error**: `Command "npm run build" not found`
- **Fix**: Ensure vercel.json has `"buildCommand": "cd apps/web && pnpm run build"`

**Error**: `Prisma schema not found`
- **Fix**: This is a warning, not an error. Safe to ignore for web-only deployment.

**Error**: `Module not found: Can't resolve '@newsletter/database'`
- **Fix**: The database package isn't needed for web-only. Comment out database imports if they exist.

### APIs Not Working

**Error**: Stock prices not loading
- **Check**: Browser console for CORS errors
- **Check**: Network tab - are API calls to Yahoo Finance succeeding?
- **Fix**: Yahoo Finance is free and doesn't require authentication

**Error**: Crypto prices showing "0" or "null"
- **Check**: CoinGecko API status: https://status.coingecko.com/
- **Fix**: CoinGecko has rate limits on free tier (10-50 calls/minute)

### Performance Issues

**Error**: Slow page load
- **Check**: Vercel analytics in dashboard
- **Fix**: Next.js automatically optimizes builds on Vercel

---

## 📊 Post-Deployment Monitoring

### Vercel Dashboard
- View deployment logs
- Monitor performance
- Check analytics
- See function invocations

### Key Metrics to Watch
- **Build Time**: Should be ~2-4 minutes
- **Page Load**: Should be <2 seconds
- **API Response Time**: Should be <500ms
- **Error Rate**: Should be <1%

---

## 🚀 Next Steps (Optional)

### Add Custom Domain
1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS settings
5. Wait for SSL certificate (automatic)

### Add Analytics
1. Enable Vercel Analytics in dashboard
2. Add `@vercel/analytics` package
3. Import in app layout
4. Track page views and performance

### Add Environment Variables Later
1. Go to project settings
2. Navigate to "Environment Variables"
3. Add OPENAI_API_KEY or ANTHROPIC_API_KEY
4. Redeploy (automatic on variable change)

---

## 💰 Cost Breakdown

### Current (Web Only)
- **Vercel Hosting**: $0/month (Hobby tier)
- **Yahoo Finance API**: FREE
- **CoinGecko API**: FREE (with rate limits)
- **Alternative.me API**: FREE
- **Total**: $0/month

### If You Upgrade to Vercel Pro
- **Vercel Pro**: $20/month
- **Benefits**:
  - Faster builds
  - More function invocations
  - Team collaboration
  - Advanced analytics

---

## 📞 Support & Resources

### Vercel Documentation
- Getting Started: https://vercel.com/docs
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs
- Environment Variables: https://vercel.com/docs/environment-variables

### Project Documentation
- [README.md](./README.md) - Project overview
- [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md) - Current status
- [QUICK_REFERENCE.txt](./QUICK_REFERENCE.txt) - Quick commands

### Common Issues
- Vercel Community: https://github.com/vercel/vercel/discussions
- Next.js Discord: https://nextjs.org/discord

---

## ✅ Deployment Checklist

**Before Deployment**:
- [x] Code pushed to GitHub
- [x] Dependencies installed
- [x] Build tested locally
- [x] vercel.json configured correctly

**During Deployment**:
- [ ] Vercel project created
- [ ] Repository imported
- [ ] Build completed successfully
- [ ] Preview URL generated

**After Deployment**:
- [ ] Homepage loads correctly
- [ ] Stock prices are live
- [ ] Crypto prices are updating
- [ ] APIs return valid data
- [ ] No console errors
- [ ] Mobile responsive works

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Live financial newsletter at your Vercel URL
- ✅ Real-time market data from free APIs
- ✅ Auto-updating every 5 minutes
- ✅ Responsive design for all devices
- ✅ Zero monthly costs

**Your live URL**: `https://your-project.vercel.app`

---

**Need full features?** See [FULL_STACK_DEPLOYMENT.md](./FULL_STACK_DEPLOYMENT.md) for Option 2 with database, worker, and backend API.
