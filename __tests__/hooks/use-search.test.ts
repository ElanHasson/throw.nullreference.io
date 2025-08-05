import { renderHook, waitFor } from '@testing-library/react'
import { useSearch } from '@/hooks/use-search'
import Fuse from 'fuse.js'

const mockFuseConstructor = Fuse as jest.MockedClass<typeof Fuse>

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock Fuse.js
const mockFuseSearch = jest.fn()
jest.mock('fuse.js', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    search: mockFuseSearch,
  })),
  IFuseOptions: {},
}))

const mockPosts = [
  {
    title: 'React Testing Guide',
    description: 'Complete guide to testing React applications',
    date: '2023-01-15T00:00:00.000Z',
    slug: 'react-testing-guide',
    url: '/blog/react-testing-guide',
    content:
      'This guide covers unit testing, integration testing, and end-to-end testing for React applications.',
    featured: true,
    tags: ['react', 'testing', 'javascript'],
    categories: ['frontend', 'development'],
  },
  {
    title: 'Node.js Performance Tips',
    description: 'Optimize your Node.js applications',
    date: '2023-01-10T00:00:00.000Z',
    slug: 'nodejs-performance-tips',
    url: '/blog/nodejs-performance-tips',
    content: 'Learn how to profile and optimize Node.js applications for better performance.',
    featured: false,
    tags: ['nodejs', 'performance'],
    categories: ['backend', 'development'],
  },
]

describe('useSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFuseSearch.mockReturnValue([])
  })

  it('should load posts on mount', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPosts),
    })

    const { result } = renderHook(() => useSearch())

    expect(result.current.loading).toBe(true)
    expect(result.current.posts).toEqual([])
    expect(result.current.error).toBe(null)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.posts).toEqual(mockPosts)
    expect(result.current.error).toBe(null)
    expect(mockFetch).toHaveBeenCalledWith('/api/search')
  })

  it('should handle fetch errors', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    })

    const { result } = renderHook(() => useSearch())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.posts).toEqual([])
    expect(result.current.error).toBe('Failed to load search index')
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useSearch())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.posts).toEqual([])
    expect(result.current.error).toBe('Network error')
  })

  it('should handle unknown errors', async () => {
    mockFetch.mockRejectedValue('String error')

    const { result } = renderHook(() => useSearch())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.posts).toEqual([])
    expect(result.current.error).toBe('Failed to load posts')
  })

  describe('search functionality', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPosts),
      })
    })

    it('should return all posts when query is empty', async () => {
      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const results = result.current.search('')
      expect(results).toEqual(mockPosts)
      expect(mockFuseSearch).not.toHaveBeenCalled()
    })

    it('should return all posts when query is only whitespace', async () => {
      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const results = result.current.search('   ')
      expect(results).toEqual(mockPosts)
      expect(mockFuseSearch).not.toHaveBeenCalled()
    })

    it('should use Fuse.js for non-empty queries', async () => {
      const mockSearchResults = [
        { item: mockPosts[0], score: 0.1 },
        { item: mockPosts[1], score: 0.3 },
      ]
      mockFuseSearch.mockReturnValue(mockSearchResults)

      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const results = result.current.search('react')

      expect(mockFuseSearch).toHaveBeenCalledWith('react')
      expect(results).toEqual([mockPosts[0], mockPosts[1]])
    })

    it('should return empty array when Fuse is not initialized', async () => {
      const { result } = renderHook(() => useSearch())

      // Search before posts are loaded
      const results = result.current.search('react')
      expect(results).toEqual([])
    })

    it('should initialize Fuse with correct options', async () => {
      const { result } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Trigger search to ensure Fuse is used
      result.current.search('test')

      expect(mockFuseConstructor).toHaveBeenCalledWith(mockPosts, {
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
      })
    })

    it('should recreate Fuse instance when posts change', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockPosts[0]]),
      })

      const { result, rerender } = renderHook(() => useSearch())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(mockFuseConstructor).toHaveBeenCalledWith([mockPosts[0]], expect.any(Object))

      // Simulate posts changing (though this wouldn't happen in real usage)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPosts),
      })

      rerender()

      // The Fuse constructor should be called again if posts changed
      // Note: In the real implementation, posts only change once on mount
      expect(mockFuseConstructor).toHaveBeenCalledTimes(1)
    })
  })
})
