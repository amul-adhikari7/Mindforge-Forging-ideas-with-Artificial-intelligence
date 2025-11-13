import { useAppContext } from '../../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'
const CommentTableItem = ({ comment }) => {
  const { blog, createdAt, _id } = comment
  const BlogDate = new Date(createdAt)
  const { authAxios } = useAppContext()
  const approveComment = async () => {
    try {
      const { data } = await authAxios.post('/api/admin/approve-comment', {
        id: _id
      })
      if (data.success) {
        toast.success('Comment approved successfully')
      } else if (data.message && typeof data.message === 'string') {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error approving comment:', error)
      const errorMessage = error.response?.data?.message
      if (errorMessage && typeof errorMessage === 'string') {
        toast.error(errorMessage)
      } else {
        toast.error('Failed to approve comment')
      }
    }
  }
  const deleteComment = async () => {
    const confirm = window.confirm(
      'Are you sure you want to delete this comment?'
    )
    if (!confirm) return

    try {
      const { data } = await authAxios.post('/api/admin/delete-comment', {
        id: _id
      })
      if (data.success) {
        toast.success('Comment deleted successfully')
      } else if (data.message && typeof data.message === 'string') {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      const errorMessage = error.response?.data?.message
      if (errorMessage && typeof errorMessage === 'string') {
        toast.error(errorMessage)
      } else {
        toast.error('Failed to delete comment')
      }
    }
  }

  return (
    <tr className='order-y border-gray-300'>
      <td className='px-6 py-4'>
        <b className='font-medium text-gray-600'>Blog</b>:{blog.title}
        <br />
        <br />
        <b className='font-medium text-gray-600'>Name</b>:{comment.name}
        <br />
        <b className='font-medium text-gray-600'>Comment</b>:{comment.content}
      </td>
      <td className='px-6 py-4 max-sm:hidden'>
        {BlogDate.toLocaleDateString()}
      </td>
      <td className='px-6 py-4'>
        <div className='inline-flex items-center gap-4'>
          {}
          {!comment.isApproved ? (
            <img
              onClick={approveComment}
              src={assets.tick_icon}
              className='w-5 hover:scale-110  transition-all cursor-pointer'
            />
          ) : (
            <p className='text-xs border border-green-600  bg-green-100 text-green-600 rounded-full px-3 py-1'>
              Approved
            </p>
          )}
          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            alt='delete-comment'
            className='w-5 hover:scale-110 transition-all cursor-pointer'
          />
        </div>
      </td>
    </tr>
  )
}

export default CommentTableItem
