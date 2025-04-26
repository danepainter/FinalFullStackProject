import { useState } from 'react'
import { addVote } from '../lib/api'

export function VoteButton({ postId, initialVoteCount = 0, className = '' }) {
  const [voteCount, setVoteCount] = useState(Number(initialVoteCount) || 0)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async () => {
    if (isVoting) return
    
    setIsVoting(true)
    try {
      const newCount = await addVote(postId)
      setVoteCount(newCount)
    } catch (error) {
      console.error('Error adding vote:', error)
      alert('Failed to add vote')
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={isVoting}
      className={`flex items-center space-x-1 px-2 py-0.5 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-sm ${className}`}
    >
      <svg
        className="w-4 h-4 text-emerald-600"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M5 15l7-7 7 7" />
      </svg>
      <span className="font-medium">{voteCount}</span>
    </button>
  )
}
