'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/login') {
      setIsChecking(false)
      return
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/login')
    } else {
      setIsChecking(false)
    }
  }, [isAuthenticated, pathname, router])

  // Show loading state while checking auth
  if (isChecking && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gecko-500 rounded-full flex items-center justify-center text-4xl shadow-lg ring-4 ring-gecko-400/30 mx-auto animate-pulse">
            🦎
          </div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
