import { createContext, useContext, useEffect, useState } from 'react'
import api from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adema_token')
    const role = localStorage.getItem('adema_role')
    const name = localStorage.getItem('adema_name')
    if (token && role && name) {
      setUser({ token, role, name })
    }
    setLoading(false)
  }, [])

  async function login(passcode) {
    const res = await api.login(passcode)
    localStorage.setItem('adema_token', res.token)
    localStorage.setItem('adema_role', res.role)
    localStorage.setItem('adema_name', res.name)
    setUser({ token: res.token, role: res.role, name: res.name })
  }

  function logout() {
    localStorage.removeItem('adema_token')
    localStorage.removeItem('adema_role')
    localStorage.removeItem('adema_name')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
