# 🔐 Authentication Quick Reference

**Status**: Planned & Documented
**Implementation**: Ready to start
**Time to Complete**: 2-3 hours
**Complexity**: Medium

---

## What You'll Get

### For Users
- 📧 Sign up with email/password
- 🔑 Secure login
- 👤 Personal account
- 📊 Private portfolios
- 🔒 Session persistence

### For Developers
- 🛡️ Session management
- 🔐 Password hashing (bcrypt)
- 🧪 Protected API endpoints
- 📱 Multi-device support
- 🔄 Easy to extend

---

## Architecture at a Glance

```
┌─────────────────────────────────────────┐
│ User Signs Up/Logs In                   │
├─────────────────────────────────────────┤
│                                         │
│  ① Email + Password → Signup API        │
│  ② Password → Bcrypt Hash               │
│  ③ Store in Database                    │
│                                         │
│  ④ Login → NextAuth                     │
│  ⑤ Verify Credentials                   │
│  ⑥ Create JWT Session Token             │
│                                         │
│  ⑦ Session Cookie → Browser             │
│  ⑧ Protected Pages Check Session        │
│  ⑨ APIs Check auth() before responding  │
│                                         │
└─────────────────────────────────────────┘
```

---

## Two Guides Available

### 1️⃣ AUTHENTICATION_SETUP.md
**For**: Understanding the complete system
**Length**: 1,200+ lines
**Contains**:
- Architecture diagrams
- Complete code for all components
- Database schema
- NextAuth configuration
- Login/Signup pages
- API protection
- OAuth setup (optional)
- Security best practices

**Read this if**: You want the full picture

### 2️⃣ AUTH_IMPLEMENTATION_STEPS.md
**For**: Actually building it step-by-step
**Length**: 600+ lines
**Contains**:
- 8 implementation phases
- Time estimates (30 min - 1 hour each)
- Copy-paste code blocks
- Exact file paths
- Commands to run
- Testing instructions
- Verification checklist

**Read this if**: You're ready to code

---

## Implementation Phases

### Phase 1: Database (30 min)
```
✅ Covered in both guides
Update Prisma schema with User model
Create migration
```

### Phase 2: Dependencies (10 min)
```
✅ Covered in both guides
Install: next-auth, bcryptjs
One command: pnpm add ...
```

### Phase 3: Auth Config (20 min)
```
✅ Code provided
Create auth.ts with NextAuth setup
Configure email/password provider
```

### Phase 4: Login Page (30 min)
```
✅ Full code provided
React component with form
Client-side validation
Error handling
```

### Phase 5: Signup Page (30 min)
```
✅ Full code provided
React component with form
Email validation
Password confirmation
```

### Phase 6: Signup API (15 min)
```
✅ Full code provided
API endpoint to create users
Hash password with bcrypt
Create default portfolio
```

### Phase 7: Environment (5 min)
```
✅ Instructions provided
Set NEXTAUTH_URL
Set NEXTAUTH_SECRET
Done!
```

### Phase 8: Protect APIs (20 min)
```
✅ Example code provided
Check auth() in API routes
Return 401 if not authenticated
Fetch user portfolios only
```

---

## Key Technologies

| Component | Technology | Why |
|-----------|-----------|-----|
| **Auth Framework** | NextAuth.js v5 | Industry standard, Next.js native |
| **Database Adapter** | @auth/prisma-adapter | Works with our Prisma setup |
| **Password Hashing** | bcryptjs | Secure, battle-tested |
| **Session Management** | JWT | Stateless, scales |
| **Session Storage** | Browser cookies | Automatic, secure |

---

## Code Snippets Quick Access

### Database Model
👉 See: AUTHENTICATION_SETUP.md → Step 1

### NextAuth Config
👉 See: AUTHENTICATION_SETUP.md → Step 3 or AUTH_IMPLEMENTATION_STEPS.md → Phase 3

### Login Page
👉 See: AUTHENTICATION_SETUP.md → Step 5 or AUTH_IMPLEMENTATION_STEPS.md → Phase 4

### Signup Page
👉 See: AUTHENTICATION_SETUP.md → Step 6 or AUTH_IMPLEMENTATION_STEPS.md → Phase 5

### Signup API
👉 See: AUTHENTICATION_SETUP.md → Step 7 or AUTH_IMPLEMENTATION_STEPS.md → Phase 6

### Protecting APIs
👉 See: AUTHENTICATION_SETUP.md → Step 8 or AUTH_IMPLEMENTATION_STEPS.md → Phase 8

---

## User Flow

```
Anonymous User
    ↓
Clicks "Sign up"
    ↓
/auth/signup
    ↓
Enters email & password
    ↓
POST /api/auth/signup
    ↓
Create user with hashed password
    ↓
signIn() with credentials
    ↓
NextAuth verifies
    ↓
Creates JWT session token
    ↓
Session cookie in browser
    ↓
Redirects to /
    ↓
✅ User logged in!
```

---

## Security Features

✅ **Password Hashing**
- Bcrypt with salt rounds
- Never stored in plain text

✅ **Session Management**
- JWT tokens
- 30-day expiry
- Auto-refresh

✅ **CSRF Protection**
- NextAuth handles automatically
- Tokens in requests

✅ **Database Security**
- Passwords indexed
- Email unique constraint
- Foreign key relations

✅ **API Protection**
- `await auth()` checks
- User ID in params
- 401 response if missing

---

## Testing the Implementation

### Step 1: Signup
```
Visit: http://localhost:3000/auth/signup
Email: test@example.com
Password: password123
Click: Sign Up
Expected: Redirect to home (logged in)
```

### Step 2: Check Login State
```
Refresh page
Expected: Still logged in (session persists)
Check: User menu shows email
```

### Step 3: API Test
```
curl http://localhost:3000/api/portfolio
Expected: Returns user's portfolios
```

### Step 4: Logout
```
Click: Sign Out
Expected: Redirect to login page
Try API: Get 401 Unauthorized
```

---

## Optional Enhancements

Once basic auth works, you can add:

**Email Verification**
- Verify email before login
- Resend verification link

**Password Reset**
- Forgot password flow
- Email token verification

**OAuth (Google, GitHub)**
- One-click sign up/login
- No password needed
- User profile sync

**Two-Factor Authentication**
- TOTP authenticator app
- SMS backup codes

**Rate Limiting**
- Max login attempts
- DDoS protection

**Admin Dashboard**
- User management
- Subscription tracking
- Usage analytics

---

## Files to Create

```
NEW FILES:
├─ apps/web/src/app/auth/
│  ├─ auth.ts                    ← NextAuth config
│  ├─ route.ts                   ← NextAuth handlers
│  ├─ login/page.tsx             ← Login component
│  └─ signup/page.tsx            ← Signup component
│
├─ apps/web/src/app/api/auth/
│  └─ signup/route.ts            ← Signup API
│
└─ apps/web/src/middleware.ts    ← Route protection (optional)

UPDATED FILES:
├─ packages/database/prisma/schema.prisma  ← Add User models
├─ apps/web/package.json                   ← Add dependencies
├─ .env.local                              ← Add NextAuth vars
└─ apps/web/src/app/api/portfolio/route.ts ← Add auth checks
```

---

## Estimated Timeline

| Phase | Time | Status |
|-------|------|--------|
| 1: Database | 30 min | 📋 Documented |
| 2: Dependencies | 10 min | 📋 Documented |
| 3: NextAuth | 20 min | 📋 Documented |
| 4: Login | 30 min | 📋 Documented |
| 5: Signup | 30 min | 📋 Documented |
| 6: Signup API | 15 min | 📋 Documented |
| 7: Environment | 5 min | 📋 Documented |
| 8: API Protection | 20 min | 📋 Documented |
| **TOTAL** | **2-3 hours** | **Ready to start!** |

---

## How to Get Started

### Option A: Quick Dive
```
1. Read: AUTH_IMPLEMENTATION_STEPS.md
2. Follow: Phase by phase
3. Copy: Code snippets
4. Test: After each phase
```

### Option B: Deep Understanding
```
1. Read: AUTHENTICATION_SETUP.md
2. Understand: Architecture
3. Review: Each component
4. Then: Follow Option A
```

### Option C: Ask for Help
```
If stuck:
1. Check AUTHENTICATION_SETUP.md troubleshooting
2. Review error messages
3. Check database schema
4. Verify environment variables
```

---

## Success Criteria

After implementation, you should have:

✅ User can sign up with email/password
✅ User can log in
✅ Session persists across refreshes
✅ Portfolio API returns only user's data
✅ Cannot access other users' portfolios
✅ Logout clears session
✅ Protected routes redirect to login

---

## Next Steps

1. **Read one of the guides** (SETUP for understanding, STEPS for coding)
2. **Start with Phase 1** (Database schema)
3. **Follow each phase sequentially**
4. **Test after each phase**
5. **Deploy when complete**

---

## Summary

You now have:

📖 **2 comprehensive guides** with 1,600+ lines of documentation
💻 **All code ready to copy-paste** - no research needed
🎯 **Clear phases** - do 1 hour at a time or all at once
✅ **Testing instructions** - verify each step works
🚀 **Ready to deploy** - works with current setup

**Pick a guide, follow the steps, and you'll have a complete auth system!**

Choose: **AUTHENTICATION_SETUP.md** (understand it) or **AUTH_IMPLEMENTATION_STEPS.md** (build it)

---

**Your next move**: Read one of the guides → Start Phase 1 → You'll have login/signup in 2-3 hours! 🔐

