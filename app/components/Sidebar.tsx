'use client'

import { useState } from 'react'
import SearchBar from './SearchBar'
import { WatchlistItem } from '../types'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  onAddItem: (item: Omit<WatchlistItem, 'id'>) => void
  onImport: (data: WatchlistItem[]) => void
  onExport: () => WatchlistItem[]
}

export default function Sidebar({ isOpen, onToggle, onAddItem, onImport, onExport }: SidebarProps) {
  const [manualMode, setManualMode] = useState(false)
  const [manualTitle, setManualTitle] = useState('')
  const [manualPoster, setManualPoster] = useState('')
  const [manualType, setManualType] = useState<'movie' | 'tv'>('movie')
  const [manualCategory, setManualCategory] = useState<WatchlistItem['category']>('planning')

  const handleManualAdd = () => {
    if (manualTitle.trim()) {
      onAddItem({
        title: manualTitle,
        type: manualType,
        poster: manualPoster || 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster',
        category: manualCategory,
        score: 0,
        notes: ''
      })
      setManualTitle('')
      setManualPoster('')
      setManualMode(false)
    }
  }

  const handleExport = () => {
    const data = onExport()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'watchlist.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)
          onImport(data)
        } catch (error) {
          alert('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <>
      <div
        className={`fixed top-4 left-4 z-50 transition-smooth ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <button
          onClick={onToggle}
          className="glass-strong rounded-lg p-3 hover:bg-white/10 transition-smooth"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div
        className={`fixed left-0 top-0 h-full transition-all duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '380px' }}
      >
        <div className="glass-strong h-full rounded-r-3xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Watchlist</h1>
            <button
              onClick={onToggle}
              className="glass rounded-lg p-2 hover:bg-white/10 transition-smooth"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6">
            <div>
              <h2 className="text-sm font-semibold mb-3 text-white/70">Search</h2>
              <SearchBar onSelect={(item) => onAddItem({ ...item, category: 'planning', score: 0, notes: '' })} />
            </div>

            <div>
              <button
                onClick={() => setManualMode(!manualMode)}
                className="w-full glass rounded-lg px-4 py-2 text-sm hover:bg-white/10 transition-smooth"
              >
                {manualMode ? 'Cancel Manual Entry' : 'Add Manually'}
              </button>

              {manualMode && (
                <div className="mt-3 space-y-3 fade-in">
                  <input
                    type="text"
                    placeholder="Title"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white/40 transition-smooth"
                  />
                  <input
                    type="text"
                    placeholder="Poster URL (optional)"
                    value={manualPoster}
                    onChange={(e) => setManualPoster(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white/40 transition-smooth"
                  />
                  <select
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value as 'movie' | 'tv')}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white/40 transition-smooth"
                  >
                    <option value="movie">Movie</option>
                    <option value="tv">TV Show</option>
                  </select>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value as WatchlistItem['category'])}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white/40 transition-smooth"
                  >
                    <option value="planning">Planning to Watch</option>
                    <option value="currently-watching">Currently Watching</option>
                    <option value="watched">Watched</option>
                    <option value="dropped">Dropped</option>
                  </select>
                  <button
                    onClick={handleManualAdd}
                    className="w-full bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-sm transition-smooth"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-6">
              <h2 className="text-sm font-semibold mb-3 text-white/70">Data</h2>
              <div className="space-y-2">
                <button
                  onClick={handleExport}
                  className="w-full glass rounded-lg px-4 py-2 text-sm hover:bg-white/10 transition-smooth text-left"
                >
                  Export List
                </button>
                <label className="block">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                  <span className="block w-full glass rounded-lg px-4 py-2 text-sm hover:bg-white/10 transition-smooth cursor-pointer">
                    Import List
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
