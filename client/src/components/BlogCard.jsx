import React from 'react'
import { useNavigate } from 'react-router-dom'

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id } = blog
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/blog/${_id}`)}
      className='relative z-10 w-full rounded-lg overflow-hidden shadow-md hover:scale-105 hover:shadow-blue-400 transition-transform duration-300 cursor-pointer bg-white'
      style={{ position: 'relative' }}
    >
      <div className='absolute inset-0 z-0'></div>

      <div className='relative z-10'>
        <img
          src={image}
          alt={title}
          className='aspect-video object-cover w-full select-none'
        />

        <span className='ml-5 mt-4 px-3 py-1 inline-block bg-blue-500 rounded-full text-white text-xs'>
          {category}
        </span>

        <div className='p-5'>
          <h1 className='mb-2 font-semibold text-gray-900 text-lg'>{title}</h1>

          <p
            className='mb-3 text-sm text-gray-600'
            dangerouslySetInnerHTML={{
              __html:
                description.length > 80
                  ? description.slice(0, 80) + '...'
                  : description
            }}
          ></p>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
