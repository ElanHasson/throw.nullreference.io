/**
 * Simplified search tests focusing on core functionality
 */
import Fuse from 'fuse.js'

interface SearchResult {
  title: string
  description?: string
  content: string
  tags: string[]
  categories: string[]
}

const mockPosts: SearchResult[] = [
  {
    title: 'React Testing Guide',
    description: 'Complete guide to testing React applications',
    content:
      'This guide covers unit testing, integration testing, and end-to-end testing for React applications.',
    tags: ['react', 'testing', 'javascript'],
    categories: ['frontend', 'development'],
  },
  {
    title: 'Node.js Performance Tips',
    description: 'Optimize your Node.js applications',
    content: 'Learn how to profile and optimize Node.js applications for better performance.',
    tags: ['nodejs', 'performance'],
    categories: ['backend', 'development'],
  },
]

const fuseOptions = {
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

describe('Search Functionality', () => {
  let fuse: Fuse<SearchResult>

  beforeEach(() => {
    fuse = new Fuse(mockPosts, fuseOptions)
  })

  it('should find posts by title', () => {
    const results = fuse.search('React')

    expect(results.length).toBeGreaterThan(0)
    expect(results[0].item.title).toBe('React Testing Guide')
  })

  it('should find posts by description', () => {
    const results = fuse.search('Optimize Node.js')

    expect(results.length).toBeGreaterThan(0)
    expect(results[0].item.title).toBe('Node.js Performance Tips')
  })

  it('should find posts by tags', () => {
    const results = fuse.search('performance')

    expect(results.length).toBeGreaterThan(0)
    const titles = results.map((r) => r.item.title)
    expect(titles).toContain('Node.js Performance Tips')
  })

  it('should find posts by categories', () => {
    const results = fuse.search('frontend')

    expect(results.length).toBeGreaterThan(0)
    expect(results[0].item.title).toBe('React Testing Guide')
  })

  it('should handle empty queries', () => {
    const results = fuse.search('')
    expect(results).toHaveLength(0)
  })

  it('should handle queries with no matches', () => {
    const results = fuse.search('quantum physics')
    expect(results).toHaveLength(0)
  })

  it('should sort results by relevance', () => {
    const results = fuse.search('development')

    expect(results.length).toBeGreaterThan(1)
    // Scores should be in ascending order (lower = more relevant)
    for (let i = 1; i < results.length; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i - 1].score!)
    }
  })
})

describe('Content Cleaning Functions', () => {
  function cleanContent(content: string): string {
    return content
      .replace(/<[^>]*>/g, '') // Remove JSX tags
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
      .replace(/#{1,6}\s+/g, '') // Remove heading markers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\n\s*\n/g, '\n') // Remove extra newlines
      .trim()
  }

  it('should remove JSX tags', () => {
    const input = 'Before <Component prop="value" /> after'
    const result = cleanContent(input)
    expect(result).toBe('Before  after')
  })

  it('should remove images', () => {
    const input = 'Before ![alt text](image.png) after'
    const result = cleanContent(input)
    expect(result).toBe('Before  after')
  })

  it('should convert links to text', () => {
    const input = 'Check out [this link](https://example.com) for more'
    const result = cleanContent(input)
    expect(result).toBe('Check out this link for more')
  })

  it('should remove headings', () => {
    const input = '# Title\nContent here'
    const result = cleanContent(input)
    expect(result).toBe('Title\nContent here')
  })

  it('should remove bold and italic', () => {
    const input = 'This is **bold** and *italic* text'
    const result = cleanContent(input)
    expect(result).toBe('This is bold and italic text')
  })

  it('should remove inline code', () => {
    const input = 'Use the `console.log()` function'
    const result = cleanContent(input)
    expect(result).toBe('Use the console.log() function')
  })

  it('should handle empty content', () => {
    const result = cleanContent('')
    expect(result).toBe('')
  })

  it('should preserve regular text', () => {
    const input = 'Regular text with no formatting'
    const result = cleanContent(input)
    expect(result).toBe(input)
  })
})
