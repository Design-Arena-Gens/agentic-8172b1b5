'use client'

import { useState } from 'react'
import ItemCard from './ItemCard'
import { WatchlistItem, Category, MediaType } from '../types'

interface CategorySectionProps {
  category: Category
  title: string
  items: WatchlistItem[]
  onUpdateItem: (id: string, updates: Partial<WatchlistItem>) => void
  onDeleteItem: (id: string) => void
  onDragStart: (itemId: string) => void
  onDragEnd: () => void
  onDrop: (category: Category) => void
  isDragging: boolean
}

export default function CategorySection({
  category,
  title,
  items,
  onUpdateItem,
  onDeleteItem,
  onDragStart,
  onDragEnd,
  onDrop,
  isDragging
}: CategorySectionProps) {
  const [filter, setFilter] = useState<MediaType>('all')
  const [isDragOver, setIsDragOver] = useState(false)

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true
    return item.type === filter
  })

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    onDrop(category)
  }

  return (
    <div
      className={`glass rounded-2xl p-6 transition-smooth ${
        isDragOver && isDragging ? 'ring-2 ring-white/50 bg-white/10' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex gap-1 bg-black/30 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-xs transition-smooth ${
              filter === 'all' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('movie')}
            className={`px-3 py-1 rounded text-xs transition-smooth ${
              filter === 'movie' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setFilter('tv')}
            className={`px-3 py-1 rounded text-xs transition-smooth ${
              filter === 'tv' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            TV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 min-h-[200px]">
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onUpdate={(updates) => onUpdateItem(item.id, updates)}
            onDelete={() => onDeleteItem(item.id)}
            onDragStart={() => onDragStart(item.id)}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  )
}
