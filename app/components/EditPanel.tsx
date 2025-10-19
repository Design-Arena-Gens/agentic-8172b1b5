'use client'

import { useState } from 'react'
import { WatchlistItem } from '../types'

interface EditPanelProps {
  item: WatchlistItem
  onUpdate: (updates: Partial<WatchlistItem>) => void
  onDelete: () => void
  onClose: () => void
}

export default function EditPanel({ item, onUpdate, onDelete, onClose }: EditPanelProps) {
  const [title, setTitle] = useState(item.title)
  const [poster, setPoster] = useState(item.poster)
  const [notes, setNotes] = useState(item.notes)
  const [score, setScore] = useState(item.score)

  const handleSave = () => {
    onUpdate({ title, poster, notes, score })
    onClose()
  }

  const handleDelete = () => {
    if (confirm('Delete this item?')) {
      onDelete()
      onClose()
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 fade-in"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[500px] max-h-[80vh] overflow-y-auto fade-in">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Edit Item</h3>
            <button
              onClick={onClose}
              className="glass rounded-lg p-2 hover:bg-white/10 transition-smooth"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Poster URL</label>
              <input
                type="text"
                value={poster}
                onChange={(e) => setPoster(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white/40 transition-smooth"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white/40 transition-smooth"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Score</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setScore(num)}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium transition-smooth ${
                      score === num
                        ? 'bg-white/30 ring-2 ring-white/50'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              {score > 0 && (
                <button
                  onClick={() => setScore(0)}
                  className="mt-2 w-full py-2 rounded-lg text-xs bg-white/5 hover:bg-white/10 transition-smooth"
                >
                  Clear Score
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white/40 transition-smooth resize-none"
                placeholder="Add your thoughts..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-white/20 hover:bg-white/30 rounded-lg py-3 font-medium transition-smooth"
              >
                Save Changes
              </button>
              <button
                onClick={handleDelete}
                className="px-6 bg-red-500/20 hover:bg-red-500/30 rounded-lg py-3 font-medium transition-smooth"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
