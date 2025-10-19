'use client'

import { useState, useEffect, useRef } from 'react'
import { SearchResult } from '../types'

interface SearchBarProps {
  onSelect: (item: Omit<SearchResult, 'year'> & { type: 'movie' | 'tv' }) => void
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const movieResults = await searchMovies(query)
        const tvResults = await searchTV(query)
        setResults([...movieResults, ...tvResults].slice(0, 8))
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  const searchMovies = async (term: string): Promise<SearchResult[]> => {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=movie&limit=5`
      )
      const data = await response.json()
      return data.results.map((item: any) => ({
        title: item.trackName,
        type: 'movie' as const,
        poster: item.artworkUrl100?.replace('100x100', '600x600') || '',
        year: item.releaseDate?.split('-')[0]
      }))
    } catch {
      return []
    }
  }

  const searchTV = async (term: string): Promise<SearchResult[]> => {
    try {
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(term)}`
      )
      const data = await response.json()
      return data.slice(0, 5).map((item: any) => ({
        title: item.show.name,
        type: 'tv' as const,
        poster: item.show.image?.medium || item.show.image?.original || '',
        year: item.show.premiered?.split('-')[0]
      }))
    } catch {
      return []
    }
  }

  const handleSelect = (result: SearchResult) => {
    onSelect({
      title: result.title,
      type: result.type,
      poster: result.poster || 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster'
    })
    setQuery('')
    setResults([])
    setShowResults(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Search movies & TV shows..."
          className="w-full bg-black/30 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-white/40 transition-smooth"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-lg overflow-hidden z-50 fade-in">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelect(result)}
              className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-smooth text-left"
            >
              {result.poster ? (
                <img
                  src={result.poster}
                  alt={result.title}
                  className="w-12 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-16 bg-black/50 rounded flex items-center justify-center text-xs text-white/30">
                  No poster
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{result.title}</div>
                <div className="text-xs text-white/50">
                  {result.type === 'movie' ? 'Movie' : 'TV Show'}
                  {result.year && ` • ${result.year}`}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length > 0 && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  )
}
