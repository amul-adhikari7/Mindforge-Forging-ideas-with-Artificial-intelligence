import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppContext } from '../../../context/AppContext'

const Login = () => {
  const navigate = useNavigate()
  const { publicAxios, login } = useAppContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setError(null)
    try {
      setLoading(true)
      const { data } = await publicAxios.post('/api/admin/login', {
        email,
        password
      })

      if (data.success && data.token) {
        await login(data.token)
        toast.success('Login successful!')
        navigate('/admin/dashboard', { replace: true })
      } else {
        console.error('Login response missing token:', data)
        const message =
          data.message && typeof data.message === 'string'
            ? data.message
            : 'Invalid login response'
        if (message) {
          toast.error(message)
          setError(message)
        }
      }
    } catch (error) {
      console.error('Login error:', error.response || error)
      const errorMessage =
        error.response?.data?.message &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : 'Login failed'
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6  border border-blue-200 shadow-xl shadow-blue-500/15 rounded-lg'>
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full py-6 text-center'>
            <h1 className='text-3xl font-bold'>
              <span className='text-blue-400'></span>Admin Login
            </h1>
            <p className='font-light'>
              Enter your credentials to access the admin panel
            </p>
            {error && <p className='text-red-500 mt-2 text-sm'>{error}</p>}
          </div>
          <form
            onSubmit={handleSubmit}
            className='w-full mt-6 sm:max-w-md text-gray-600'
          >
            <div className='flex flex-col'>
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                name='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                type='email'
                autoComplete='username'
                required
                placeholder='Enter your email-id'
                className='border-b-2 border-gray-300 p-2 outline-none mb-6'
              />
            </div>
            <div className='flex flex-col'>
              <label htmlFor='password'>Password</label>
              <input
                id='password'
                name='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                type='password'
                autoComplete='current-password'
                required
                placeholder='Enter your password'
                className='border-b-2 border-gray-300 p-2 outline-none mb-6'
              />
            </div>
            <button
              type='submit'
              disabled={loading || !email || !password}
              className='w-full py-3 font-medium bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-500/95 transition-all disabled:bg-blue-300'
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
