import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPosts } from '../lib/api'
import { VoteButton } from './VoteButton'

export function PostList({ sortBy = 'recent', searchQuery = '' }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPosts()
  }, [sortBy, searchQuery])

  const loadPosts = async () => {
    try {
      const data = await getPosts(searchQuery, sortBy)
      setPosts(data || [])
    } catch (err) {
      console.error('Error loading posts:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="post-container">Loading...</div>
  if (error) return <div className="post-container">Error: {error}</div>

  return (
    <div className="posts-list">
      {posts.map(post => (
        <div key={post.id} className="post-container" style={{ position: 'relative', minHeight: '100px' }}>
          <div className="post-content-wrapper" style={{ paddingBottom: '40px' }}>
            <Link to={`/posts/${post.id}`} className="post-title">
              {post.title}
            </Link>
            
            <div className="post-date" style={{ marginTop: '1rem' }}>
              Posted {new Date(post.created_at).toLocaleString()}
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            zIndex: '1'
          }}>
            <VoteButton 
              postId={post.id} 
              initialVoteCount={post.votes_count}
              className="scale-90 opacity-75 hover:opacity-100"
            />
          </div>
        </div>
      ))}
      
      {posts.length === 0 && (
        <div className="post-container">No posts found</div>
      )}
    </div>
  )
}
