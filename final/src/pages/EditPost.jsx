import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPost, updatePost } from '../lib/api'

export function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPost()
  }, [id])

  const loadPost = async () => {
    try {
      const data = await getPost(id)
      setPost(data)
      setTitle(data.title)
      setContent(data.content)
      setImageUrl(data.image_url || '')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updatePost(id, { 
        title, 
        content,
        image_url: imageUrl 
      })
      navigate(`/posts/${id}`)
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Error updating post')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!post) return <div>Post not found</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            required
            className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL (optional)"
            className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        {imageUrl && (
          <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL'
              }}
            />
          </div>
        )}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Post content"
            required
            rows={4}
            className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
