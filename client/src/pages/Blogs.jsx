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

  const filteredResult = getFilteredBlogs()

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30'>
      <div className='w-full px-4 md:px-6 py-16'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='inline-block mb-3'>
            <span className='px-3 py-1 rounded-full text-sm font-medium bg-white/60 shadow-sm'>
              Stories
            </span>
          </div>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-3'>
            Explore Our Stories
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Discover heartfelt moments, adventures, and insights from couples
            navigating life together.
          </p>
        </div>

        {/* Category filters */}
        <div className='flex flex-wrap justify-center gap-2 md:gap-3 mb-12 pb-6 border-b border-gray-200'>
          {blogCategories.map(item => (
            <button
              key={item}
              onClick={() => setMenu(item)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                menu === item
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Blogs grid or empty state */}
        {filteredResult.length === 0 ? (
          <div className='card p-12 text-center'>
            <p className='text-lg muted'>No stories found in this category.</p>
            <button onClick={() => setMenu('All')} className='mt-4 btn-primary'>
              View All Stories
            </button>
          </div>
        ) : (
          <>
            <p className='text-sm muted mb-6 text-center'>
              {filteredResult.length}{' '}
              {filteredResult.length === 1 ? 'story' : 'stories'} found
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24'>
              {filteredResult.map(blog => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Blogs
