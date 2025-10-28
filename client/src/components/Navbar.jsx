import { useAppContext } from '../../context/AppContext'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
const Navbar = () => {
  const { navigate, token, setToken, axios } = useAppContext()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    delete axios.defaults.headers.common['Authorization']
    navigate('/')
  }

  return (
    <div className='flex items-center justify-between mx-8 py-5 sm:mx-20 xl:mx-32 cursor-pointer'>
      <Link to='/'>
        <img src={assets.logo} className='w-32 sm:w-44' alt='logo' />
      </Link>
      <div className='flex gap-3'>
        {token ? (
          <>
            <button
              className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-blue-400 text-white px-6 py-2.5'
              onClick={() => navigate('/admin')}
            >
              Dashboard
              <img src={assets.arrow} className='w-3' alt='dashboard' />
            </button>
            <button
              className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-red-400 text-white px-6 py-2.5'
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-blue-400 text-white px-6 py-2.5'
            onClick={() => navigate('/admin')}
          >
            Login
            <img src={assets.arrow} className='w-3' alt='login' />
          </button>
        )}
      </div>
    </div>
  )
}
export default Navbar
