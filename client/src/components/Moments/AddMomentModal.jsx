import React, { useState } from 'react'
import { FaTimes, FaImage } from 'react-icons/fa'

const AddMomentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    image: null
  })
  const [preview, setPreview] = useState(null)

  const handleChange = e => {
    const { name, value, files } = e.target
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] })
      setPreview(URL.createObjectURL(files[0]))
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    await onSubmit(formData)
    setFormData({ title: '', description: '', date: '', image: null })
    setPreview(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen px-4'>
        <div
          className='fixed inset-0 bg-black/70 backdrop-blur-sm'
          onClick={onClose}
        />

        <div className='relative bg-white rounded-lg w-full max-w-md p-6'>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
          >
            <FaTimes size={24} />
          </button>

          <h2 className='text-2xl font-bold mb-6 text-gray-800'>
            Add New Moment
          </h2>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Title
              </label>
              <input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleChange}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Description
              </label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleChange}
                rows='3'
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Date
              </label>
              <input
                type='date'
                name='date'
                value={formData.date}
                onChange={handleChange}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Image
              </label>
              <div className='relative'>
                {preview ? (
                  <div className='relative aspect-video rounded-lg overflow-hidden'>
                    <img
                      src={preview}
                      alt='Preview'
                      className='w-full h-full object-cover'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        setFormData({ ...formData, image: null })
                        setPreview(null)
                      }}
                      className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600'
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                ) : (
                  <label className='flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-500'>
                    <div className='text-center'>
                      <FaImage className='mx-auto text-gray-400 text-3xl mb-2' />
                      <span className='text-gray-600'>
                        Click to upload image
                      </span>
                    </div>
                    <input
                      type='file'
                      name='image'
                      onChange={handleChange}
                      accept='image/*'
                      className='hidden'
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            <button
              type='submit'
              className='w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors'
            >
              Save Moment
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddMomentModal
