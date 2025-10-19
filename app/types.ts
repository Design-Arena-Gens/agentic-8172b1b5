export type Category = 'watched' | 'currently-watching' | 'planning' | 'dropped'

export type MediaType = 'movie' | 'tv' | 'all'

export interface WatchlistItem {
  id: string
  title: string
  type: 'movie' | 'tv'
  poster: string
  category: Category
  score: number
  notes: string
}

export interface SearchResult {
  title: string
  type: 'movie' | 'tv'
  poster: string
  year?: string
}
