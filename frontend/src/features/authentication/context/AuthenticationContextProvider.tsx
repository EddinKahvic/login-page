import { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loader } from '../../../components/loader/Loader'

interface User {
  id: string
  email: string
  emailVerified: boolean
}

interface AuthenticationContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthenticationContext = createContext<AuthenticationContextType | null>(
  null
)

const authPaths = ['/login', '/signup', '/request-password-reset']

export function useAuthentication() {
  return useContext(AuthenticationContext)
}

export function AuthenticationContextProvider() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  const isOnAuthPage = authPaths.includes(location.pathname)

  const login = async (email: string, password: string) => {
    const response = await fetch(
      import.meta.env.VITE_API_URL + 'api/v1/authentication/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    )
    if (response.ok) {
      const { token } = await response.json()
      localStorage.setItem('token', token)
    } else {
      const { message } = await response.json()
      throw new Error(message)
    }
  }

  const signup = async (email: string, password: string) => {
    const response = await fetch(
      import.meta.env.VITE_API_URL + 'api/v1/authentication/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    )
    if (response.ok) {
      const { token } = await response.json()
      localStorage.setItem('token', token)
    } else {
      const { message } = await response.json()
      throw new Error(message)
    }
  }

  const logout = async () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const fetchUser = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + 'api/v1/authentication/user',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      if (!response.ok) {
        throw new Error('Authentication failed')
      }
      const user = await response.json()
      setUser(user)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      return
    }
    fetchUser()
  }, [user, location.pathname])

  return (
    <AuthenticationContext.Provider value={{ user, login, logout, signup }}>
      {isLoading && <Loader />}

      {!isLoading && !user && !isOnAuthPage && <Navigate to="/login" />}

      {!isLoading && user && user.emailVerified && isOnAuthPage && (
        <Navigate to="/" />
      )}

      {!isLoading && user && !user.emailVerified && (
        <Navigate to="verify-email" />
      )}

      {/* If no redirects needed, render app */}
      {!isLoading && <Outlet />}
    </AuthenticationContext.Provider>
  )
}
