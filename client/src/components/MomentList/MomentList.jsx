import { useEffect, useState } from 'react'
import MomentCard from '../Moments/MomentCard'
import { useAppContext } from '../../../context/AppContext'
import toast from 'react-hot-toast'

const MomentList = () => {
  const [moments, setMoments] = useState([])
  const [loading, setLoading] = useState(true)
  const { publicAxios } = useAppContext()

  useEffect(() => {
    const fetchMoments = async () => {
      try {
        setLoading(true)
        const { data } = await publicAxios.get('/api/moments')
        if (data.success) {
          setMoments(data.moments)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        console.error('Error fetching moments:', error)
        toast.error('Failed to load moments')
      } finally {
        setLoading(false)
      }
    }

    fetchMoments()
  }, [publicAxios])

  if (loading) {
    return (
      <div className='flex justify-center items-center my-10'>
        <div className='text-gray-500'>Loading moments...</div>
      </div>
    )
  }

  if (!moments.length) {
    return null // Don't show the section if there are no moments
  }

  return (
    <div className='mb-16'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>
        Recent Moments
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:mx-16 xl:mx-40'>
        {moments.slice(0, 4).map(moment => (
          <MomentCard key={moment._id} moment={moment} showActions={false} />
        ))}
      </div>
    </div>
  )
}

export default MomentList
