import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from '../../Admin/Sidebar'
import { useAppContext } from '../../../../context/AppContext'
import { useEffect, useState } from 'react'

const Layout = () => {
  const { token, user, fetchUserData } = useAppContext()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const initializeAdmin = async () => {
      try {
        if (!mounted) return
        setIsLoading(true)
        if (token && !user) {
          await fetchUserData()
        }
      } catch (error) {
        if (mounted) {
          console.error('Admin initialization error:', error)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initializeAdmin()
    return () => {
      mounted = false
    }
  }, [token, fetchUserData, user])

  if (!token) {
    console.log('No token found in Layout, redirecting to login')
    return <Navigate to='/admin/login' replace />
  }

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-lg text-gray-600'>Loading admin panel...</div>
      </div>
    )
  }

  if (!user?.isAdmin) {
    console.log('User is not admin, redirecting to login')
    return <Navigate to='/admin/login' replace />
  }

  return (
    <div className='flex h-[calc(100vh-70px)]'>
      <div>
        <Sidebar />
      </div>
      <Outlet />
    </div>
  )
}

export default Layout
