import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { assets } from '../../../assets/assets'
import BlogTableItem from '../../Admin/BlogTableItem'
import { useAppContext } from '../../../../context/AppContext'
import toast from 'react-hot-toast'
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: []
  })
  const [loading, setLoading] = useState(true)
  const { authAxios, token, navigate } = useAppContext()

  const fetchDashboard = useCallback(
    async signal => {
      if (!token) {
        console.log('No token available, redirecting to login')
        navigate('/admin/login')
        return
      }

      try {
        setLoading(true)
        const { data } = await authAxios.get('/api/admin/dashboard', {
          signal
        })

        if (!data) {
          throw new Error('No data received from server')
        }

        if (data.success) {
          setDashboardData(data.dashboardData)
        } else {
          throw new Error(data.message || 'Failed to load dashboard data')
        }
      } catch (error) {
        if (!signal.aborted) {
          console.error('Dashboard error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          })

          // Handle specific error cases
          if (error.response?.status === 401) {
            toast.error('Session expired. Please login again.')
            navigate('/admin/login')
          } else if (axios.isCancel(error)) {
            console.log('Request cancelled')
          } else {
            toast.error('Failed to load dashboard. Please try again.')
          }
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false)
        }
      }
    },
    [authAxios, token, navigate]
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchDashboard(controller.signal)

    return () => {
      controller.abort()
    }
  }, [fetchDashboard])

  if (loading) {
    return (
      <div className='flex-1 p-4 md:p-10 bg-blue-50/50 flex items-center justify-center'>
        <div className='text-lg text-gray-600'>Loading dashboard data...</div>
      </div>
    )
  }
  return (
    <div className='flex-1 p-4 md:p-10 bg-blue-50/50 '>
      <div className='flex flex-wrap gap-4 '>
        <div className='flex items-center gap-4 bg-white p-4 min-w-56 shadow cursor-pointer hover:scale-105 transition-all rounded '>
          <img src={assets.dashboard_icon_1} alt='icon-1' />
          <div>
            <p className='text-xl font-semibold text-gray-600'>
              {dashboardData.blogs}
            </p>
            <p className='text-gray-400 font-light'>Blogs</p>
          </div>
        </div>
        <div className='flex items-center gap-4 bg-white p-4 min-w-56 shadow cursor-pointer hover:scale-105 transition-all rounded '>
          <img src={assets.dashboard_icon_2} alt='icon-2' />
          <div>
            <p className='text-xl font-semibold text-gray-600'>
              {dashboardData.comments}
            </p>
            <p className='text-gray-400 font-light'>Comments</p>
          </div>
        </div>
        <div className='flex items-center gap-4 bg-white p-4 min-w-56 shadow cursor-pointer hover:scale-105 transition-all rounded '>
          <img src={assets.dashboard_icon_3} alt='icon-1' />
          <div>
            <p className='text-xl font-semibold text-gray-600'>
              {dashboardData.drafts}
            </p>
            <p className='text-gray-400 font-light'>Drafts</p>
          </div>
        </div>
      </div>
      <div>
        <div className='flex items-center gap-3 m-4 mt-6 text-gray-600 '>
          <img src={assets.dashboard_icon_4} alt='' />
          <p>Latest Blogs</p>
        </div>
        <div className='relative max-w-4xl  overflow-x-auto shadow rounded-lg  scrollbar-hide bg-white '>
          <table className='w-full text-sm text-gray-500 '>
            <thead className='text-xs text-gray-600 text-left uppercase'>
              <tr>
                <th scope='col' className='px-2 py-4 xl:px-6'>
                  #
                </th>
                <th scope='col' className='px-2 py-4 '>
                  Blog Title
                </th>
                <th scope='col' className='px-2 py-4 max-sm:hidden'>
                  Date
                </th>
                <th scope='col' className='px-2 py-4 max-sm:hidden'>
                  Status
                </th>
                <th scope='col' className='px-2 py-4 '>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentBlogs &&
                dashboardData.recentBlogs.map((blog, index) => {
                  return (
                    <BlogTableItem
                      key={blog._id}
                      blog={blog}
                      fetchBlogs={fetchDashboard}
                      index={index + 1}
                    />
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
