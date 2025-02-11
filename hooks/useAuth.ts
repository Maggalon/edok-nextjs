'use client'

import { useEffect, useState } from 'react'

interface AuthState {
  authenticated: boolean
  user: any | null
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: false,
    user: null,
    loading: true
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/auth/status')
        const data = await response.json()
        
        setAuthState({
          authenticated: data.authenticated,
          user: data.user || null,
          loading: false
        })
      } catch (error) {
        setAuthState({
          authenticated: false,
          user: null,
          loading: false
        })
      }
    }

    checkAuth()
  }, [])

  return authState
}