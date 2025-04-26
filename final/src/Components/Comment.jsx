import { useState } from 'react'

export function Comment({ comment, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setIsDeleting(true)
      try {
        await onDelete(comment.id)
      } catch (error) {
        console.error('Error deleting comment:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="bg-[#242424] rounded-lg p-4 border border-[#2d2d2d] relative">
      <div className="flex items-center mb-2">
        <span className="text-gray-500 text-sm">
          {new Date(comment.created_at).toLocaleString(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
      
      <p className="text-gray-200 pr-12">{comment.content}</p>
      
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-4 right-4 text-red-400 hover:text-red-300 disabled:text-red-800 transition-colors opacity-50 hover:opacity-100"
        title="Delete comment"
      >
        {isDeleting ? (
          <span className="text-xs">...</span>
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        )}
      </button>
    </div>
  )
}
