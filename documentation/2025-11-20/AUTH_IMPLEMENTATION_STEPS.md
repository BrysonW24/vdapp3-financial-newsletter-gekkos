# 🔐 Authentication Implementation - Step by Step

**Goal**: Add login/signup to newsletter in phases
**Estimated Time**: 2-3 hours for Phase 1
**Difficulty**: Medium

---

## Phase 1: Database Schema (30 minutes)

### Step 1.1: Update Prisma Schema

Edit `packages/database/prisma/schema.prisma`:

```bash
# At the end of the file, BEFORE closing brace, add:

// Authentication models
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  password      String?   // bcrypt hashed - only for credentials auth
  image         String?

  // Relations
  accounts      Account[]
  sessions      Session[]
  portfolios    Portfolio[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
  @@map("users")
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  user               User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  type               String
  provider           String
  providerAccountId  String

  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  @@unique([provider, providerAccountId])
  @@index([userId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expires      DateTime

  @@index([userId])
  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// UPDATE existing Portfolio model
model Portfolio {
  id          String   @id @default(cuid())
  userId      String   @relation("UserPortfolios")  // ADD THIS LINE
  user        User     @relation("UserPortfolios", fields: [userId], references: [id], onDelete: Cascade)  // ADD THIS LINE

  name        String
  type        String
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  holdings    Holding[]
  newsAlerts  NewsAlert[]

  @@index([userId])  // ADD THIS LINE
  @@map("portfolios")
}
```

### Step 1.2: Create Migration

```bash
cd packages/database

# Create migration
pnpm prisma migrate dev --name add_authentication

# Name it: add_authentication
# This creates SQL and updates schema
```

### Step 1.3: Verify Database

```bash
# Open Prisma Studio to see new tables
pnpm prisma studio
```

---

## Phase 2: Install Dependencies (10 minutes)

```bash
cd apps/web

# Install NextAuth and crypto
pnpm add next-auth@5 bcryptjs

# Install types
pnpm add -D @types/bcryptjs

# Install Prisma adapter
pnpm add @auth/prisma-adapter

# Optional: OAuth providers
pnpm add @auth/google-provider @auth/github-provider
```

---

## Phase 3: Create Auth Configuration (20 minutes)

### Step 3.1: Create Auth Setup File

Create `apps/web/src/app/auth/auth.ts`:

```typescript
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],

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
  },

  pages: {
    signIn: '/auth/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
})
```

### Step 3.2: Create Route Handler

Create `apps/web/src/app/auth/route.ts`:

```typescript
import { handlers } from '@/app/auth/auth'
export const { GET, POST } = handlers
```

---

## Phase 4: Create Login Page (30 minutes)

Create `apps/web/src/app/auth/login/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border-2 border-slate-200 p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-center text-slate-600 mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-gecko-500 hover:bg-gecko-600 disabled:opacity-50 text-white font-bold rounded-lg"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-gecko-600 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
```

---

## Phase 5: Create Signup Page (30 minutes)

Create `apps/web/src/app/auth/signup/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

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

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Signup failed')
        setLoading(false)
        return
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/')
      }
    } catch (err) {
      setError('An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border-2 border-slate-200 p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Join Today</h1>
        <p className="text-center text-slate-600 mb-8">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-gecko-500 hover:bg-gecko-600 disabled:opacity-50 text-white font-bold rounded-lg"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-gecko-600 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
```

---

## Phase 6: Create Signup API (15 minutes)

Create `apps/web/src/app/api/auth/signup/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
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

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
  }
}
```

---

## Phase 7: Environment Variables (5 minutes)

Update `.env.local`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=use-openssl-rand-base64-32-to-generate

# Generate secret:
# openssl rand -base64 32
```

To generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## Phase 8: Update Protected APIs (20 minutes)

Update `apps/web/src/app/api/portfolio/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { auth } from '@/app/auth/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const portfolios = await db.portfolio.findMany({
      where: { userId: session.user.id },
      include: { holdings: true },
    })

    return NextResponse.json({ portfolios })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

---

## Quick Testing

```bash
# 1. Start dev server
pnpm dev

# 2. Visit signup
# http://localhost:3000/auth/signup

# 3. Create account
# email: test@example.com
# password: password123

# 4. Should redirect to home

# 5. Refresh - you're still logged in (session works!)

# 6. Try API - should return YOUR portfolios
# curl http://localhost:3000/api/portfolio
```

---

## Checklist

- [ ] Database schema updated (Step 1.1)
- [ ] Migration created (Step 1.2)
- [ ] Dependencies installed (Phase 2)
- [ ] Auth config created (Phase 3)
- [ ] Login page created (Phase 4)
- [ ] Signup page created (Phase 5)
- [ ] Signup API created (Phase 6)
- [ ] Environment variables set (Phase 7)
- [ ] Portfolio API protected (Phase 8)
- [ ] Test signup works
- [ ] Test login works
- [ ] Test portfolios are per-user

---

## Next: Optional Enhancements

Once basic auth works, you can add:
- User settings page
- Profile picture upload
- Email verification
- OAuth (Google, GitHub)
- Remember me checkbox
- Password reset flow
- Rate limiting

**But the MVP works without these!**

---

**Ready to implement?** Start with Phase 1 (Database)! 🚀
