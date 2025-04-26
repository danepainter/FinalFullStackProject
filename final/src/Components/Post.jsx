import { useState } from 'react'
import { Link } from 'react-router-dom'
import { VoteButton } from './VoteButton'

export function Post({ post, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true)
      try {
        await onDelete(post.id)
      } catch (error) {
        console.error('Error deleting post:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          <Link to={`/posts/${post.id}`} className="hover:text-blue-600">
            {post.title}
          </Link>
        </h2>
        <VoteButton postId={post.id} initialVoteCount={post.votes} />
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Posted by Anonymous</span>
          <span>•</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            to={`/posts/${post.id}`} 
            className="hover:text-blue-600"
          >
            {post.comment_count || 0} comments
          </Link>
          <Link 
            to={`/posts/${post.id}/edit`}
            className="hover:text-blue-600"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-600 disabled:text-red-300"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}


