import React from 'react'
import { format } from 'date-fns'
import { FaHeart, FaTrash } from 'react-icons/fa'
import { useAppContext } from '../../../context/AppContext'

const MomentCard = ({ moment, onDelete, showActions = true }) => {
  const { user } = useAppContext()

  return (
    <div className='card group transform transition-all duration-300 hover:scale-[1.02]'>
      <div className='relative overflow-hidden'>
        <img
          src={moment.image}
          alt={moment.title}
          className='w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
      </div>

      <div className='card-inner'>
        <h3 className='text-lg font-semibold mb-1 text-gray-900'>
          {moment.title}
        </h3>
        <p className='text-sm text-gray-600 mb-2'>{moment.description}</p>
        <div className='flex justify-between items-center'>
          <span className='text-xs text-gray-500'>
            {format(new Date(moment.date), 'MMM dd, yyyy')}
          </span>
          {showActions && user && user.isAdmin && (
            <button
              onClick={() => onDelete(moment._id)}
              className='text-red-500'
            >
              <FaTrash size={16} />
            </button>
          )}
        </div>
      </div>

      <div className='absolute top-3 right-3'>
        <FaHeart className='text-pink-500 text-xl' />
      </div>
    </div>
  )
}

export default MomentCard
