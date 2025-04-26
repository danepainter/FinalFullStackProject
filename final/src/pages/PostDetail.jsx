import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPost, deletePost } from '../lib/api'
import { CommentList } from '../Components/CommentList'
import { VoteButton } from '../Components/VoteButton'

export function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadPost()
  }, [id])

  const loadPost = async () => {
    try {
      const data = await getPost(id)
      setPost(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true)
      try {
        await deletePost(id)
        navigate('/')
      } catch (error) {
        console.error('Error deleting post:', error)
        alert('Failed to delete post')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!post) return <div>Post not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Main container box */}
        <div className="post-detail-container" style={{
          backgroundColor: '#242424 !important',
          borderRadius: '12px',
          border: '1px solid #333',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Inner lighter box for content */}
          <div className="post-detail-content" style={{
            backgroundColor: '#2d2d2d !important',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <h1 className="text-3xl font-bold mb-8 text-white" style={{ 
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #404040'
            }}>{post.title}</h1>
            
            {post.image_url && (
              <div className="mb-8">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found'
                  }}
                />
              </div>
            )}

            <div className="prose max-w-none text-gray-200">
              {post.content}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-400">
            Posted {new Date(post.created_at).toLocaleDateString()}
          </div>
          <VoteButton 
            postId={post.id} 
            initialVoteCount={post.votes_count || 0}
          />
        </div>

        <div className="flex items-center justify-end gap-4 mb-8">
          <button
            onClick={() => navigate(`/posts/${id}/edit`)}
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
          >
            Edit Post
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Post'}
          </button>
        </div>

        <CommentList postId={post.id} comments={post.comments} />
      </div>
    </div>
  )
}
