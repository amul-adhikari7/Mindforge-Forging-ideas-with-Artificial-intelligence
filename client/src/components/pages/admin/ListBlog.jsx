import { useEffect, useState, useCallback } from 'react'
import BlogTableItem from '../../Admin/BlogTableItem'
import toast from 'react-hot-toast'
import { useAppContext } from '../../../../context/AppContext'
const ListBlog = () => {
  const [blogs, setBlogs] = useState([])
  const { authAxios } = useAppContext()
  const fetchBlogs = useCallback(async () => {
    try {
      const { data } = await authAxios.get('/api/admin/blogs')
      // API returns `success: true` on success
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
  return (
    <div className='flex-1 bg-blue-50/50 sm:pl-16 sm:pt-12  pt-5 px-5'>
      <h1 className='font-semibold '>All Blogs</h1>
      <div className='relative h-4/5 max-w-4xl mt-4  overflow-x-auto shadow rounded-lg  scrollbar-hide bg-white '>
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
            {blogs.map((blog, index) => {
              return (
                <BlogTableItem
                  key={blog._id}
                  blog={blog}
                  fetchBlogs={fetchBlogs}
                  index={index + 1}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListBlog
