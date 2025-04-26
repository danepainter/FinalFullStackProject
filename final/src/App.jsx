import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import { Home } from './pages/Home'
import { CreatePost } from './pages/CreatePost'
import { PostDetail } from './pages/PostDetail'
import { EditPost } from './pages/EditPost'
import './App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <div className="header-content">
            <Link to="/" className="header-title">
              Music Dungeon
            </Link>

            <div className="search-container">
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <nav className="nav-links">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/create" className="nav-link">
                Create New Post
              </Link>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/posts/:id/edit" element={<EditPost />} />
            <Route path="*" element={
              <div style={{ textAlign: 'center' }}>
                <h1>404 - Page Not Found</h1>
                <Link to="/" className="nav-link">
                  Return to Home
                </Link>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
