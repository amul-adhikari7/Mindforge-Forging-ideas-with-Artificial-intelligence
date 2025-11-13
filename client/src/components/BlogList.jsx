import { useState, useEffect } from 'react'
import BlogCard from './BlogCard'
import { useAppContext } from '../../context/AppContext'
import MomentCard from './Moments/MomentCard'

const BlogList = () => {
  const { blogs, input, publicAxios } = useAppContext()
  const [moments, setMoments] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch moments when component mounts
  useEffect(() => {
    const fetchMoments = async () => {
      try {
        const { data } = await publicAxios.get('/api/moments')
        if (data.success) {
          setMoments(data.moments)
        }
      } catch (error) {
        console.error('Error fetching moments:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMoments()
  }, [publicAxios])

  const getFilteredContent = () => {
    const filteredBlogs = blogs.filter(
      blog =>
        !input ||
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
    )

    // Interleave blogs and moments
    const content = []
    const maxLength = Math.max(filteredBlogs.length, moments.length)

    for (let i = 0; i < maxLength; i++) {
      if (filteredBlogs[i]) {
        content.push({
          type: 'blog',
          data: filteredBlogs[i],
          key: `blog-${filteredBlogs[i]._id}`
        })
      }
      if (moments[i]) {
        content.push({
          type: 'moment',
          data: moments[i],
          key: `moment-${moments[i]._id}`
        })
      }
    }

    return content
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Horizontal scroll container */}
        {loading ? (
          <div className='text-center py-8'>
            <div className='animate-pulse text-gray-500'>
              Loading content...
            </div>
          </div>
        ) : (
          <div className='flex gap-6 overflow-x-auto py-4 snap-x snap-mandatory'>
            {getFilteredContent().map(item => (
              <div
                key={item.key}
                className='snap-start flex-shrink-0 w-[300px] sm:w-[340px] md:w-[380px]'
              >
                {item.type === 'blog' ? (
                  <BlogCard blog={item.data} />
                ) : (
                  <MomentCard moment={item.data} showActions={false} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogList
