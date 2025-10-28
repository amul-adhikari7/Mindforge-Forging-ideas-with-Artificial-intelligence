import { useState } from 'react'
import { blogCategories } from '../assets/assets'
import BlogCard from './BlogCard'
import { useAppContext } from '../../context/AppContext'

const BlogList = () => {
  const [menu, setMenu] = useState('All')
  const { blogs, input } = useAppContext()

  const filteredBlogs = () => {
    if (input === '') {
      return blogs
    }
    return blogs.filter(
      blog =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
    )
  }

  return (
    <div>
      {/* Category buttons */}
      <div className='flex justify-center gap-4 sm:gap-8 my-10 relative'>
        {blogCategories.map(item => (
          <div key={item} className='relative'>
            <button
              onClick={() => setMenu(item)}
              className={`relative px-5 py-2 rounded-full font-medium transition-all duration-300 overflow-hidden
                ${
                  menu === item
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              {/* Blue background only when active */}
              {menu === item && (
                <span className='absolute inset-0 bg-blue-500 rounded-full z-[-1] animate-fadeIn'></span>
              )}
              {item}
            </button>
          </div>
        ))}
      </div>

      {/* Blog cards grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 sm:mx-16 xl:mx-40'>
        {filteredBlogs()
          .filter(blog => (menu === 'All' ? true : blog.category === menu))
          .map(blog => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
      </div>
    </div>
  )
}

export default BlogList
