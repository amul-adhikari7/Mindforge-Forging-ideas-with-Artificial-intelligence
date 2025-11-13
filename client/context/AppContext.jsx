/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

// Get base URL from environment, fallback to localhost
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'

// Create separate axios instances for public and authenticated requests
const publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const navigate = useNavigate()

  // State declarations
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) return null
    try {
      const payload = JSON.parse(atob(storedToken.split('.')[1]))
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        return null
      }
      return storedToken
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return null
    }
  })

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch {
        return null
      }
    }
    return null
  })
  const [blogs, setBlogs] = useState([])
  const [moments, setMoments] = useState([])
  const [input, setInput] = useState('')
  const [contentType, setContentType] = useState('blogs')

  // Define core callback functions
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    navigate('/', { replace: true })
  }, [navigate])

  const fetchUserData = useCallback(async () => {
    if (!token) {
      setUser(null)
      return
    }
    try {
      // Use authAxios with the current token
      const response = await authAxios.get('/api/admin/dashboard')
      if (response.data.success) {
        setUser({ isAdmin: true, ...(response.data.dashboardData?.user || {}) })
      } else {
        logout()
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      if (error.response?.status === 401) {
        logout()
      }
    }
  }, [token, logout])

  const login = useCallback(
    async authToken => {
      try {
        if (!authToken || authToken.split('.').length !== 3) {
          throw new Error('Invalid token format')
        }

        // Store token first
        localStorage.setItem('token', authToken)
        setToken(authToken)

        // Create a temporary axios instance for this request
        const tempAxios = axios.create({
          baseURL: BASE_URL,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          withCredentials: true
        })

        const response = await tempAxios.get('/api/admin/dashboard')

        if (response.data.success) {
          setUser({
            isAdmin: true,
            ...(response.data.dashboardData?.user || {})
          })
          navigate('/admin/dashboard')
        } else {
          throw new Error('Failed to fetch user data')
        }
      } catch (error) {
        console.error('Login error:', error)
        logout()
        throw error
      }
    },
    [navigate, logout]
  )

  // Define regular functions
  const fetchBlogs = useCallback(async () => {
    // Exit early if no token - blogs require authentication
    if (!token) {
      return
    }
    try {
      const { data } = await publicAxios.get('/api/blog/all')
      if (data.success) {
        setBlogs(data.blogs)
      } else if (data.message) {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch blogs'
      if (errorMessage && typeof errorMessage === 'string') {
        toast.error(errorMessage)
      }
    }
  }, [token])

  const fetchMoments = useCallback(async () => {
    // Exit early if no token - moments require authentication
    if (!token) {
      return
    }
    try {
      const { data } = await publicAxios.get('/api/moments')
      if (data.success) {
        setMoments(data.moments)
      } else if (data.message) {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error fetching moments:', error)
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch moments'
      if (errorMessage && typeof errorMessage === 'string') {
        toast.error(errorMessage)
      }
    }
  }, [token])

  // Set up axios interceptors

  const fetchDashboard = useCallback(async () => {
    // Exit early if no token - dashboard requires authentication
    if (!token || !user) {
      return
    }
    try {
      const { data } = await authAxios.get('/api/admin/dashboard')
      if (data.success && data.dashboardData?.user) {
        setUser({
          isAdmin: true,
          ...data.dashboardData.user
        })
      }
    } catch (error) {
      const status = error.response?.status

      if (status === 403) {
        console.error('[Dashboard] Access denied (403) - User lacks admin role')
        toast.error('Admin access required. Contact system administrator.')
      } else if (status === 401) {
        console.error('[Dashboard] Unauthorized (401) - Token invalid')
        logout()
      } else {
        console.error('[Dashboard] Error fetching dashboard:', error.message)
      }
    }
  }, [token, user, logout])

  useEffect(() => {
    // Configure authAxios with token
    if (token) {
      authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete authAxios.defaults.headers.common['Authorization']
    }

    // Request interceptor: log outgoing requests with auth
    const requestInterceptor = authAxios.interceptors.request.use(
      config => {
        if (config.headers.Authorization) {
          console.log(`[API] ${config.method.toUpperCase()} ${config.url}`)
        }
        return config
      },
      error => Promise.reject(error)
    )

    // Response interceptor: handle auth errors
    const responseInterceptor = authAxios.interceptors.response.use(
      response => response,
      error => {
        const status = error.response?.status
        const data = error.response?.data

        if (status === 401) {
          console.error('[API] 401 Unauthorized - Token invalid or expired')
          logout()
          toast.error('Your session has expired. Please login again.')
        } else if (status === 403) {
          console.error('[API] 403 Forbidden - Access denied')
          toast.error(
            data?.message || 'Access denied. Admin privileges required.'
          )
        } else if (status >= 500) {
          console.error('[API] Server error:', status, data?.message)
          toast.error('Server error. Please try again later.')
        } else if (error.message === 'Network Error' && !error.response) {
          console.error('[API] Network error - check connection')
          toast.error('Network error. Please check your connection.')
        }

        return Promise.reject(error)
      }
    )

    return () => {
      authAxios.interceptors.request.eject(requestInterceptor)
      authAxios.interceptors.response.eject(responseInterceptor)
    }
  }, [token, logout])

  // Initial data fetch
  useEffect(() => {
    // Only fetch data if user is authenticated (has both token and user)
    if (!token || !user) {
      return
    }

    // Check current location to determine what to fetch
    const isAdminPage =
      window.location.pathname.startsWith('/admin') &&
      !window.location.pathname.match(/\/(blogs|moments)$/)

    // Always fetch blogs and moments for authenticated users
    // Fetch blogs and moments when authenticated
    fetchBlogs()
    fetchMoments()

    // Fetch dashboard data if on admin page
    if (isAdminPage) {
      fetchDashboard()
    }
  }, [token, user, fetchBlogs, fetchMoments, fetchDashboard])

  // Create context value with all needed functions and state
  const persistedSetUser = useCallback(userData => {
    setUser(userData)
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('user')
    }
  }, [])

  const value = {
    publicAxios,
    authAxios,
    navigate,
    token,
    setToken,
    user,
    setUser: persistedSetUser,
    blogs,
    setBlogs,
    moments,
    setMoments,
    input,
    setInput,
    contentType,
    setContentType,
    login,
    logout,
    fetchUserData,
    fetchBlogs,
    fetchMoments,
    fetchDashboard
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
