import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false })
        // Clear the auth cookie
        if (typeof document !== 'undefined') {
          document.cookie = 'auth-token=; path=/; max-age=0'
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        // Clear the auth cookie
        if (typeof document !== 'undefined') {
          document.cookie = 'auth-token=; path=/; max-age=0'
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
