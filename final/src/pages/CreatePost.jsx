import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../client'

export function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Title is required')
      return
    }
    setLoading(true)

    try {
      const { error } = await supabase
        .from('posts')
        .insert([{ 
          title: title.trim(), 
          content,
          image_url: imageUrl
        }])

      if (error) throw error
      navigate('/')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title (required)"
            required
            minLength={1}
            className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-emerald-500"
            style={{
              borderColor: title.trim() ? '#404040' : '#dc2626'
            }}
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
        <div>
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
