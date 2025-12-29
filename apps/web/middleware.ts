import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to login page
  if (pathname === '/login') {
    return NextResponse.next()
  }

  // Check for auth token in cookies (simple client-side cookie)
  const authToken = request.cookies.get('auth-token')?.value

  // If no token, redirect to login
  if (!authToken || authToken !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to protect
export const config = {
  matcher: [
    '/',
    '/news/:path*',
    '/portfolio/:path*',
    '/economic-charts/:path*',
  ],
}
