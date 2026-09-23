import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'zenve_admin_token'
const ADMIN_KEY = 'zenve_admin_profile'

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedAdmin = localStorage.getItem(ADMIN_KEY)
    if (storedToken && storedAdmin) {
      setToken(storedToken)
      try {
        setAdmin(JSON.parse(storedAdmin))
      } catch {
        setAdmin(null)
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password)
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin))
    setToken(data.token)
    setAdmin(data.admin)
    return data.admin
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ADMIN_KEY)
    setToken(null)
    setAdmin(null)
  }, [])

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
