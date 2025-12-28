# 🔐 Authentication Setup Guide

**Status**: Implementation Plan
**Approach**: NextAuth.js v5 + Prisma + Email/Password + OAuth

---

## Architecture Overview

```
┌──────────────────────────────────────────────────┐
│         User Authentication System               │
├──────────────────────────────────────────────────┤
│                                                  │
│  Frontend                                        │
│  ├─ Login Page (/auth/login)                    │
│  ├─ Signup Page (/auth/signup)                  │
│  ├─ Protected Routes (require auth)             │
│  └─ User Menu (profile, logout)                 │
│                                                  │
│  NextAuth.js (Authentication)                   │
│  ├─ Email/Password provider                     │
│  ├─ Google OAuth (optional)                     │
│  ├─ GitHub OAuth (optional)                     │
│  ├─ Session management                          │
│  └─ JWT tokens                                  │
│                                                  │
│  Database (Prisma + PostgreSQL)                 │
│  ├─ User model                                  │
│  ├─ Account model (OAuth)                       │
│  ├─ Session model                               │
│  └─ VerificationToken model                     │
│                                                  │
│  API Middleware                                 │
│  ├─ getServerSession() checks                   │
│  ├─ User ID extraction                          │
│  └─ Database queries with userId                │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Step 1: Update Prisma Schema

Add authentication models to `packages/database/prisma/schema.prisma`:

```prisma
// User account
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  password      String?   // bcrypt hashed
  image         String?

  // Relations
  accounts      Account[]
  sessions      Session[]
  portfolios    Portfolio[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}

// OAuth accounts linked to user
model Account {
  id                 String  @id @default(cuid())
  userId             String
  user               User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  type               String  // 'oauth' | 'email' | 'credentials'
  provider           String  // 'google' | 'github' | 'email'
  providerAccountId  String

  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

// NextAuth session tokens
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expires      DateTime

  @@map("sessions")
}

// Email verification tokens
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// Update Portfolio model to include userId
model Portfolio {
  id          String   @id @default(cuid())
  userId      String   // New: link to user
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  name        String
  type        String
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  holdings    Holding[]
  newsAlerts  NewsAlert[]

  @@index([userId])
  @@map("portfolios")
}
```

---

## Step 2: Install Dependencies

```bash
cd apps/web

# NextAuth and authentication
pnpm add next-auth@5.0.0 bcryptjs

# Types
pnpm add -D @types/bcryptjs

# Database adapter (if using)
pnpm add @auth/prisma-adapter

# Optional: OAuth providers
pnpm add @auth/google-provider @auth/github-provider
```

---

## Step 3: Create NextAuth Configuration

Create `apps/web/src/app/auth/auth.ts`:

```typescript
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from '@auth/google-provider'
import GitHub from '@auth/github-provider'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    // Email/Password authentication
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentialsSchema.parse(credentials)

          // Find user by email
          const user = await db.user.findUnique({ where: { email } })
          if (!user) return null

          // Check password
          if (!user.password) return null
          const isPasswordValid = await bcrypt.compare(password, user.password)
          if (!isPasswordValid) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch {
          return null
        }
      },
    }),

    // OAuth providers (optional)
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after login
      if (url.startsWith('/')) return `${baseUrl}/dashboard`
      return baseUrl
    },
  },

  events: {
    async signIn({ user }) {
      console.log(`User ${user.email} signed in`)
    },

    async signOut() {
      console.log('User signed out')
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update every 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === 'development',
})
```

---

## Step 4: Create Auth Route Handlers

Create `apps/web/src/app/auth/route.ts`:

```typescript
import { handlers } from '@/app/auth/auth'

export const { GET, POST } = handlers
```

---

## Step 5: Create Login Page

Create `apps/web/src/app/auth/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border-2 border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">
          Welcome Back
        </h1>
        <p className="text-center text-slate-600 mb-8">
          Sign in to your newsletter account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-gecko-500 hover:bg-gecko-600 text-white font-bold rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* OAuth Options */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span>🔍</span>
            Sign in with Google
          </button>

          <button
            onClick={() => signIn('github')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span>🐙</span>
            Sign in with GitHub
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-center text-slate-600 mt-6">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-gecko-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
```

---

## Step 6: Create Signup Page

Create `apps/web/src/app/auth/signup/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import bcrypt from 'bcryptjs'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: hashedPassword,
          name,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Signup failed')
        return
      }

      // Auto-login
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/dashboard')
      } else {
        setError('Signup successful but login failed. Please try logging in.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border-2 border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">
          Join the Newsletter
        </h1>
        <p className="text-center text-slate-600 mb-8">
          Create your account to get started
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-gecko-500 hover:bg-gecko-600 text-white font-bold rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* OAuth Options */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span>🔍</span>
            Sign up with Google
          </button>

          <button
            onClick={() => signIn('github')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span>🐙</span>
            Sign up with GitHub
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-slate-600 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-gecko-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
```

---

## Step 7: Create Signup API Endpoint

Create `apps/web/src/app/api/auth/signup/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = signupSchema.parse(body)

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      )
    }

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password,
        name: name || email.split('@')[0],
      },
    })

    // Create default portfolio
    await db.portfolio.create({
      data: {
        userId: user.id,
        name: 'My Investments',
        type: 'mixed',
      },
    })

    return NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    )
  }
}
```

---

## Step 8: Protect API Endpoints

Update portfolio API endpoints to require authentication:

`apps/web/src/app/api/portfolio/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { auth } from '@/app/auth/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's portfolios
    const portfolios = await db.portfolio.findMany({
      where: { userId: session.user.id },
      include: { holdings: true },
    })

    return NextResponse.json({ portfolios })
  } catch (error) {
    console.error('Error fetching portfolios:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, type } = body

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const portfolio = await db.portfolio.create({
      data: {
        userId: session.user.id,
        name,
        type,
      },
    })

    return NextResponse.json({ portfolio }, { status: 201 })
  } catch (error) {
    console.error('Error creating portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    )
  }
}
```

---

## Step 9: Environment Variables

Add to `.env.local`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Database (existing)
DATABASE_URL=your-database-url
```

---

## Step 10: Middleware for Protected Routes

Create `apps/web/src/middleware.ts`:

```typescript
import { auth } from '@/app/auth/auth'
import { NextResponse } from 'next/server'

const publicRoutes = [
  '/auth/login',
  '/auth/signup',
  '/',
]

export async function middleware(request: any) {
  const session = await auth()

  // Protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Redirect to dashboard if already logged in
  if (
    (request.nextUrl.pathname === '/auth/login' ||
     request.nextUrl.pathname === '/auth/signup') &&
    session
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## Step 11: User Profile/Settings Page

Create `apps/web/src/app/dashboard/settings/page.tsx`:

```typescript
'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        {/* User Info */}
        <div className="bg-white rounded-lg border-2 border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Email
              </label>
              <p className="text-slate-900">{session.user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Name
              </label>
              <p className="text-slate-900">{session.user?.name || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Portfolios */}
        <div className="bg-white rounded-lg border-2 border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Your Portfolios</h2>
          <Link
            href="/dashboard/portfolios"
            className="text-gecko-600 hover:underline"
          >
            Manage Your Portfolios →
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ redirect: true, callbackUrl: '/auth/login' })}
          className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
```

---

## Installation Steps

```bash
# 1. Install dependencies
pnpm add next-auth@5.0.0 bcryptjs @auth/prisma-adapter

# 2. Update Prisma schema
# (Add models above)

# 3. Create migration
pnpm prisma migrate dev --name add_auth

# 4. Create auth files
# (All files above)

# 5. Set environment variables
# (Add to .env.local)

# 6. Run development server
pnpm dev

# 7. Test at http://localhost:3000/auth/signup
```

---

## Testing the Auth Flow

### Test Email/Password Signup
1. Navigate to `/auth/signup`
2. Enter: test@example.com / password123 / John
3. Should redirect to `/dashboard`
4. Check database: User created with hashed password

### Test Login
1. Navigate to `/auth/login`
2. Enter: test@example.com / password123
3. Should redirect to `/dashboard`

### Test Protection
1. Logout
2. Try visiting `/dashboard`
3. Should redirect to `/auth/login`

### Test Portfolio Integration
1. Create portfolio at `/dashboard/portfolios`
2. Database should show `userId` populated
3. Users can't see other users' portfolios

---

## Security Best Practices

✅ **Passwords**: Bcrypt hashing with salt rounds
✅ **Sessions**: JWT-based, 30-day expiry
✅ **CSRF**: NextAuth handles CSRF tokens
✅ **Rate Limiting**: (to add) Prevent brute force
✅ **Email Verification**: (to add) Verify email ownership
✅ **2FA**: (optional) Add TOTP support

---

## Next Steps

1. ✅ Database schema
2. ✅ NextAuth configuration
3. ✅ Login/Signup pages
4. ✅ API protection
5. ⏳ Email verification
6. ⏳ Rate limiting
7. ⏳ Two-factor authentication

---

This setup gives you a complete authentication system integrated with the portfolio feature!
