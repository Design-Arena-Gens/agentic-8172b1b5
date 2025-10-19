'use client'

import { useState } from 'react'
import CategorySection from './CategorySection'
import { WatchlistItem, Category, MediaType } from '../types'

interface MainContentProps {
  items: WatchlistItem[]
  onUpdateItem: (id: string, updates: Partial<WatchlistItem>) => void
  onDeleteItem: (id: string) => void
  onMoveItem: (id: string, category: Category) => void
  sidebarOpen: boolean
}

export default function MainContent({
  items,
  onUpdateItem,
  onDeleteItem,
  onMoveItem,
  sidebarOpen
}: MainContentProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const categories: { id: Category; title: string }[] = [
    { id: 'watched', title: 'Watched' },
    { id: 'currently-watching', title: 'Currently Watching' },
    { id: 'planning', title: 'Planning to Watch' },
    { id: 'dropped', title: 'Dropped' }
  ]

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleDrop = (category: Category) => {
    if (draggedItem) {
      onMoveItem(draggedItem, category)
      setDraggedItem(null)
    }
  }

  return (
    <div
      className={`flex-1 transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'ml-[380px]' : 'ml-0'
      }`}
    >
      <div className="h-full overflow-y-auto p-8">
        <div className="grid grid-cols-2 gap-6 max-w-[1800px] mx-auto">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category.id}
              title={category.title}
              items={items.filter(item => item.category === category.id)}
              onUpdateItem={onUpdateItem}
              onDeleteItem={onDeleteItem}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              isDragging={draggedItem !== null}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
