'use client'

import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import { WatchlistItem, Category } from './types'

const SAMPLE_DATA: WatchlistItem[] = [
  {
    id: '1',
    title: 'Inception',
    type: 'movie',
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    category: 'watched',
    score: 9,
    notes: 'Mind-bending masterpiece'
  },
  {
    id: '2',
    title: 'The Dark Knight',
    type: 'movie',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    category: 'watched',
    score: 10,
    notes: 'Best superhero movie ever'
  },
  {
    id: '3',
    title: 'Interstellar',
    type: 'movie',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    category: 'watched',
    score: 9,
    notes: ''
  },
  {
    id: '4',
    title: 'Breaking Bad',
    type: 'tv',
    poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    category: 'currently-watching',
    score: 10,
    notes: 'Season 4, amazing so far'
  },
  {
    id: '5',
    title: 'Stranger Things',
    type: 'tv',
    poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    category: 'currently-watching',
    score: 8,
    notes: ''
  },
  {
    id: '6',
    title: 'The Office',
    type: 'tv',
    poster: 'https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg',
    category: 'currently-watching',
    score: 9,
    notes: 'Comfort show'
  },
  {
    id: '7',
    title: 'Dune',
    type: 'movie',
    poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    category: 'planning',
    score: 0,
    notes: 'Heard great things'
  },
  {
    id: '8',
    title: 'The Crown',
    type: 'tv',
    poster: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg',
    category: 'planning',
    score: 0,
    notes: ''
  },
  {
    id: '9',
    title: 'Oppenheimer',
    type: 'movie',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    category: 'planning',
    score: 0,
    notes: ''
  },
  {
    id: '10',
    title: 'Iron Fist',
    type: 'tv',
    poster: 'https://image.tmdb.org/t/p/w500/4l6KD9HhtD6nm27VCmvFIHY2Quy.jpg',
    category: 'dropped',
    score: 4,
    notes: 'Could not get into it'
  },
  {
    id: '11',
    title: 'Jupiter Ascending',
    type: 'movie',
    poster: 'https://image.tmdb.org/t/p/w500/2NCcAZ4NLT5PIcHOJRlbIm3Kcpq.jpg',
    category: 'dropped',
    score: 3,
    notes: ''
  },
  {
    id: '12',
    title: 'The Witcher',
    type: 'tv',
    poster: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
    category: 'dropped',
    score: 5,
    notes: 'Season 1 was good, lost interest'
  }
]

export default function Home() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('watchlist')
    if (saved) {
      setItems(JSON.parse(saved))
    } else {
      setItems(SAMPLE_DATA)
    }
  }, [])

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('watchlist', JSON.stringify(items))
    }
  }, [items])

  const addItem = (item: Omit<WatchlistItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString()
    }
    setItems([...items, newItem])
  }

  const updateItem = (id: string, updates: Partial<WatchlistItem>) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const moveItem = (id: string, newCategory: Category) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, category: newCategory } : item
    ))
  }

  const importData = (data: WatchlistItem[]) => {
    setItems(data)
  }

  const exportData = () => {
    return items
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onAddItem={addItem}
        onImport={importData}
        onExport={exportData}
      />
      <MainContent
        items={items}
        onUpdateItem={updateItem}
        onDeleteItem={deleteItem}
        onMoveItem={moveItem}
        sidebarOpen={sidebarOpen}
      />
    </div>
  )
}
