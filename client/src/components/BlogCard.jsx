import React from 'react'
import { useNavigate } from 'react-router-dom'

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id } = blog
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/blog/${_id}`)}
      className='card cursor-pointer'
    >
      <div className='relative'>
        <img src={image} alt={title} className='w-full h-48 object-cover' />
        <div className='absolute top-3 left-3'>
          <span className='inline-block bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full'>
            {category}
          </span>
        </div>
      </div>

      <div className='card-inner'>
        <h1 className='mb-2 font-semibold text-gray-900 text-lg'>{title}</h1>

        <p
          className='mb-1 text-sm text-gray-600'
          dangerouslySetInnerHTML={{
            __html:
              description.length > 100
                ? description.slice(0, 100) + '...'
                : description
          }}
        ></p>
      </div>
    </div>
  )
}

export default BlogCard
