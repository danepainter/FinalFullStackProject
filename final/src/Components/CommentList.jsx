import { useState } from 'react'
import { Comment } from './Comment'
import { createComment, deleteComment } from '../lib/api'

export function CommentList({ postId, comments: initialComments = [] }) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const comment = await createComment({
        post_id: postId,
        content: newComment
      })
      setComments(prev => [...prev, comment])
      setNewComment('')
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId)
      setComments(comments.filter(comment => comment.id !== commentId))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Comments ({comments.length})</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full px-3 py-2 bg-[#2d2d2d] text-white border border-[#404040] rounded-lg focus:outline-none focus:border-emerald-500"
          rows="3"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
