import { useState } from 'react'
import { PostList } from '../Components/PostList'

export function Home({ searchQuery }) {
  const [sortBy, setSortBy] = useState('recent')

  return (
    <div className="home-container">
      <div className="sort-options">
        <span className="sort-label">Order by:</span>
        <button 
          className={`sort-button ${sortBy === 'recent' ? 'active' : ''}`}
          onClick={() => setSortBy('recent')}
        >
          Recent
        </button>
        <button 
          className={`sort-button ${sortBy === 'popular' ? 'active' : ''}`}
          onClick={() => setSortBy('popular')}
        >
          Most Popular
        </button>
      </div>

      <PostList sortBy={sortBy} searchQuery={searchQuery} />
    </div>
  )
} 