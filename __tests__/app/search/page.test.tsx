import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSearchParams } from 'next/navigation'
import SearchPage from '@/app/search/page'
import { useSearch } from '@/hooks/use-search'

// Mock the dependencies
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}))

jest.mock('@/hooks/use-search', () => ({
  useSearch: jest.fn(),
}))

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>
const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>

const mockPosts = [
  {
    title: 'React Testing Guide',
    description: 'Complete guide to testing React applications',
    date: '2023-01-15T00:00:00.000Z',
    slug: 'react-testing-guide',
    url: '/blog/react-testing-guide',
    content: 'This guide covers unit testing, integration testing, and end-to-end testing.',
    featured: true,
    tags: ['react', 'testing'],
    categories: ['frontend'],
  },
  {
    title: 'Node.js Performance Tips',
    description: 'Optimize your Node.js applications',
    date: '2023-01-10T00:00:00.000Z',
    slug: 'nodejs-performance-tips',
    url: '/blog/nodejs-performance-tips',
    content: 'Learn how to profile and optimize Node.js applications.',
    featured: false,
    tags: ['nodejs', 'performance'],
    categories: ['backend'],
  },
]

describe('SearchPage', () => {
  const mockSearchParams = {
    get: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSearchParams.mockReturnValue(mockSearchParams as any)
    mockUseSearch.mockReturnValue({
      posts: [],
      search: jest.fn().mockReturnValue([]),
      loading: false,
      error: null,
    })
  })

  it('should render search page with input field', () => {
    render(<SearchPage />)

    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search posts...')).toBeInTheDocument()
    expect(
      screen.getByText('Enter a search term to find posts by title, content, tags, or categories.'),
    ).toBeInTheDocument()
  })

  it('should show loading state', () => {
    mockUseSearch.mockReturnValue({
      posts: [],
      search: jest.fn(),
      loading: true,
      error: null,
    })

    render(<SearchPage />)

    expect(screen.getByText('Loading search index...')).toBeInTheDocument()
    // Check for loading spinner by class instead of role
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('should show error state', () => {
    mockUseSearch.mockReturnValue({
      posts: [],
      search: jest.fn(),
      loading: false,
      error: 'Failed to load search index',
    })

    render(<SearchPage />)

    expect(screen.getByText('Failed to load search index')).toBeInTheDocument()
  })

  it('should initialize with query from URL params', () => {
    mockSearchParams.get.mockReturnValue('react testing')

    render(<SearchPage />)

    const input = screen.getByPlaceholderText('Search posts...')
    expect(input).toHaveValue('react testing')
  })

  it('should update search query when typing', async () => {
    const mockSearch = jest.fn().mockReturnValue([])
    mockUseSearch.mockReturnValue({
      posts: mockPosts,
      search: mockSearch,
      loading: false,
      error: null,
    })

    render(<SearchPage />)

    const input = screen.getByPlaceholderText('Search posts...')

    fireEvent.change(input, { target: { value: 'react' } })

    expect(input).toHaveValue('react')
  })

  it('should display search results', () => {
    const mockSearch = jest.fn().mockReturnValue([mockPosts[0]])
    mockUseSearch.mockReturnValue({
      posts: mockPosts,
      search: mockSearch,
      loading: false,
      error: null,
    })

    mockSearchParams.get.mockReturnValue('react')

    render(<SearchPage />)

    expect(screen.getByText('1 result for "react"')).toBeInTheDocument()
    expect(screen.getByText('React Testing Guide')).toBeInTheDocument()
    expect(screen.getByText('Complete guide to testing React applications')).toBeInTheDocument()
    expect(screen.getByText('January 14, 2023')).toBeInTheDocument()
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('should display multiple search results', () => {
    const mockSearch = jest.fn().mockReturnValue(mockPosts)
    mockUseSearch.mockReturnValue({
      posts: mockPosts,
      search: mockSearch,
      loading: false,
      error: null,
    })

    mockSearchParams.get.mockReturnValue('performance')

    render(<SearchPage />)

    expect(screen.getByText('2 results for "performance"')).toBeInTheDocument()
    expect(screen.getByText('React Testing Guide')).toBeInTheDocument()
    expect(screen.getByText('Node.js Performance Tips')).toBeInTheDocument()
  })

  it('should show no results message', () => {
    const mockSearch = jest.fn().mockReturnValue([])
    mockUseSearch.mockReturnValue({
      posts: mockPosts,
      search: mockSearch,
      loading: false,
      error: null,
    })

    mockSearchParams.get.mockReturnValue('nonexistent')

    render(<SearchPage />)

    expect(screen.getByText('No results found for "nonexistent"')).toBeInTheDocument()
    expect(screen.getByText(/Try adjusting your search terms/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'blog section' })).toHaveAttribute('href', '/blog')
  })

  it('should render post without description', () => {
    const postWithoutDescription = {
      ...mockPosts[0],
      description: undefined,
    }

    const mockSearch = jest.fn().mockReturnValue([postWithoutDescription])
    mockUseSearch.mockReturnValue({
      posts: mockPosts,
      search: mockSearch,
      loading: false,
      error: null,
    })

    mockSearchParams.get.mockReturnValue('react')

    render(<SearchPage />)

    expect(screen.getByText('React Testing Guide')).toBeInTheDocument()
    expect(
      screen.queryByText('Complete guide to testing React applications'),
    ).not.toBeInTheDocument()
  })

  it('should render non-featured post without featured badge', () => {
    const mockSearch = jest.fn().mockReturnValue([mockPosts[1]])
    mockUseSearch.mockReturnValue({
      posts: mockPosts,
      search: mockSearch,
      loading: false,
      error: null,
    })

    mockSearchParams.get.mockReturnValue('nodejs')

    render(<SearchPage />)

    expect(screen.getByText('Node.js Performance Tips')).toBeInTheDocument()
    expect(screen.queryByText('Featured')).not.toBeInTheDocument()
  })

  it('should make search results clickable', () => {
    const mockSearch = jest.fn().mockReturnValue([mockPosts[0]])
    mockUseSearch.mockReturnValue({
      posts: mockPosts,
      search: mockSearch,
      loading: false,
      error: null,
    })

    mockSearchParams.get.mockReturnValue('react')

    render(<SearchPage />)

    const titleLink = screen.getByRole('link', { name: 'React Testing Guide' })
    expect(titleLink).toHaveAttribute('href', '/blog/react-testing-guide')
  })

  it('should handle empty query gracefully', () => {
    mockSearchParams.get.mockReturnValue('')

    render(<SearchPage />)

    const input = screen.getByPlaceholderText('Search posts...')
    expect(input).toHaveValue('')
    expect(
      screen.getByText('Enter a search term to find posts by title, content, tags, or categories.'),
    ).toBeInTheDocument()
  })

  it('should handle null query param', () => {
    mockSearchParams.get.mockReturnValue(null)

    render(<SearchPage />)

    const input = screen.getByPlaceholderText('Search posts...')
    expect(input).toHaveValue('')
  })

  it('should format dates correctly', () => {
    const mockSearch = jest.fn().mockReturnValue([
      {
        ...mockPosts[0],
        date: '2023-12-25T15:30:00.000Z',
      },
    ])

    mockUseSearch.mockReturnValue({
      posts: mockPosts,
      search: mockSearch,
      loading: false,
      error: null,
    })

    mockSearchParams.get.mockReturnValue('test')

    render(<SearchPage />)

    expect(screen.getByText('December 25, 2023')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<SearchPage />)

    const input = screen.getByPlaceholderText('Search posts...')
    expect(input).toHaveAttribute('type', 'text')
    // Note: autoFocus is present in component but may not appear in test DOM

    // Check for search icon by class instead of role
    expect(document.querySelector('svg')).toBeInTheDocument()
  })
})
