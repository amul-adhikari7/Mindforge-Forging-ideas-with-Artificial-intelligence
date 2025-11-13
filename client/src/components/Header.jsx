import { useRef, useState, useEffect, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../assets/assets'
import MomentCard from './Moments/MomentCard'

const Header = () => {
  const { setInput, input, publicAxios, navigate } = useAppContext()
  const [activeTab, setActiveTab] = useState('blogs')
  const [moments, setMoments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef()

  const fetchMoments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await publicAxios.get('/api/moments')
      if (Array.isArray(data)) {
        setMoments(data)
        setError(null)
      } else if (data.message) {
        setError(data.message)
      } else {
        setError('Failed to fetch moments')
      }
    } catch (error) {
      setError(error.message || 'An error occurred while fetching moments')
      console.error('Error fetching moments:', error)
    } finally {
      setLoading(false)
    }
  }, [publicAxios])

  useEffect(() => {
    fetchMoments()
  }, [fetchMoments])

  const onSubmitHandler = async e => {
    e.preventDefault()
    setInput(inputRef.current.value)
  }

  const onClear = () => {
    setInput('')
    inputRef.current.value = ''
  }

  const filteredMoments = input
    ? moments.filter(
        moment =>
          moment.content.toLowerCase().includes(input.toLowerCase()) ||
          moment.title.toLowerCase().includes(input.toLowerCase())
      )
    : moments

  return (
    <div className='container-centered relative'>
      <div className='text-center mt-16 mb-6'>
        <div className='inline-flex items-center justify-center gap-3 px-4 py-1 border mb-4 rounded-full text-sm btn-ghost'>
          <p className='text-sm'>New AI integrated experience</p>
          <img src={assets.star_icon} className='w-3' />
        </div>
        <h1 className='text-3xl sm:text-5xl font-semibold leading-tight text-gray-800'>
          Your personal <span className='text-blue-600'>space</span>
          <br /> for blogs & moments
        </h1>
        <p className='my-4 max-w-2xl m-auto text-gray-500'>
          Share your thoughts and capture meaningful moments in a calm,
          intentional space — stories that matter to you.
        </p>
        <div className='flex gap-4 justify-center mb-6'>
          <button
            onClick={() => {
              setActiveTab('blogs')
              navigate('/blogs')
            }}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'blogs'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Blogs
          </button>
          <button
            onClick={() => {
              setActiveTab('moments')
              navigate('/moments')
            }}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'moments'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Moments
          </button>
        </div>
        <form
          onSubmit={onSubmitHandler}
          className='flex justify-between max-w-lg mx-auto border border-gray-200 rounded overflow-hidden bg-white'
        >
          <input
            ref={inputRef}
            type='text'
            placeholder={`Search ${
              activeTab === 'blogs' ? 'Blogs' : 'Moments'
            }...`}
            required
            className='w-full outline-none pl-4'
          />
          <button type='submit' className='btn-primary m-1.5 py-2'>
            Search
          </button>
        </form>
      </div>
      <div className='text-center'>
        {input && (
          <button
            onClick={onClear}
            className='border font-light text-xs py-1 px-3 rounded-sm shadow-custom-sm cursor-pointer'
          >
            Clear Search
          </button>
        )}
      </div>
      {/* Content Section */}
      {activeTab === 'moments' ? (
        <div>
          <div className='flex items-center justify-start mb-4'>
            <button
              onClick={() => {
                setActiveTab('blogs')
                navigate('/blogs')
              }}
              className='btn-ghost'
            >
              ← Back to Blogs
            </button>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2'>
            {loading ? (
              <div className='col-span-full text-center py-12'>
                <div className='animate-pulse text-gray-500'>
                  Loading moments...
                </div>
              </div>
            ) : error ? (
              <div className='col-span-full text-center py-12'>
                <p className='text-red-500 text-lg'>{error}</p>
                <button
                  onClick={fetchMoments}
                  className='mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700'
                >
                  Try Again
                </button>
              </div>
            ) : filteredMoments.length === 0 ? (
              <div className='col-span-full text-center py-12'>
                <p className='text-gray-500 text-lg'>
                  {input
                    ? 'No moments found matching your search'
                    : 'No moments added yet.'}
                </p>
              </div>
            ) : (
              filteredMoments.map(moment => (
                <MomentCard
                  key={moment._id}
                  moment={moment}
                  showActions={false}
                />
              ))
            )}
          </div>
        </div>
      ) : null}

      {/* Background Image */}
      <img
        src={assets.gradientBackground}
        alt='background'
        className='absolute -top-50 -z-1 opacity-50'
      />
    </div>
  )
}

export default Header
