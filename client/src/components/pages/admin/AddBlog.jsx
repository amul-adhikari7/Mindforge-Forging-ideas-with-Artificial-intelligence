import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets, blogCategories } from '../../../assets/assets'
import Quill from 'quill'
import { useAppContext } from '../../../../context/AppContext'
import toast from 'react-hot-toast'
import { parse } from 'marked'
const AddBlog = () => {
  const navigate = useNavigate()
  const { authAxios, token, user } = useAppContext()
  const [isAdding, setIsAdding] = useState(false)
  const editorRef = useRef(null)
  const quillRef = useRef(null)

  // Check authorization
  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
      return
    }

    const canCreateBlogs = user.role === 'admin' || user.role === 'author'
    if (!canCreateBlogs) {
      toast.error('Only admins and authors can create blogs')
      navigate('/')
      return
    }
  }, [token, user, navigate])

  const [image, setImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('Startup')
  const [isPublished, setIsPublished] = useState(false)

  const generateContent = async () => {
    if (!title.trim()) {
      return toast.error('Please enter title to generate content')
    }
    try {
      setLoading(true)
      const { data } = await authAxios.post('/api/blog/generate', {
        prompt: title
      })
      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content)
      } else if (data.message && typeof data.message === 'string') {
        toast.error(data.message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      if (errorMessage && typeof errorMessage === 'string') {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const onSubmitHandler = async e => {
    try {
      e.preventDefault()

      // Validate required fields
      if (!title.trim()) {
        toast.error('Please enter a blog title')
        return
      }
      if (!category) {
        toast.error('Please select a category')
        return
      }
      if (!image) {
        toast.error('Please upload a thumbnail image')
        return
      }
      if (!quillRef.current.root.innerHTML.trim()) {
        toast.error('Please add some content to your blog')
        return
      }

      setIsAdding(true)
      const blog = {
        title: title.trim(),
        subTitle: subTitle.trim(),
        description: quillRef.current.root.innerHTML.trim(),
        category,
        isPublished
      }

      const formData = new FormData()
      formData.append('blog', JSON.stringify(blog))

      // Preserve file extension by appending with original name
      formData.append('image', image, image.name)

      const { data } = await authAxios.post('/api/blog/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (data.success) {
        toast.success('Blog added successfully!')
        // Reset form
        setImage(false)
        setTitle('')
        setSubTitle('')
        quillRef.current.root.innerHTML = ''
        setCategory('Startup')
        setIsPublished(false)
        // Navigate to blog list using React Router
        navigate('/admin/blogs', { replace: true })
      } else if (data.message && typeof data.message === 'string') {
        toast.error(data.message)
      } else {
        toast.error('Failed to add blog')
      }
    } catch (error) {
      console.error('Error adding blog:', error)
      const errorMessage = error.response?.data?.message
      if (errorMessage && typeof errorMessage === 'string') {
        toast.error(errorMessage)
      } else {
        toast.error('Error adding blog. Please try again.')
      }
    } finally {
      setIsAdding(false)
    }
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  return (
    <form
      onSubmit={onSubmitHandler}
      className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'
    >
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>
        <p>Upload Thumbnail</p>
        <label htmlFor='image'>
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt=''
            className='mt-2 h-16 rounded cursor-pointer'
          />
          <input
            onChange={e => {
              const file = e.target.files[0]
              if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                  toast.error('Please upload an image file')
                  return
                }
                // Validate file size (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                  toast.error('Image size should be less than 5MB')
                  return
                }
                setImage(file)
              }
            }}
            accept='image/*'
            type='file'
            id='image'
            hidden
            required
          />
        </label>
        <p className='mt-4'>Blog Title</p>
        <input
          value={title}
          type='text'
          placeholder='Enter your title..'
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded'
          onChange={e => {
            setTitle(e.target.value)
          }}
        />
        <p className='mt-4'>Sub Title</p>
        <input
          value={subTitle}
          type='text'
          placeholder='Enter your sub title..'
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded'
          onChange={e => {
            setSubTitle(e.target.value)
          }}
        />

        <p className='mt-4 '>Blog Description</p>
        <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
          <div ref={editorRef}></div>
          {loading && (
            <div className='absolute top-0 left-0 bottom-0 right-0 w-full h-full bg-black/10 flex items-center justify-center'>
              <div className='w-8 h-8 rounded-full border-2 border-t-white animate-spin'></div>
            </div>
          )}
          <button
            disabled={loading}
            onClick={generateContent}
            type='button'
            className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer'
          >
            Generate with AI
          </button>
        </div>
        <p className='mt-4'>Blog Category</p>
        <select
          value={category}
          onChange={e => {
            setCategory(e.target.value)
          }}
          name='category'
          className='mt-2 px-3 py-2 border text-gray-500  border-gray-300 outline-none rounded'
        >
          <option value=''>Select Category</option>
          {blogCategories.map((item, index) => {
            return (
              <option value={item} key={index}>
                {item}
              </option>
            )
          })}
        </select>
        <div className='flex gap-2 mt-4 '>
          <p className='font-semibold'>Publish now</p>
          <input
            type='checkbox'
            checked={isPublished}
            className='scale-125 cursor-pointer'
            onChange={e => {
              setIsPublished(e.target.checked)
            }}
          />
        </div>
        <button
          disabled={isAdding}
          type='submit'
          className='mt-8 w-40 h-10 bg-blue-500 text-white rounded cursor-pointer text-sm'
        >
          {isAdding ? 'Adding' : 'Add Blog'}
        </button>
      </div>
    </form>
  )
}

export default AddBlog
