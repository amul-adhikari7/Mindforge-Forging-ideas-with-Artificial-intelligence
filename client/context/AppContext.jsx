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

// Create separate axios instances for public and authenticated requests
const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const authAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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
        return null
      }
      return storedToken
    } catch {
      localStorage.removeItem('token')
      return null
    }
  })
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [moments, setMoments] = useState([])
  const [input, setInput] = useState('')
  const [contentType, setContentType] = useState('blogs')

  // Define core callback functions
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    navigate('/admin/login', { replace: true })
  }, [navigate])

  const fetchUserData = useCallback(async () => {
    if (!token) {
      setUser(null)
      return
    }
    try {
      // Use a direct axios call with the current token
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/admin/dashboard`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
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

        // Create a separate axios instance for this request to avoid interceptor issues
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/dashboard`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`
            }
          }
        )

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
    try {
      const { data } = await publicAxios.get('api/blog/all')
      if (data.success) {
        setBlogs(data.blogs)
      } else if (data.message) {
        toast.error(data.message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      if (errorMessage && typeof errorMessage === 'string') {
        toast.error(errorMessage)
      }
    }
  }, [])

  const fetchMoments = useCallback(async () => {
    try {
      const { data } = await publicAxios.get('api/moments')
      if (data.success) {
        setMoments(data.moments)
      } else if (data.message) {
        toast.error(data.message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      if (errorMessage && typeof errorMessage === 'string') {
        toast.error(errorMessage)
      }
    }
  }, [])

  // Set up axios interceptors
  useEffect(() => {
    // Configure auth axios instance with token
    if (token) {
      authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete authAxios.defaults.headers.common['Authorization']
    }

    const responseInterceptor = authAxios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout()
          toast.error('Your session has expired. Please login again.')
        }
        return Promise.reject(error)
      }
    )

    return () => {
      authAxios.interceptors.response.eject(responseInterceptor)
    }
  }, [token, logout])

  // Initial data fetch
  useEffect(() => {
    // Fetch blogs and moments unless we're on actual admin pages (not /admin/blogs or /admin/moments)
    const isAdminPage =
      window.location.pathname.startsWith('/admin') &&
      !window.location.pathname.match(/\/(blogs|moments)$/)
    if (!isAdminPage) {
      fetchBlogs()
      fetchMoments()
    }
    // Only fetch user data if token exists and we're in admin section
    if (token && window.location.pathname.startsWith('/admin')) {
      fetchUserData()
    }
  }, [token, fetchUserData, fetchBlogs, fetchMoments])

  // Create context value with all needed functions and state
  const value = {
    publicAxios,
    authAxios,
    navigate,
    token,
    setToken,
    user,
    setUser,
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
    fetchMoments
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
