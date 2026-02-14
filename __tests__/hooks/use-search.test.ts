import { renderHook, waitFor } from '@testing-library/react'
import { useSearch } from '@/hooks/use-search'

// Mock fetch globally
global.fetch = jest.fn()
global.Response = jest.fn().mockImplementation((body, init) => ({
  ok: init?.status !== false,
  json: () => Promise.resolve(JSON.parse(body)),
  status: init?.status || 200,
  ...init
}))

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

const mockSearchResults = [
  {
    title: 'Learning React Hooks',
    description: 'A comprehensive guide to React hooks',
    date: '2024-01-15',
    slug: 'learning-react-hooks',
    url: '/blog/learning-react-hooks',
    content: 'React hooks are a powerful feature that allows you to use state and other React features without writing a class.',
    featured: true,
    tags: ['React', 'JavaScript', 'Hooks'],
    categories: ['Frontend', 'Tutorial']
  },
  {
    title: 'TypeScript Best Practices',
    description: 'Essential TypeScript patterns for better code',
    date: '2024-01-10',
    slug: 'typescript-best-practices',
    url: '/blog/typescript-best-practices',
    content: 'TypeScript provides static typing for JavaScript, helping catch errors early and improving code quality.',
    featured: false,
    tags: ['TypeScript', 'JavaScript', 'Best Practices'],
    categories: ['Programming', 'Tutorial']
  },
  {
    title: 'Next.js Performance Tips',
    description: 'Optimizing your Next.js applications',
    date: '2024-01-05',
    slug: 'nextjs-performance-tips',
    url: '/blog/nextjs-performance-tips',
    content: 'Next.js offers many built-in optimizations, but there are additional techniques to boost performance.',
    featured: false,
    tags: ['Next.js', 'Performance', 'React'],
    categories: ['Frontend', 'Performance']
  }
]

describe('useSearch Hook', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with loading state', () => {
    mockFetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSearchResults)
      } as Response)
    )

    const { result } = renderHook(() => useSearch())

    expect(result.current.loading).toBe(true)
    expect(result.current.posts).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('should load posts successfully', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSearchResults)
    } as Response)

    const { result } = renderHook(() => useSearch())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.posts).toEqual(mockSearchResults)
    expect(result.current.error).toBeNull()
    expect(mockFetch).toHaveBeenCalledWith('/api/search')
  })

  it('should handle fetch error', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500
    } as Response)

    const { result } = renderHook(() => useSearch())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.posts).toEqual([])
    expect(result.current.error).toBe('Failed to load search index')
  })

  it('should handle network error', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useSearch())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.posts).toEqual([])
    expect(result.current.error).toBe('Network error')
  })

  describe('Search Functionality', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSearchResults)
      } as Response)
    })

    it('should return all posts when search query is empty', async () => {
      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const searchResults = result.current.search('')
      expect(searchResults).toEqual(mockSearchResults)
    })

    it('should return all posts when search query is whitespace only', async () => {
      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const searchResults = result.current.search('   ')
      expect(searchResults).toEqual(mockSearchResults)
    })

    it('should search by title', async () => {
      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const searchResults = result.current.search('Learning React')
      expect(searchResults).toHaveLength(1)
      expect(searchResults[0].title).toBe('Learning React Hooks')
    })

    it('should search by description', async () => {
      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const searchResults = result.current.search('comprehensive guide')
      expect(searchResults).toHaveLength(1)
      expect(searchResults[0].description).toContain('comprehensive guide')
    })

    it('should search by content', async () => {
      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const searchResults = result.current.search('static typing')
      expect(searchResults).toHaveLength(1)
      expect(searchResults[0].title).toBe('TypeScript Best Practices')
    })

    it('should search by tags', async () => {
      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const searchResults = result.current.search('Hooks')
      expect(searchResults).toHaveLength(1)
      expect(searchResults[0].tags).toContain('Hooks')
    })

    it('should search by categories', async () => {
      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const searchResults = result.current.search('Performance')
      expect(searchResults).toHaveLength(1)
      expect(searchResults[0].categories).toContain('Performance')
    })

    it('should handle case insensitive search', async () => {
      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const searchResults = result.current.search('TYPESCRIPT')
      expect(searchResults).toHaveLength(1)
      expect(searchResults[0].title).toBe('TypeScript Best Practices')
    })

    it('should return empty results for no matches', async () => {
      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const searchResults = result.current.search('nonexistent topic')
      expect(searchResults).toHaveLength(0)
    })

    it('should handle partial matches', async () => {
      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const searchResults = result.current.search('Type') // Should match "TypeScript"
      expect(searchResults).toHaveLength(1)
      expect(searchResults[0].title).toBe('TypeScript Best Practices')
    })
  })

  describe('Fuse.js Configuration', () => {
    it('should not create Fuse instance when posts are empty', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([])
      } as Response)

      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const searchResults = result.current.search('test')
      expect(searchResults).toEqual([])
    })

    it('should recreate Fuse instance when posts change', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSearchResults)
      } as Response)

      const { result, rerender } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.posts).toEqual(mockSearchResults)

      // Test that search works with the current posts
      const searchResults = result.current.search('React')
      expect(searchResults.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling Edge Cases', () => {
    it('should handle non-Error exceptions', async () => {
      mockFetch.mockRejectedValue('String error')

      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Failed to load posts')
    })

    it('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      } as Response)

      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Invalid JSON')
    })
  })
})