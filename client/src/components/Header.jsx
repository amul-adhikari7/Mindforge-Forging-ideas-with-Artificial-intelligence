import { useRef } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../assets/assets'
const Header = () => {
  const { setInput, input } = useAppContext()
  const inputRef = useRef()

  const onSubmitHandler = async e => {
    e.preventDefault()
    setInput(inputRef.current.value)
  }

  const onClear = () => {
    setInput('')
    inputRef.current.value = ''
  }
  return (
    <div className='mx-8 sm:mx-16 xl:mx-24 relative'>
      <div className='text-center mt-20 mb-8'>
        <div className='inline-flex items-center justify-center gap-4 px-6 py-1.5 border mb-4 border-blue-400 rounded-full text-sm text-blue-500'>
          <p>New AI Integrated Feature</p>
          <img src={assets.star_icon} className='w-2.5' />
        </div>
        <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700'>
          Your own personal <span className='text-blue-500'>blogging</span>
          <br /> platform.
        </h1>
        <p className='my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500'>
          This is your place to think out loud, share your memories without any
          filters and judgement.
        </p>
        <form
          onSubmit={onSubmitHandler}
          className='flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 rounded overflow-hidden bg-white'
        >
          <input
            ref={inputRef}
            type='text'
            placeholder='Search For Blogs...'
            required
            className='w-full outline-none pl-4'
          />
          <button
            type='submit'
            className='bg-blue-500 text-white transition-all hover:scale-105 rounded px-8 m-1.5 py-2 cursor-pointer'
          >
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
      <img
        src={assets.gradientBackground}
        alt='background'
        className='absolute -top-50 -z-1 opacity-50'
      />
    </div>
  )
}

export default Header
