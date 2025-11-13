import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div>
      <NavLink
        end={true}
        to='/admin'
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3md:px-9 md:min-w-64 cursor-pointer ${
            isActive && 'bg-blue-100 border-r-4 border-blue-400 '
          }`
        }
      >
        <img src={assets.home_icon} alt='home-icon' className='min-w-4 w-5' />
        <p className='hidden md:inline-block'>Dashboard</p>
      </NavLink>
      <NavLink
        to='/admin/addBlog'
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3md:px-9 md:min-w-64 cursor-pointer ${
            isActive && 'bg-blue-100 border-r-4 border-blue-400 '
          }`
        }
      >
        <img src={assets.add_icon} alt='home-icon' className='min-w-4 w-5' />
        <p className='hidden md:inline-block'>Add Blog</p>
      </NavLink>
      <NavLink
        to='/admin/listBlog'
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3md:px-9 md:min-w-64 cursor-pointer ${
            isActive && 'bg-blue-100 border-r-4 border-blue-400 '
          }`
        }
      >
        <img src={assets.list_icon} alt='home-icon' className='min-w-4 w-5' />
        <p className='hidden md:inline-block'>Blog Lists</p>
      </NavLink>
      <NavLink
        to='/admin/comments'
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3md:px-9 md:min-w-64 cursor-pointer ${
            isActive && 'bg-blue-100 border-r-4 border-blue-400 '
          }`
        }
      >
        <img
          src={assets.comment_icon}
          alt='home-icon'
          className='min-w-4 w-5'
        />
        <p className='hidden md:inline-block'>Comments</p>
      </NavLink>

      <div className='border-t border-gray-200 my-2'></div>

      <NavLink
        to='/admin/blogs'
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3md:px-9 md:min-w-64 cursor-pointer ${
            isActive && 'bg-blue-100 border-r-4 border-blue-400 '
          }`
        }
      >
        <img src={assets.blog_icon} alt='blog-icon' className='min-w-4 w-5' />
        <p className='hidden md:inline-block'>View Blogs</p>
      </NavLink>

      <NavLink
        to='/admin/moments'
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3md:px-9 md:min-w-64 cursor-pointer ${
            isActive && 'bg-blue-100 border-r-4 border-blue-400 '
          }`
        }
      >
        <img
          src={assets.moment_icon}
          alt='moment-icon'
          className='min-w-4 w-5'
        />
        <p className='hidden md:inline-block'>View Moments</p>
      </NavLink>
    </div>
  )
}

export default Sidebar
