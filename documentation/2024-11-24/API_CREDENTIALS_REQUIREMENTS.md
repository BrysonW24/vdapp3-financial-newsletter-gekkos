# API Credentials & Account Requirements

**Created:** 2024-11-24 21:00 UTC
**Status:** CRITICAL - Action Required Before Production
**Purpose:** Identify all third-party API accounts needed and credentials to deliver

---

## 📋 ACCOUNT CREATION CHECKLIST

### Already Implemented ✅
These don't require new accounts - already integrated:

| Service | Purpose | Status | Notes |
|---------|---------|--------|-------|
| **yfinance** | Stock/commodity prices | ✅ | Free, no API key required |
| **YouTube** | Transcript extraction | ✅ | Free, no API key required |
| **OpenAI** | LLM/summarization | ✅ | Needs OPENAI_API_KEY |
| **Anthropic** | LLM/summarization | ✅ | Needs ANTHROPIC_API_KEY |
| **Redis** | Job queue storage | ✅ | Self-hosted or managed service |
| **PostgreSQL** | Database | ✅ | Self-hosted or managed service |

---

## 🔴 ACCOUNTS YOU NEED TO CREATE

### 1. OpenAI (If Not Already Created) ⚠️
**Purpose:** LLM-powered summarization for newsletters and content

**Needed:**
- [ ] OpenAI Account
- [ ] API Key (will provide: `OPENAI_API_KEY`)

**Steps:**
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Create API key in Settings → API keys
4. Copy the key (save it safely, can't view again)

**Cost:** Pay-as-you-go (~$0.002 per 1K tokens)

**Environment Variable:**
```
OPENAI_API_KEY=sk-...
```

---

### 2. Anthropic Claude (If Not Already Created) ⚠️
**Purpose:** Alternative LLM for summarization (higher quality output)

**Needed:**
- [ ] Anthropic Account
- [ ] API Key (will provide: `ANTHROPIC_API_KEY`)

**Steps:**
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Get API key from Account settings
4. Copy the key (save it safely)

**Cost:** Pay-as-you-go (~$0.003 per 1K tokens)

**Environment Variable:**
```
ANTHROPIC_API_KEY=sk-ant-...
```

---

### 3. Redis (For Job Queue) ⚠️
**Purpose:** Persistent job queue for background tasks

**Options:**

#### Option A: Self-Hosted (Free)
```bash
# Install locally
docker run -d -p 6379:6379 redis:latest
```

**Environment Variable:**
```
REDIS_URL=redis://localhost:6379
```

#### Option B: Managed Service (Recommended for Production)
| Service | Cost | Setup |
|---------|------|-------|
| **Redis Cloud** | Free tier + $14-50/mo | https://redis.com/try-free |
| **AWS ElastiCache** | $15-20+/mo | AWS Console |
| **DigitalOcean Redis** | $15+/mo | DigitalOcean Console |

**Environment Variable (managed):**
```
REDIS_URL=redis://user:password@host:port
```

---

### 4. PostgreSQL Database ⚠️
**Purpose:** Persistent data storage for all models

**Options:**

#### Option A: Self-Hosted (Free)
```bash
docker run -d -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:latest
```

**Environment Variable:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/gekkos
```

#### Option B: Managed Service (Recommended for Production)
| Service | Cost | Setup |
|---------|------|-------|
| **Heroku PostgreSQL** | $9-50+/mo | Heroku dashboard |
| **AWS RDS** | $10-20+/mo | AWS Console |
| **DigitalOcean** | $12+/mo | DigitalOcean Console |
| **Railway** | $5+/mo | Railway.app |
| **Vercel Postgres** | $10+/mo | Vercel dashboard |

**Environment Variable (managed):**
```
DATABASE_URL=postgresql://user:password@host:port/database
```

---

### 5. Managed Services for VC/News Data ⏳ OPTIONAL
**Purpose:** Real-time data feeds for VC companies, funding rounds, M&A

Currently: Pulling from internal database and basic APIs
Future: Enhanced data from these sources

| Service | Purpose | Cost | Status |
|---------|---------|------|--------|
| **Crunchbase** | VC funding data | $100+/mo | Optional |
| **PitchBook** | Private market data | Custom | Optional |
| **Preqin** | Alternative assets | Custom | Optional |
| **DataBox** | Financial data aggregation | Custom | Optional |

**Status:** NOT REQUIRED for MVP. Can add later.

---

## 🎯 QUICK ACTION ITEMS

### Highest Priority (Must Have)
1. **OpenAI API Key** - For summarization
   - [ ] Account created
   - [ ] API key generated
   - [ ] Key saved securely

2. **Anthropic API Key** - For summarization alternative
   - [ ] Account created
   - [ ] API key generated
   - [ ] Key saved securely

3. **Redis Connection** - For job queue
   - [ ] Service deployed/created
   - [ ] Connection string tested
   - [ ] Connection string saved

4. **PostgreSQL Connection** - For data storage
   - [ ] Database created
   - [ ] Connection string tested
   - [ ] Migrations ready to run

### Medium Priority (Highly Recommended)
5. **Backend API Key** - For internal API authentication (optional, for security)
   - [ ] Generate in backend config
   - [ ] Share with worker

### Low Priority (Future)
6. **VC Data Sources** - Enhanced data feeds
   - [ ] Evaluate options
   - [ ] Request trial/demo
   - [ ] Plan integration

---

## 📝 ENVIRONMENT VARIABLES NEEDED

### Essential (.env file)
```bash
# LLM Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
AI_PROVIDER=anthropic  # or 'openai'

# Database
DATABASE_URL=postgresql://user:pass@host:5432/gekkos

# Redis (for jobs)
REDIS_URL=redis://user:pass@host:6379

# Backend API
BACKEND_API_URL=http://localhost:8000
API_BASE_URL=https://yourdomain.com/api

# Node environment
NODE_ENV=production
DEBUG=false
```

### Optional
```bash
# Crunchbase (if added later)
CRUNCHBASE_API_KEY=...

# PitchBook (if added later)
PITCHBOOK_API_KEY=...

# Timezone for scheduled jobs
TZ=UTC
```

---

## 🔐 Security Best Practices

### ✅ DO
- [ ] Store keys in `.env` file (never in git)
- [ ] Use different keys for dev/staging/production
- [ ] Rotate API keys regularly (every 90 days)
- [ ] Monitor API usage in dashboards
- [ ] Use environment variables in deployment
- [ ] Enable API rate limits in service settings
- [ ] Use read-only keys where possible

### ❌ DON'T
- ❌ Commit `.env` file to git
- ❌ Share API keys via email/Slack
- ❌ Use same key for multiple environments
- ❌ Leave keys in code comments
- ❌ Expose keys in logs

---

## 💰 ESTIMATED MONTHLY COSTS

### Minimum Setup (MVP)
```
OpenAI API .............. $20-50/month
Anthropic API ........... $20-50/month
Redis Cloud ............. $14/month (free tier available)
PostgreSQL (managed) .... $15/month (Heroku/DigitalOcean)
────────────────────────────────────
TOTAL ................... $69-150/month
```

### Moderate Setup (Production-Ready)
```
OpenAI API .............. $100-200/month
Anthropic API ........... $100-200/month
Redis Cloud ............. $30/month
PostgreSQL (production) . $30/month
Monitoring/Alerts ....... $20/month
────────────────────────────────────
TOTAL ................... $280-480/month
```

### Enterprise Setup
Add:
- Crunchbase API: $100-1000/month
- PitchBook: $1000+/month
- Enhanced monitoring: $50+/month
- Support contracts: varies

---

## 🚀 Setup Instructions by Platform

### Local Development
```bash
# 1. OpenAI
export OPENAI_API_KEY="sk-..."

# 2. Anthropic
export ANTHROPIC_API_KEY="sk-ant-..."

# 3. Redis (Docker)
docker run -d -p 6379:6379 redis:latest
export REDIS_URL="redis://localhost:6379"

# 4. PostgreSQL (Docker)
docker run -d \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:latest
export DATABASE_URL="postgresql://postgres:password@localhost:5432/gekkos"

# 5. Backend API
export BACKEND_API_URL="http://localhost:8000"

# 6. Start worker
cd apps/worker
npm install
npm run dev
```

### Production Deployment (Heroku)
```bash
# 1. Set config vars
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set ANTHROPIC_API_KEY=sk-ant-...
heroku config:set DATABASE_URL=...
heroku config:set REDIS_URL=...
heroku config:set BACKEND_API_URL=https://api.yourdomain.com
heroku config:set NODE_ENV=production

# 2. Deploy
git push heroku main
```

### Production Deployment (Docker)
```yaml
# docker-compose.yml
version: '3.8'
services:
  redis:
    image: redis:latest
    ports:
      - "6379:6379"

  postgres:
    image: postgres:latest
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"

  worker:
    build: ./apps/worker
    environment:
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      BACKEND_API_URL: ${BACKEND_API_URL}
      NODE_ENV: production
    depends_on:
      - redis
      - postgres
```

---

## ✅ VERIFICATION CHECKLIST

Before going to production, verify:

### API Keys ✅
- [ ] OpenAI key works
- [ ] Anthropic key works
- [ ] Redis connection works
- [ ] PostgreSQL connection works
- [ ] Backend API is reachable

### Jobs ✅
- [ ] Commodity jobs run successfully
- [ ] VC jobs run successfully
- [ ] Portfolio jobs run successfully
- [ ] Chart jobs run successfully
- [ ] No errors in worker logs

### Database ✅
- [ ] Migrations applied
- [ ] All 17 tables created
- [ ] Indexes created
- [ ] Relationships intact

### Performance ✅
- [ ] API response time < 500ms
- [ ] Job completion time reasonable
- [ ] No memory leaks
- [ ] Logging works

---

## 📞 NEED HELP?

### OpenAI Issues
- Docs: https://platform.openai.com/docs
- Support: https://help.openai.com

### Anthropic Issues
- Docs: https://docs.anthropic.com
- Support: support@anthropic.com

### Redis Issues
- Docs: https://redis.io/docs
- Redis Cloud: https://redis.com/support

### PostgreSQL Issues
- Docs: https://www.postgresql.org/docs
- Service Support: Your hosting provider

---

## 📊 SUMMARY TABLE

| Item | Required | Cost | Setup Time |
|------|----------|------|------------|
| OpenAI API | ✅ | $20-200/mo | 5 min |
| Anthropic API | ✅ | $20-200/mo | 5 min |
| Redis | ✅ | Free-$30/mo | 5-30 min |
| PostgreSQL | ✅ | Free-$30/mo | 5-30 min |
| **Total** | | **$40-260/mo** | **20-65 min** |

---

**Status:** Ready to create accounts
**Next Step:** Provide the API keys and connection strings
**Timeline:** Can set up in 1-2 hours

---

*Once you provide these credentials, the worker will be fully operational and ready to start processing jobs.*
