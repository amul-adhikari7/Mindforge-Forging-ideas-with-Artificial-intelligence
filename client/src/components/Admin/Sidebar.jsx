import { assets } from '../../assets/assets'
import { HiOutlineSparkles } from 'react-icons/hi'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { MdMenu, MdClose } from 'react-icons/md'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={toggleSidebar}
        className='md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-white shadow-lg hover:bg-gray-100 transition-colors'
        aria-label='Toggle sidebar'
      >
        {isOpen ? <MdClose size={26} /> : <MdMenu size={26} />}
      </button>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div
          className='md:hidden fixed inset-0 bg-black/30 z-30 transition-opacity'
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative left-0 top-0 md:top-0 h-screen md:h-auto w-56 sm:w-64 bg-white z-40 transition-transform duration-300 overflow-y-auto shadow-xl md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } pt-20 md:pt-0`}
      >
        <NavLink
          end={true}
          to='/admin'
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center gap-3 py-4 px-3 md:px-9 cursor-pointer transition-colors font-medium ${
              isActive
                ? 'bg-blue-100 border-r-4 border-blue-400'
                : 'hover:bg-gray-50'
            }`
          }
        >
          <img
            src={assets.home_icon}
            alt='home-icon'
            className='min-w-5 w-5 sm:w-6'
          />
          <p className='flex-1 text-sm sm:text-base'>Dashboard</p>
        </NavLink>
        <NavLink
          to='/admin/addBlog'
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center gap-3 py-4 px-3 md:px-9 cursor-pointer transition-colors font-medium ${
              isActive
                ? 'bg-blue-100 border-r-4 border-blue-400'
                : 'hover:bg-gray-50'
            }`
          }
        >
          <img
            src={assets.add_icon}
            alt='home-icon'
            className='min-w-5 w-5 sm:w-6'
          />
          <p className='flex-1 text-sm sm:text-base'>Add Blog</p>
        </NavLink>
        <NavLink
          to='/admin/listBlog'
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center gap-3 py-4 px-3 md:px-9 cursor-pointer transition-colors font-medium ${
              isActive
                ? 'bg-blue-100 border-r-4 border-blue-400'
                : 'hover:bg-gray-50'
            }`
          }
        >
          <img
            src={assets.list_icon}
            alt='home-icon'
            className='min-w-5 w-5 sm:w-6'
          />
          <p className='flex-1 text-sm sm:text-base'>Blog Lists</p>
        </NavLink>
        <NavLink
          to='/admin/comments'
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center gap-3 py-4 px-3 md:px-9 cursor-pointer transition-colors font-medium ${
              isActive
                ? 'bg-blue-100 border-r-4 border-blue-400'
                : 'hover:bg-gray-50'
            }`
          }
        >
          <img
            src={assets.comment_icon}
            alt='home-icon'
            className='min-w-5 w-5 sm:w-6'
          />
          <p className='flex-1 text-sm sm:text-base'>Comments</p>
        </NavLink>
        <div className='border-t border-gray-200 my-2'></div>
        <NavLink
          to='/admin/blogs'
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center gap-3 py-4 px-3 md:px-9 cursor-pointer transition-colors font-medium ${
              isActive
                ? 'bg-blue-100 border-r-4 border-blue-400'
                : 'hover:bg-gray-50'
            }`
          }
        >
          <img
            src={assets.blog_icon}
            alt='blog-icon'
            className='min-w-5 w-5 sm:w-6'
          />
          <p className='flex-1 text-sm sm:text-base'>View Blogs</p>
        </NavLink>{' '}
        <NavLink
          to='/admin/moments'
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center gap-3 py-4 px-3 md:px-9 cursor-pointer transition-colors font-medium ${
              isActive
                ? 'bg-blue-100 border-r-4 border-blue-400'
                : 'hover:bg-gray-50'
            }`
          }
        >
          <HiOutlineSparkles
            className='min-w-5 w-5 sm:w-6 text-gray-600'
            aria-hidden
          />
          <p className='flex-1 text-sm sm:text-base'>View Moments</p>
        </NavLink>
      </div>
    </>
  )
}

export default Sidebar
