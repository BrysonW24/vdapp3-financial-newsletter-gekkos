# 🔧 Environment Variables Setup Guide

This guide explains all environment variables required for the newsletter application, including authentication, database, and external APIs.

---

## Quick Start

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

---

## 📋 Required Variables

### Authentication (NextAuth.js)

**`NEXTAUTH_URL`**
- **Type**: `string` (URL)
- **Required**: Yes
- **Purpose**: The URL where your application is deployed
- **Example**:
  - Development: `http://localhost:3000`
  - Production: `https://newsletter-daily.vercel.app`
- **Note**: Must match your domain in production

**`NEXTAUTH_SECRET`**
- **Type**: `string` (random)
- **Required**: Yes
- **Purpose**: Secret key for encrypting JWT tokens and sessions
- **Generation**:
  ```bash
  openssl rand -base64 32
  ```
- **Example**: `kxPmN2r7sQ9mL3vZ8wK1nJ4cR6tY9fH5gB8dE2xW=`
- **Security**:
  - Keep this secret (never commit to git)
  - Rotate in production periodically
  - Different value per environment

---

### Database (PostgreSQL)

**`DATABASE_URL`**
- **Type**: `string` (connection string)
- **Required**: Yes
- **Purpose**: PostgreSQL connection string for Prisma ORM
- **Format**: `postgresql://user:password@host:port/database?schema=public`
- **Example**:
  ```
  postgresql://newsletter_user:secure_password@localhost:5432/newsletter_db?schema=public
  ```
- **Components**:
  - `user`: Database username
  - `password`: Database password
  - `host`: Database server hostname/IP
  - `port`: Database port (default: 5432)
  - `database`: Database name
  - `schema`: Prisma schema (usually `public`)
- **Production**: Use managed database service (Vercel Postgres, AWS RDS, etc.)

**`DIRECT_URL`** (Optional but Recommended)
- **Type**: `string` (connection string)
- **Required**: No (but recommended)
- **Purpose**: Direct connection URL for migrations (bypasses connection pooling)
- **Format**: Same as `DATABASE_URL` but without pooling parameters
- **Example**:
  ```
  postgresql://newsletter_user:secure_password@localhost:5432/newsletter_db?schema=public
  ```
- **Note**: Use this for migrations while `DATABASE_URL` uses PgBouncer for app connections
- **Vercel Postgres**: Automatically provided in Vercel environment

---

### News API (Portfolio Personalization)

**`NEWS_API_KEY`**
- **Type**: `string` (API key)
- **Required**: Yes (for portfolio news feature)
- **Purpose**: API key for NewsAPI.org to fetch news articles
- **Where to Get**:
  1. Visit [newsapi.org](https://newsapi.org)
  2. Sign up for free account
  3. Copy your API key from dashboard
- **Example**: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
- **Rate Limits**:
  - Free tier: 100 requests/day
  - Paid tier: Higher limits
- **Note**: Keep this secret, never commit to git

---

### Optional OAuth Providers

If you want to enable social login (currently commented out in auth config):

**`GOOGLE_CLIENT_ID`**
- **Type**: `string`
- **Purpose**: Google OAuth client ID for login
- **Where to Get**:
  1. Visit [Google Cloud Console](https://console.cloud.google.com)
  2. Create OAuth 2.0 credentials
  3. Copy Client ID

**`GOOGLE_CLIENT_SECRET`**
- **Type**: `string`
- **Purpose**: Google OAuth client secret
- **Where to Get**: Same as above, copy Client Secret
- **Security**: Never expose in frontend code

**`GITHUB_CLIENT_ID`**
- **Type**: `string`
- **Purpose**: GitHub OAuth app client ID
- **Where to Get**:
  1. Visit GitHub Settings → Developer settings → OAuth Apps
  2. Create new OAuth App
  3. Copy Client ID

**`GITHUB_CLIENT_SECRET`**
- **Type**: `string`
- **Purpose**: GitHub OAuth app client secret
- **Where to Get**: Same as above, copy Client Secret
- **Security**: Never expose in frontend code

---

## 🗂️ Environment Files

### Development (`.env.local`)

Used locally when running `pnpm dev`:

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here

# Database (local PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/newsletter_dev
DIRECT_URL=postgresql://user:password@localhost:5432/newsletter_dev

# APIs
NEWS_API_KEY=your-newsapi-key-here

# OAuth (optional, for testing)
GOOGLE_CLIENT_ID=your-google-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-secret
GITHUB_CLIENT_ID=your-github-id
GITHUB_CLIENT_SECRET=your-github-secret
```

### Production (Vercel)

Set via Vercel Dashboard → Settings → Environment Variables:

```env
# Authentication
NEXTAUTH_URL=https://newsletter-daily.vercel.app
NEXTAUTH_SECRET=your-production-secret-here

# Database (Vercel Postgres or managed service)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# APIs
NEWS_API_KEY=your-newsapi-key-here
```

---

## 🚀 Setup Instructions

### Step 1: Generate NEXTAUTH_SECRET

```bash
# Using openssl (macOS/Linux)
openssl rand -base64 32

# Using node (Windows/any OS)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using PowerShell (Windows)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copy the output and add it to `.env.local`.

### Step 2: Set up Database

**Option A: Local PostgreSQL**

```bash
# Install PostgreSQL
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql
# Windows: Download from postgresql.org

# Start PostgreSQL
pg_ctl -D /usr/local/var/postgres start

# Create database
createdb newsletter_dev

# Update .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/newsletter_dev
DIRECT_URL=postgresql://user:password@localhost:5432/newsletter_dev
```

**Option B: Vercel Postgres** (Recommended for Production)

1. Push to GitHub
2. Connect repository to Vercel
3. Vercel auto-creates PostgreSQL database
4. Copy `DATABASE_URL` from Vercel dashboard to `.env.local`

**Option C: Cloud Database** (AWS RDS, DigitalOcean, etc.)

1. Create managed PostgreSQL instance
2. Copy connection string to `.env.local`
3. Ensure firewall allows connections from your IP

### Step 3: Get NEWS_API_KEY

1. Visit [newsapi.org](https://newsapi.org)
2. Sign up for free account
3. Navigate to "API Key" section
4. Copy your key
5. Add to `.env.local`: `NEWS_API_KEY=your-key-here`

### Step 4: Run Migrations

```bash
cd apps/web

# Create tables in database
pnpm db:push

# Or if using migrations:
pnpm prisma migrate deploy
```

### Step 5: Verify Setup

```bash
# Start development server
pnpm dev

# Visit http://localhost:3000
# Try signing up at /auth/signup
```

---

## 🔒 Security Best Practices

### 1. Never Commit Secrets

```bash
# .gitignore should include:
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 2. Use Different Secrets Per Environment

| Environment | `NEXTAUTH_SECRET` | `DATABASE_URL` | `NEWS_API_KEY` |
|-------------|-------------------|----------------|----------------|
| Development | Generated locally | Local PostgreSQL | Dev key (free) |
| Staging | Different secret | Staging DB | Staging key |
| Production | Different secret | Production DB | Production key |

### 3. Rotate Secrets Periodically

```bash
# When changing NEXTAUTH_SECRET:
1. Generate new secret
2. Update .env.local (dev) or Vercel dashboard (prod)
3. Restart application
4. All existing sessions will be invalidated (users must login again)
```

### 4. Protect API Keys

- Store keys in `.env.local` (never in code)
- Use Vercel's environment variables feature for production
- Rotate API keys quarterly
- Monitor API key usage in provider dashboard

### 5. Database Connection Security

```env
# Good: PostgreSQL connection with SSL
DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require

# Better: Connection pooling for performance
DATABASE_URL=postgresql://user:password@pool.host:5432/db?sslmode=require
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"

```bash
# Check connection string format
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Verify Prisma can connect
pnpm prisma db execute --stdin < /dev/null
```

### "NEXTAUTH_SECRET not set"

```bash
# Verify it's in .env.local
cat .env.local | grep NEXTAUTH

# Restart dev server
pnpm dev
```

### "NEWS_API_KEY invalid"

```bash
# Test API key
curl "https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_KEY"

# Expected response: {"status":"ok","totalResults":...}
```

### "PostgreSQL connection timeout"

```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check firewall rules
sudo ufw allow 5432/tcp

# Test connection
psql -h localhost -U user -d newsletter_dev
```

### ".env.local changes not taking effect"

```bash
# Restart development server (Ctrl+C then pnpm dev)
# Hot reload doesn't pick up environment variable changes

# Or reload in one command:
pnpm dev --reset
```

---

## 📚 Environment Variable Reference

| Variable | Type | Required | Dev | Prod | Sensitive |
|----------|------|----------|-----|------|-----------|
| `NEXTAUTH_URL` | URL | Yes | ✓ | ✓ | No |
| `NEXTAUTH_SECRET` | String | Yes | ✓ | ✓ | Yes |
| `DATABASE_URL` | String | Yes | ✓ | ✓ | Yes |
| `DIRECT_URL` | String | No | ✓ | ✓ | Yes |
| `NEWS_API_KEY` | String | Yes | ✓ | ✓ | Yes |
| `GOOGLE_CLIENT_ID` | String | No | ✓ | ✓ | No |
| `GOOGLE_CLIENT_SECRET` | String | No | ✓ | ✓ | Yes |
| `GITHUB_CLIENT_ID` | String | No | ✓ | ✓ | No |
| `GITHUB_CLIENT_SECRET` | String | No | ✓ | ✓ | Yes |

---

## 📝 Example .env.local

```env
# 🔐 Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=kxPmN2r7sQ9mL3vZ8wK1nJ4cR6tY9fH5gB8dE2xW=

# 💾 Database
DATABASE_URL=postgresql://newsletter_user:secure_pass@localhost:5432/newsletter_dev?schema=public
DIRECT_URL=postgresql://newsletter_user:secure_pass@localhost:5432/newsletter_dev?schema=public

# 📰 News API
NEWS_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# (Optional) OAuth Providers
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GITHUB_CLIENT_ID=...
# GITHUB_CLIENT_SECRET=...
```

---

## 🎯 Next Steps

After setting up environment variables:

1. **Run migrations**: `pnpm db:push`
2. **Start dev server**: `pnpm dev`
3. **Create test account**: Visit `/auth/signup`
4. **Test APIs**: Use Postman or `curl` to test endpoints
5. **Deploy to Vercel**: Push to GitHub, configure env vars in Vercel dashboard

---

## 🆘 Get Help

- **Prisma Database Issues**: [docs.prisma.io](https://docs.prisma.io)
- **NextAuth.js Issues**: [next-auth.js.org](https://next-auth.js.org)
- **NewsAPI Support**: [newsapi.org/docs](https://newsapi.org/docs)
- **Vercel Deployment**: [vercel.com/docs](https://vercel.com/docs)

---

**Last Updated**: November 2024
**Status**: ✅ Complete and Ready for Use
