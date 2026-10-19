import { createContext, useContext, useState, useEffect } from 'react'
import * as authApi from '../services/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function initAuth() {
      try {
        const res = await authApi.getMe()
        if (isMounted) {
          setUser(res.data)
        }
      } catch (err) {
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    initAuth()
    return () => { isMounted = false }
  }, [])

  async function loginUser(email, password) {
    const res = await authApi.login(email, password)
    setUser(res.data)
    return res.data
  }

  async function registerUser(data) {
    // Registration only creates the account, it does NOT log the user in.
    // No setUser() call here — the user must explicitly log in.
    await authApi.register(data)
  }

  async function logoutUser() {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
