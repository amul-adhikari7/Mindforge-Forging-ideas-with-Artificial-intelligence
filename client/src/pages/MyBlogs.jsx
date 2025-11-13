import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../assets/assets'

const MyBlogs = () => {
  const navigate = useNavigate()
  const { user, authAxios, token } = useAppContext()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
      return
    }
  }, [token, user, navigate])

  // Fetch user's blogs
  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!user?.id) {
          setError('User information not available')
          return
        }

        const response = await authAxios.get(`/api/blog/user/${user.id}`)

        if (response.data.success) {
          setBlogs(response.data.blogs || [])
        } else {
          setError(response.data.message || 'Failed to fetch your blogs')
        }
      } catch (err) {
        console.error('Error fetching blogs:', err)
        const errorMessage = 'Failed to load your blogs. Please try again.'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchMyBlogs()
    }
  }, [user?.id, authAxios])

  const handleDeleteBlog = async blogId => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return
    }

    try {
      const response = await authAxios.post('/api/blog/delete', { id: blogId })

      if (response.data.success) {
        toast.success('Blog deleted successfully!')
        setBlogs(blogs.filter(blog => blog._id !== blogId))
      } else {
        toast.error(response.data.message || 'Failed to delete blog')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error('Failed to delete blog')
    }
  }

  const handleTogglePublish = async blogId => {
    try {
      const response = await authAxios.post('/api/blog/toggle-publish', {
        id: blogId
      })

      if (response.data.success) {
        setBlogs(
          blogs.map(blog =>
            blog._id === blogId
              ? { ...blog, isPublished: !blog.isPublished }
              : blog
          )
        )
        toast.success('Blog status updated!')
      } else {
        toast.error(response.data.message || 'Failed to update blog')
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      toast.error('Failed to update blog')
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 md:px-6 py-12'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-2'>
            My Blogs
          </h1>
          <p className='text-gray-600 text-lg'>
            Manage and view all your published and draft blogs
          </p>
        </div>

        {/* Action Button */}
        <div className='mb-8'>
          <button
            onClick={() => navigate('/admin/addBlog')}
            className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all'
          >
            <span>+</span> Create New Blog
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className='text-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading your blogs...</p>
          </div>
        ) : error ? (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
            <p className='text-red-700 font-medium'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'
            >
              Try Again
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className='bg-white rounded-2xl shadow-md p-12 text-center'>
            <img
              src={assets.blog_icon}
              alt='No blogs'
              className='w-16 h-16 mx-auto mb-6 opacity-50'
            />
            <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
              No blogs yet
            </h2>
            <p className='text-gray-500 mb-6'>
              Start by creating your first blog to share your thoughts and ideas
            </p>
            <button
              onClick={() => navigate('/admin/addBlog')}
              className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition'
            >
              <span>+</span> Create Blog
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {blogs.map(blog => (
              <div
                key={blog._id}
                className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group'
              >
                {/* Blog Image */}
                <div className='relative h-48 overflow-hidden bg-gray-200'>
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  )}
                  {/* Status Badge */}
                  <div className='absolute top-3 right-3'>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        blog.isPublished
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Blog Content */}
                <div className='p-5'>
                  <h3 className='font-bold text-lg text-gray-800 mb-2 line-clamp-2'>
                    {blog.title}
                  </h3>
                  <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
                    {blog.subTitle}
                  </p>

                  {/* Category Badge */}
                  <div className='mb-4'>
                    <span className='inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full'>
                      {blog.category}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className='text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100'>
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>

                  {/* Actions */}
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleTogglePublish(blog._id)}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition ${
                        blog.isPublished
                          ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {blog.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
                      className='flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBlogs
