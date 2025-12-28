# Worker Deployment Guide

**Status:** Ready to Deploy (After Phase 4 Database Setup)
**Framework:** BullMQ + Node.js
**Deployment Targets:** Railway, Render, or similar

---

## 🎯 What is the Worker?

The worker is a background service that:
- ✅ Processes jobs from the Redis queue
- ✅ Fetches market data from APIs
- ✅ Generates newsletter content with AI
- ✅ Runs on a schedule (daily at 6 AM UTC)
- ✅ Handles long-running tasks without blocking the main app
- ✅ Retries failed jobs automatically

---

## 📁 Worker Files

```
apps/worker/
├── src/
│   ├── index.ts              # Main worker entry point
│   ├── jobs/
│   │   ├── marketData.ts     # Fetch market data
│   │   ├── generateContent.ts # AI content generation
│   │   └── newsletter.ts      # Newsletter assembly
│   ├── services/
│   │   ├── queue.ts          # BullMQ setup
│   │   ├── redis.ts          # Redis connection
│   │   └── scheduler.ts      # Cron scheduling
│   └── config.ts             # Configuration
├── package.json
├── tsconfig.json
└── Dockerfile                # For containerized deployment
```

---

## 🚀 Deployment Options

### Option 1: Railway (Recommended - Simple)

**Cost:** $5/month base + usage
**Setup Time:** 5 minutes
**Complexity:** Very Simple

#### Steps:

1. **Create Railway Account**
   - Go to https://railway.app/
   - Sign in with GitHub
   - Create new project

2. **Connect Your Repository**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Authorize Railway to access your GitHub
   - Select `newsletter-daily-prod` repository

3. **Configure Environment Variables**
   - In Railway dashboard, go to project
   - Click "Variables"
   - Add:
     ```
     REDIS_URL=redis://...          # From Phase 4
     DATABASE_URL=postgresql://...  # From Phase 4
     OPENAI_API_KEY=sk-...         # From earlier
     ANTHROPIC_API_KEY=sk-...      # From earlier
     NODE_ENV=production
     WORKER_CRON_SCHEDULE=0 6 * * * # Daily at 6 AM UTC
     WORKER_PORT=3001
     ```

4. **Deploy Worker Service**
   - Click "Add Service"
   - Select "GitHub repo"
   - Choose your repository again
   - Set:
     - **Root Directory:** `apps/worker`
     - **Build Command:** `pnpm install && pnpm build`
     - **Start Command:** `pnpm start`

5. **Monitor Deployment**
   - Railway shows logs in real-time
   - Wait for "Running" status
   - Check logs for errors

---

### Option 2: Render (Good Alternative)

**Cost:** $7/month base + usage
**Setup Time:** 5 minutes
**Complexity:** Very Simple

#### Steps:

1. **Create Render Account**
   - Go to https://render.com/
   - Sign in with GitHub

2. **Create New Service**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repository

3. **Configure**
   - **Name:** `newsletter-daily-prod-worker`
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `cd apps/worker && pnpm start`

4. **Set Environment Variables**
   - Add all variables from Railway section above
   - Render encrypts them automatically

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

---

### Option 3: Fly.io (Cost-Effective)

**Cost:** $3-5/month base
**Setup Time:** 10 minutes
**Complexity:** Moderate

#### Installation:
```bash
npm install -g @flydotio/flyctl
flyctl auth login
```

#### Deployment:
```bash
cd apps/worker
flyctl launch
# Follow prompts
flyctl deploy
```

---

### Option 4: Self-Hosted (Advanced)

**Cost:** Depends on server
**Setup Time:** 30+ minutes
**Complexity:** High

#### Using a VPS (DigitalOcean, AWS, etc.):

1. **Create server with Node.js 18+**
2. **Clone repository**
   ```bash
   git clone https://github.com/BrysonW24/newsletter-daily-prod.git
   cd newsletter-daily-prod
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Create .env file**
   ```bash
   cp .env.example .env
   # Edit with your credentials
   nano .env
   ```

5. **Build worker**
   ```bash
   cd apps/worker
   pnpm build
   ```

6. **Run with PM2** (process manager)
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name "newsletter-worker"
   pm2 save
   pm2 startup
   ```

7. **Monitor logs**
   ```bash
   pm2 logs newsletter-worker
   ```

---

## 📊 Monitoring & Logs

### Railway Logs
1. Go to project dashboard
2. Click "Deployments"
3. Click service name
4. View real-time logs

### Check Worker Status
```bash
# SSH into your server and check:
pm2 status
pm2 logs
```

### Test a Job Manually
```bash
# Trigger a market data fetch
curl -X POST http://localhost:3001/api/jobs/market-data

# Check job status
curl http://localhost:3001/api/jobs/status
```

---

## 🔄 How the Worker Processes Jobs

```
Redis Queue
    ↓
Worker Service
    ├─→ Market Data Job
    │   └─→ Fetch prices from APIs
    │   └─→ Store in database
    │
    ├─→ Content Generation Job
    │   └─→ Call OpenAI/Anthropic
    │   └─→ Generate sections
    │   └─→ Store content
    │
    └─→ Newsletter Assembly Job
        └─→ Compile all sections
        └─→ Create final newsletter
        └─→ Trigger email delivery
```

---

## ⏰ Cron Schedule

**Current Schedule:** `0 6 * * *` (6 AM UTC daily)

### Common Schedules:
- `0 6 * * *` → 6 AM UTC daily
- `0 6 * * 1-5` → 6 AM UTC weekdays only
- `0 6,18 * * *` → 6 AM & 6 PM UTC daily
- `*/30 * * * *` → Every 30 minutes
- `0 */4 * * *` → Every 4 hours

### Timezone Notes:
- Times are in **UTC**
- Convert to your timezone:
  - UTC-5 (EST): 6 AM UTC = 1 AM EST
  - UTC-8 (PST): 6 AM UTC = 10 PM PST (previous day)
  - UTC+0 (GMT): 6 AM UTC = 6 AM GMT
  - UTC+8 (Singapore): 6 AM UTC = 2 PM SGT

---

## 🛠️ Troubleshooting

### Worker won't start
**Check:**
- Redis connection string is correct
- Node.js version is 18+
- All environment variables are set
- Check logs for detailed error

### Jobs failing
**Check:**
- Database connection works
- API keys are valid
- Redis connection is stable
- Job timeouts aren't too short

### High memory usage
**Solutions:**
- Reduce job concurrency (default: 5)
- Increase server RAM
- Check for memory leaks in code
- Monitor with: `pm2 monit`

### Jobs stuck in queue
**Solutions:**
- Restart worker
- Clear stuck jobs: `npx bullmq-cli:flush`
- Check worker logs
- Verify Redis connection

---

## 📈 Scaling the Worker

### Single Worker (Current)
- Handles ~100 jobs/hour
- Uses ~200 MB RAM
- Good for hobby projects

### Multiple Workers
```bash
# Run 3 worker processes
pm2 start dist/index.js -i 3 --name "newsletter-worker"
```

### Distributed Workers
- Run multiple workers on different servers
- All share same Redis queue
- One handles jobs faster
- Cost increases but resilience improves

---

## 🔐 Security Best Practices

### Environment Variables
- ✅ Never commit `.env` to git
- ✅ Use Vercel/Railway for sensitive data
- ✅ Rotate API keys quarterly
- ✅ Audit who has access

### Worker Isolation
- ✅ Run on separate server from web app
- ✅ Use firewall rules to restrict access
- ✅ Monitor for suspicious activity
- ✅ Rate limit queue operations

### Data Protection
- ✅ Encrypt database in transit (use SSL/TLS)
- ✅ Encrypt Redis with password
- ✅ Regular backups of database
- ✅ Audit logs for all changes

---

## 📝 Deployment Checklist

- [ ] Phase 4 database setup complete
- [ ] All credentials in Vercel environment variables
- [ ] Tested database connection locally
- [ ] Choose deployment platform (Railway/Render/etc)
- [ ] Create account on chosen platform
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Deploy worker service
- [ ] Check deployment status
- [ ] Review logs for errors
- [ ] Test job execution
- [ ] Monitor for 24 hours
- [ ] Set up alerts/notifications
- [ ] Document deployment process

---

## 🚀 First Deployment Checklist

```bash
# 1. Verify worker code builds locally
cd apps/worker
pnpm install
pnpm build

# 2. Test locally with Redis
REDIS_URL=redis://localhost:6379 NODE_ENV=development pnpm start

# 3. Check worker is listening
curl http://localhost:3001/health

# 4. Trigger a test job
curl -X POST http://localhost:3001/api/jobs/test

# 5. If all good, deploy to Railway/Render
# Follow steps above for your chosen platform
```

---

## 📊 What to Monitor

### Worker Health
- Job completion rate (should be >95%)
- Average job duration (should be <5 minutes)
- Queue depth (should stay <100)
- Error rate (should be <5%)

### System Health
- Memory usage (should be <500 MB)
- CPU usage (should be <50% idle)
- Network latency (should be <100ms)
- Uptime (should be >99%)

### Cost
- Redis operations (should be <100K/month)
- Database queries (should be <1M/month)
- API calls (track separately)
- Server costs (should be $5-20/month)

---

## 🎯 After Deployment

1. **Test Manual Job Execution**
   ```bash
   curl -X POST http://worker-url/api/jobs/market-data
   ```

2. **Wait for Scheduled Run**
   - Wait for cron schedule time
   - Check logs for execution
   - Verify data in database

3. **Monitor for 7 Days**
   - Watch logs daily
   - Check error rates
   - Verify jobs complete successfully
   - Monitor costs

4. **Set Up Alerts**
   - Email on job failure
   - Alert on high memory usage
   - Alert on queue overflow
   - Alert on database errors

---

## 🆘 Support

**Issues?**
- Check GitHub Issues: https://github.com/BrysonW24/newsletter-daily-prod/issues
- Railway Support: https://railway.app/support
- Render Support: https://render.com/docs
- BullMQ Docs: https://docs.bullmq.io/

---

**Status:** ✅ READY TO DEPLOY
**Next Step:** Complete Phase 4 database setup, then follow deployment steps above
**Estimated Time:** 5-15 minutes depending on chosen platform

