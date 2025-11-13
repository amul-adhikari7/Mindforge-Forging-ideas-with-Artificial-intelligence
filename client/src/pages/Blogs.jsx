import { useState } from 'react'
import { blogCategories } from '../assets/assets'
import BlogCard from '../components/BlogCard'
import { useAppContext } from '../../context/AppContext'

const Blogs = () => {
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

  const getFilteredBlogs = () => {
    if (menu === 'All') {
      return filteredBlogs()
    }
    return filteredBlogs().filter(blog => blog.category === menu)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 to-white'>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-4xl font-bold text-gray-900 mb-8 text-center'>
          Our Blogs
        </h1>

        {/* Category buttons */}
        <div className='flex justify-center gap-4 sm:gap-8 my-10 relative flex-wrap'>
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
                {menu === item && (
                  <span className='absolute inset-0 bg-blue-500 rounded-full z-[-1] animate-fadeIn'></span>
                )}
                {item}
              </button>
            </div>
          ))}
        </div>

        {/* Blogs grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24'>
          {getFilteredBlogs().map(blog => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blogs
