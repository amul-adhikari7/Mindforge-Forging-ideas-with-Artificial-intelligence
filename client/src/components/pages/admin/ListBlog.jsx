import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../context/AppContext'

const ListBlog = () => {
  const [blogs, setBlogs] = useState([])
  const { authAxios, token, user } = useAppContext()
  const navigate = useNavigate()

  // Check authorization
  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
      return
    }

    const canManageBlogs = user.role === 'admin' || user.role === 'author'
    if (!canManageBlogs) {
      toast.error('Only admins and authors can manage blogs')
      navigate('/')
      return
    }
  }, [token, user, navigate])

  const fetchBlogs = useCallback(async () => {
    try {
      const { data } = await authAxios.get('/api/admin/blogs')
      if (data.success) {
        setBlogs(data.blogs)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [authAxios])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  const deleteBlog = async id => {
    const confirm = window.confirm('Delete this blog?')
    if (!confirm) return
    try {
      const { data } = await authAxios.post('/api/blog/delete', { id })
      if (data.success) {
        toast.success('Deleted')
        fetchBlogs()
      } else toast.error(data.message)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const togglePublish = async id => {
    try {
      const { data } = await authAxios.post('/api/blog/toggle-publish', { id })
      if (data.success) {
        toast.success(data.message)
        fetchBlogs()
      } else toast.error(data.message)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className='flex-1 sm:pl-16 sm:pt-12 pt-5 px-5'>
      <div className='container-centered'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-2xl font-semibold'>All Blogs</h1>
            <p className='text-sm muted mt-1'>
              Manage and review published posts
            </p>
          </div>
          <div className='text-sm muted'>{blogs.length} items</div>
        </div>

        {blogs.length === 0 ? (
          <div className='card p-8 text-center'>
            <p className='muted'>
              No blogs yet. Add your first story from the admin panel.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {blogs.map(blog => {
              const BlogDate = new Date(blog.createdAt)
              return (
                <article key={blog._id} className='card overflow-hidden'>
                  <div className='card-inner flex flex-col h-full'>
                    <div className='flex items-start justify-between gap-4'>
                      <div>
                        <h2 className='text-lg font-semibold text-gray-800'>
                          {blog.title}
                        </h2>
                        <p className='text-xs muted mt-1'>
                          {BlogDate.toDateString()}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            blog.isPublished
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-50 text-orange-700'
                          }`}
                        >
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>

                    <p className='text-sm text-gray-600 mt-3 line-clamp-3'>
                      {blog.excerpt || blog.title}
                    </p>

                    <div className='mt-4 flex items-end justify-between gap-3'>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => togglePublish(blog._id)}
                          className='btn-ghost'
                        >
                          {blog.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => deleteBlog(blog._id)}
                          className='border px-3 py-1 rounded text-sm'
                        >
                          Delete
                        </button>
                      </div>
                      <div className='text-xs muted'>
                        by {blog.author || 'admin'}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ListBlog
