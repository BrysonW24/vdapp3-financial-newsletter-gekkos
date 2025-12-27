# ✅ Backend Deployment Checklist

Quick reference for deploying the authentication backend to production.

---

## 🚀 Pre-Deployment (Local Testing)

### 1. Environment Setup
- [ ] Copy `.env.example` to `.env.local`
- [ ] Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- [ ] Set up PostgreSQL database locally or in cloud
- [ ] Add `DATABASE_URL` and `DIRECT_URL` to `.env.local`
- [ ] Get `NEWS_API_KEY` from newsapi.org
- [ ] Add all keys to `.env.local`

### 2. Database Migration
```bash
cd apps/web
pnpm db:push
```
- [ ] Schema created successfully
- [ ] Tables visible in database

### 3. Test Authentication
```bash
pnpm dev
# Visit http://localhost:3000
```
- [ ] Signup endpoint works
- [ ] Signup creates user in database
- [ ] Default portfolio created automatically
- [ ] Session persists on page refresh

### 4. Test Protected APIs
```bash
# In browser console or API client:
fetch('/api/portfolio')
  .then(r => r.json())
  .then(d => console.log(d))
```
- [ ] Unauthenticated request returns 401
- [ ] Authenticated request returns user's portfolios
- [ ] Adding holdings works
- [ ] Deleting holdings works

### 5. Code Review
- [ ] No `any` types in TypeScript
- [ ] All sensitive data in `.env.local`
- [ ] No hardcoded secrets in code
- [ ] Error messages don't expose internals
- [ ] All `TODO` comments completed

---

## 🌍 Production Deployment (Vercel)

### 1. Prepare Repository
```bash
git add .
git commit -m "feat: authentication backend ready for production"
git push origin main
```
- [ ] All changes committed
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.example` is committed (no secrets)

### 2. Connect to Vercel
- [ ] Push to GitHub
- [ ] Visit [vercel.com/new](https://vercel.com/new)
- [ ] Select repository
- [ ] Select `apps/web` as root directory
- [ ] Click Deploy

### 3. Set Environment Variables in Vercel

After deployment starts, add to Vercel dashboard:

**Settings → Environment Variables**

| Key | Value | Scope |
|-----|-------|-------|
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Production |
| `NEXTAUTH_SECRET` | Generated secret | Production |
| `DATABASE_URL` | PostgreSQL connection string | Production |
| `DIRECT_URL` | PostgreSQL direct connection | Production |
| `NEWS_API_KEY` | Your API key | Production |

```bash
# OR via CLI
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add NEWS_API_KEY
```

### 4. Create Production Database

**Option A: Vercel Postgres** (Recommended)
- [ ] In Vercel dashboard, go to Storage
- [ ] Create PostgreSQL database
- [ ] Copy `DATABASE_URL` to Vercel environment
- [ ] Copy `DIRECT_URL` to Vercel environment

**Option B: External Database** (AWS RDS, DigitalOcean, etc.)
- [ ] Create managed PostgreSQL instance
- [ ] Get connection string
- [ ] Add to Vercel environment variables
- [ ] Ensure firewall allows Vercel IPs

### 5. Run Production Migration
```bash
# From local machine, using production database URL:
DATABASE_URL="your-prod-connection-string" pnpm db:push
```
- [ ] Production schema created
- [ ] Tables initialized

### 6. Test Production Deployment
- [ ] Visit `https://your-domain.vercel.app/api/auth/signup`
- [ ] Signup endpoint responds with 405 (expected, needs POST body)
- [ ] No CORS errors
- [ ] No environment variable errors in logs

### 7. Test Production APIs
```bash
# Test signup
curl -X POST https://your-domain.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Should return 201 with user data
```

- [ ] Signup creates users in production DB
- [ ] Login works
- [ ] Portfolio endpoints require auth
- [ ] Sessions persist

---

## 🔍 Post-Deployment Verification

### 1. Check Vercel Logs
```bash
vercel logs
```
- [ ] No error messages
- [ ] Database connections successful
- [ ] No missing environment variables

### 2. Test User Flow
- [ ] Signup works
- [ ] User exists in database
- [ ] Can login with credentials
- [ ] Can fetch portfolios
- [ ] Can create portfolio
- [ ] Can add holdings

### 3. Security Checks
- [ ] No API keys in Vercel logs
- [ ] Secrets not exposed in error messages
- [ ] 401 returned for unauthenticated requests
- [ ] 403 returned for unauthorized access
- [ ] HTTPS enforced (green lock icon)

### 4. Performance Checks
- [ ] Signup < 2 seconds
- [ ] Login < 1 second
- [ ] Fetch portfolio < 1 second
- [ ] API responses < 500ms (for small datasets)

---

## 🛡️ Security Checklist

### Secrets Management
- [ ] `NEXTAUTH_SECRET` is different in dev and prod
- [ ] No secrets in code or git history
- [ ] API keys rotated quarterly
- [ ] `.env.local` in `.gitignore`
- [ ] `.env.example` has no real values

### Database Security
- [ ] PostgreSQL connection uses SSL/TLS
- [ ] Database user has minimal permissions
- [ ] Password is strong (20+ characters)
- [ ] Backups enabled in production
- [ ] Firewall restricts access

### API Security
- [ ] All endpoints check authentication
- [ ] Ownership verified before mutations
- [ ] Input validated with Zod
- [ ] Error messages don't expose internals
- [ ] Rate limiting ready for future (optional)

### Session Security
- [ ] Session expires after 30 days
- [ ] Sessions stored in database
- [ ] JWT tokens signed with secret
- [ ] CSRF protection enabled via NextAuth

---

## 📊 Monitoring Setup

### Error Tracking
- [ ] Set up Sentry or similar (optional)
- [ ] Monitor failed authentications
- [ ] Alert on database connection errors

### Usage Monitoring
- [ ] Track signup count daily
- [ ] Monitor active users
- [ ] Track API error rates

### Database Monitoring
- [ ] Monitor query performance
- [ ] Set up slow query alerts
- [ ] Monitor connection pool usage

---

## 🚨 Rollback Procedure

If something goes wrong:

### Quick Rollback
```bash
# Revert last commit
git revert HEAD
git push origin main

# Vercel auto-deploys previous version
# Check Vercel dashboard for deployment status
```

### Database Rollback
```bash
# If migration failed, revert locally first:
pnpm db:push --force-reset

# Then test locally before redeploying
```

### Emergency: Disable Auth
If auth is breaking signup:
```bash
# Temporarily set demo mode in portfolio API
# (For debugging only, revert before committing)
```

---

## 📝 Deployment Record

After successful deployment, record:

| Item | Value |
|------|-------|
| Deployment Date | YYYY-MM-DD |
| Vercel Project URL | https://... |
| Database | Vercel Postgres / AWS / Other |
| `NEXTAUTH_URL` | https://... |
| Initial Test User | email@example.com |
| Admin Notes | Any special notes |

---

## 🎯 Post-Deployment Todos

After deployment is live:

### Week 1
- [ ] Monitor error rates in logs
- [ ] Test with real users (if applicable)
- [ ] Verify backups are working
- [ ] Document any issues encountered

### Month 1
- [ ] Review authentication logs
- [ ] Check database performance metrics
- [ ] Rotate API keys if needed
- [ ] Plan Phase 2 (UI implementation)

### Quarterly
- [ ] Rotate `NEXTAUTH_SECRET`
- [ ] Update dependencies (`pnpm update`)
- [ ] Review security logs
- [ ] Audit database permissions

---

## 🆘 Troubleshooting During Deployment

### "Environment variables not set"
```bash
# Check Vercel dashboard
# Make sure variables are set for Production scope
# Redeploy after adding variables
vercel env pull
vercel deploy --prod
```

### "Cannot connect to database"
```bash
# Check connection string in Vercel env vars
# Test connection locally:
psql $DATABASE_URL -c "SELECT 1"

# Check firewall if using external database
# Vercel IPs might need to be whitelisted
```

### "NEXTAUTH_SECRET missing"
```bash
# Verify it's set in Vercel dashboard
# Generate new secret locally:
openssl rand -base64 32

# Add to Vercel and redeploy
vercel env add NEXTAUTH_SECRET
vercel deploy --prod
```

### "Database migrations failed"
```bash
# Check Vercel logs for error message
vercel logs

# Try migration locally with prod connection:
DATABASE_URL="prod-string" pnpm db:push

# If that fails, check schema for issues
```

---

## ✅ Final Checklist

- [ ] `.env.local` created and `.gitignore` enforced
- [ ] Database migration successful
- [ ] Local signup/login works
- [ ] Portfolio APIs protected with auth
- [ ] Code pushed to GitHub
- [ ] Environment variables added to Vercel
- [ ] Production database created
- [ ] Production migration run
- [ ] Signup tested in production
- [ ] Login tested in production
- [ ] API ownership verified
- [ ] Error rates monitored
- [ ] Backups enabled
- [ ] Security checklist completed

---

**Status**: Ready for Deployment
**Next Phase**: UI Implementation (login/signup pages)

