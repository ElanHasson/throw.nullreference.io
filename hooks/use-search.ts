import { useState, useEffect, useMemo } from 'react'
import Fuse, { IFuseOptions } from 'fuse.js'

interface SearchResult {
  title: string
  description?: string
  date: string
  slug: string
  url: string
  content: string
  featured: boolean
  tags: string[]
  categories: string[]
}

const fuseOptions: IFuseOptions<SearchResult> = {
  keys: [
    { name: 'title', weight: 0.8 },
    { name: 'description', weight: 0.6 },
    { name: 'content', weight: 0.4 },
    { name: 'tags', weight: 0.3 },
    { name: 'categories', weight: 0.3 },
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  shouldSort: true,
}

export function useSearch() {
  const [posts, setPosts] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fuse = useMemo(() => {
    if (posts.length === 0) return null
    return new Fuse(posts, fuseOptions)
  }, [posts])

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true)
        const response = await fetch('/api/search')
        if (!response.ok) {
          throw new Error('Failed to load search index')
        }
        const data = await response.json()
        setPosts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  const search = (query: string) => {
    if (!fuse || !query.trim()) {
      return posts
    }

    const results = fuse.search(query)
    return results.map((result) => result.item)
  }

  return {
    posts,
    search,
    loading,
    error,
  }
}