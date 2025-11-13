import { useAppContext } from '../../context/AppContext'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
const Navbar = () => {
  const { navigate, token, setToken, authAxios } = useAppContext()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    // remove auth header from the authAxios instance
    if (authAxios && authAxios.defaults && authAxios.defaults.headers) {
      delete authAxios.defaults.headers.common['Authorization']
    }
    navigate('/')
  }

  return (
    <div className='sticky top-0 z-50 backdrop-blur-sm bg-white/90 border-b border-gray-100'>
      <div className='flex items-center justify-between mx-4 py-3.5 sm:mx-12 xl:mx-24 max-w-7xl 2xl:mx-auto'>
        <Link
          to='/'
          className='group flex items-center space-x-2 font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200 py-1'
        >
          <h1 className='text-lg sm:text-xl bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent font-bold'>
            Chintu memo
          </h1>
        </Link>
        <div className='flex items-center gap-4 sm:gap-8'>
          <nav className='hidden sm:flex gap-6 text-gray-600 font-medium tracking-wide text-[15px]'>
            <Link
              to='/'
              className='relative px-3 py-2 hover:text-blue-600 transition-all duration-200 rounded-md hover:bg-blue-50/50 after:content-[""] after:absolute after:w-1 after:h-1 after:bg-blue-500 after:left-1/2 after:-bottom-0.5 after:transition-all after:-translate-x-1/2 after:opacity-0 hover:after:opacity-100'
            >
              Home
            </Link>
            {!window.location.pathname.startsWith('/admin') && (
              <>
                <Link
                  to='/blogs'
                  className='relative px-3 py-2 hover:text-blue-600 transition-all duration-200 rounded-md hover:bg-blue-50/50 after:content-[""] after:absolute after:w-1 after:h-1 after:bg-blue-500 after:left-1/2 after:-bottom-0.5 after:transition-all after:-translate-x-1/2 after:opacity-0 hover:after:opacity-100'
                >
                  Blogs
                </Link>
                <Link
                  to='/moments'
                  className='relative px-3 py-2 hover:text-blue-600 transition-all duration-200 rounded-md hover:bg-blue-50/50 after:content-[""] after:absolute after:w-1 after:h-1 after:bg-blue-500 after:left-1/2 after:-bottom-0.5 after:transition-all after:-translate-x-1/2 after:opacity-0 hover:after:opacity-100'
                >
                  Moments
                </Link>
              </>
            )}
          </nav>
          <div className='flex gap-3'>
            {token ? (
              <>
                <button
                  className='flex items-center gap-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 border border-blue-100 px-4 py-2 hover:bg-blue-100 hover:border-blue-200 transition-all duration-200 shadow-sm'
                  onClick={() => navigate('/admin')}
                >
                  <span>Dashboard</span>
                  <img
                    src={assets.arrow}
                    className='w-2.5 transition-transform group-hover:translate-x-1'
                    alt='dashboard'
                  />
                </button>
                <button
                  className='flex items-center gap-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 border border-red-100 px-4 py-2 hover:bg-red-100 hover:border-red-200 transition-all duration-200 shadow-sm'
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className='flex items-center gap-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-sm group'
                onClick={() => navigate('/admin')}
              >
                <span>Login</span>
                <img
                  src={assets.arrow}
                  className='w-2.5 transition-transform group-hover:translate-x-1'
                  alt='login'
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Navbar
