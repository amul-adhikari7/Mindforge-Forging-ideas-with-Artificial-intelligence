import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'
import Footer from '../pages/Footer'
import Loader from '../Loader'
import Moment from 'moment'
import { useAppContext } from '../../../context/AppContext.jsx'

const Blog = () => {
  const { id } = useParams()
  const { publicAxios } = useAppContext()

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchBlogData = useCallback(async () => {
    try {
      const { data } = await publicAxios.get(`/api/blog/${id}`)
      if (data.success) {
        setData(data.blog)
      } else if (data.message && typeof data.message === 'string') {
        toast.error(data.message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      if (errorMessage && typeof errorMessage === 'string') {
        toast.error(errorMessage)
      }
    }
  }, [id, publicAxios])

  const fetchCommentsData = useCallback(async () => {
    try {
      const { data } = await publicAxios.post('/api/blog/comments', {
        blogId: id
      })
      if (data.success) {
        setComments(data.comments)
      } else if (data.message && typeof data.message === 'string') {
        toast.error(data.message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      if (errorMessage && typeof errorMessage === 'string') {
        toast.error(errorMessage)
      }
    }
  }, [id, publicAxios])

  const addComment = async e => {
    e.preventDefault()
    try {
      const { data } = await publicAxios.post('/api/blog/add-comment', {
        blog: id,
        name,
        content
      })
      if (data.success) {
        if (data.message && typeof data.message === 'string') {
          toast.success(data.message)
        }
        setName('')
        setContent('')
        fetchCommentsData() // Refresh comments after posting
      } else if (data.message && typeof data.message === 'string') {
        toast.error(data.message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      if (errorMessage && typeof errorMessage === 'string') {
        toast.error(errorMessage)
      }
    }
  }

  // ✅ Correct useEffect — runs once on mount or when `id` changes
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([fetchBlogData(), fetchCommentsData()])
      setLoading(false)
    }
    load()
  }, [id, fetchBlogData, fetchCommentsData])

  if (loading || !data) return <Loader />

  return (
    <div className='relative'>
      <img
        src={assets.gradientBackground}
        alt='background'
        className='absolute -top-50 -z-1 opacity-50'
      />

      <div className='text-center mt-20 text-gray-600'>
        <p className='text-blue-500 py-4 font-medium'>
          Published on: {Moment(data.createdAt).format('MMMM Do YYYY')}
        </p>
        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>
          {data.title}
        </h1>
        <h2 className='my-5 max-w-lg truncate mx-auto'>{data.subTitle}</h2>
        <p className='inline-block py-1 px-4 rounded-full mb-6 border-red-400 bg-red-500 font-medium text-white'>
          With Love
        </p>
      </div>

      <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
        <img src={data.image} alt='' className='rounded-3xl mb-5' />
        <div
          className='rich-text max-w-3xl mx-auto'
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>

        {/* Comments Section */}
        <div className='mt-14 mb-10 max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>Comments ({comments.length})</p>
          <div>
            {comments.map((item, index) => (
              <div
                className='relative bg-blue-100 border border-blue-400 max-w-xl p-4 rounded text-gray-600 mb-3'
                key={index}
              >
                <div className='flex items-center gap-2 mb-2'>
                  <img src={assets.user_icon} alt='user-icon' className='w-6' />
                  <p className='font-medium'>{item.name}</p>
                </div>
                <p className='text-sm max-w-md ml-8'>{item.content}</p>
                <div className='absolute right-4 bottom-3 text-xs'>
                  {Moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Comment */}
        <div className='max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>Add your comment</p>
          <form
            onSubmit={addComment}
            className='flex flex-col items-start gap-4 max-w-lg'
          >
            <input
              type='text'
              placeholder='Enter your name'
              className='w-full p-2 border border-gray-300 rounded outline-none'
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <textarea
              placeholder='Comment'
              className='w-full p-2 border border-gray-300 outline-none rounded h-48'
              required
              value={content}
              onChange={e => setContent(e.target.value)}
            ></textarea>
            <button
              className='bg-blue-500 text-white rounded p-2 px-8 hover:scale-105 transition-all cursor-pointer'
              type='submit'
            >
              Submit
            </button>
          </form>
        </div>

        {/* Socials */}
        <div className='my-24 max-w-3xl mx-auto'>
          <p className='font-semibold my-4'>
            Share this article on social media
          </p>
          <div className='flex gap-3'>
            <img src={assets.facebook_icon} width={50} alt='facebook' />
            <img src={assets.twitter_icon} width={50} alt='twitter' />
            <img src={assets.googleplus_icon} width={50} alt='google plus' />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Blog
