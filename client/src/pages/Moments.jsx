import React, { useState, useEffect, useCallback } from 'react'
import { FaPlus } from 'react-icons/fa'
import { useAppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import MomentCard from '../components/Moments/MomentCard'
import AddMomentModal from '../components/Moments/AddMomentModal'
import Loader from '../components/Loader'

const Moments = () => {
  const navigate = useNavigate()
  const [moments, setMoments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState(null)
  const { user, authAxios } = useAppContext()

  const fetchMoments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await authAxios.get('/api/moments')
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
  }, [authAxios])

  useEffect(() => {
    fetchMoments()
  }, [fetchMoments])

  const handleAddMoment = async formData => {
    try {
      setError(null)
      const form = new FormData()
      form.append('title', formData.title)
      form.append('description', formData.description)
      form.append('date', formData.date)
      form.append('image', formData.image)

      const { data } = await authAxios.post('/api/moments', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (data.success) {
        await fetchMoments()
        setIsModalOpen(false)
        toast.success('Moment added successfully')
      } else {
        throw new Error(data.message || 'Failed to add moment')
      }
    } catch (error) {
      console.error('Error adding moment:', error)
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to add moment'
      setError(errorMessage)
      toast.error(errorMessage)

      if (error.response?.status === 401) {
        // Save the current location before redirecting
        navigate('/admin/login', {
          state: { from: window.location.pathname }
        })
      }
    }
  }

  const handleDeleteMoment = async id => {
    if (!window.confirm('Are you sure you want to delete this moment?')) return

    try {
      setError(null)
      const { data } = await authAxios.delete(`/api/moments/${id}`)
      if (data.success || data.message === 'Moment deleted successfully') {
        setMoments(moments.filter(moment => moment._id !== id))
        toast.success('Moment deleted successfully')
      } else {
        throw new Error(data.message || 'Failed to delete moment')
      }
    } catch (error) {
      console.error('Error deleting moment:', error)
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete moment'
      toast.error(errorMessage)
      if (error.response?.status === 401) {
        navigate('/admin/login')
      }
    }
  }

  if (loading) return <Loader />

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 to-white'>
      <div className='max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900'>Our Moments</h1>
          {user && user.isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className='flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors'
            >
              <FaPlus />
              Add Moment
            </button>
          )}
        </div>

        {error ? (
          <div className='text-center py-12'>
            <p className='text-red-500 text-lg'>{error}</p>
            <button
              onClick={fetchMoments}
              className='mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700'
            >
              Try Again
            </button>
          </div>
        ) : moments.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No moments added yet.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {moments.map(moment => (
              <MomentCard
                key={moment._id}
                moment={moment}
                onDelete={handleDeleteMoment}
              />
            ))}
          </div>
        )}
      </div>

      <AddMomentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddMoment}
      />
    </div>
  )
}

export default Moments
