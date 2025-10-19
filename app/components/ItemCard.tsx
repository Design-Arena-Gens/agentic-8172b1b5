'use client'

import { useState } from 'react'
import EditPanel from './EditPanel'
import { WatchlistItem } from '../types'

interface ItemCardProps {
  item: WatchlistItem
  onUpdate: (updates: Partial<WatchlistItem>) => void
  onDelete: () => void
  onDragStart: () => void
  onDragEnd: () => void
}

export default function ItemCard({ item, onUpdate, onDelete, onDragStart, onDragEnd }: ItemCardProps) {
  const [showEditPanel, setShowEditPanel] = useState(false)

  return (
    <>
      <div
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className="group cursor-move transition-smooth hover:scale-105"
      >
        <div
          className="relative rounded-lg overflow-hidden shadow-lg"
          style={{ aspectRatio: '2/3' }}
        >
          <img
            src={item.poster}
            alt={item.title}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setShowEditPanel(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</div>
              {item.score > 0 && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium">{item.score}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditPanel && (
        <EditPanel
          item={item}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onClose={() => setShowEditPanel(false)}
        />
      )}
    </>
  )
}
