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

const mockPosts: SearchResult[] = [
  {
    title: 'React Testing Guide',
    description: 'Complete guide to testing React applications with Jest and Testing Library',
    date: '2023-01-15T00:00:00.000Z',
    slug: 'react-testing-guide',
    url: '/blog/react-testing-guide',
    content:
      'This comprehensive guide covers unit testing, integration testing, and end-to-end testing for React applications. Learn how to test components, hooks, and user interactions effectively.',
    featured: true,
    tags: ['react', 'testing', 'javascript', 'jest'],
    categories: ['frontend', 'development', 'tutorial'],
  },
  {
    title: 'Node.js Performance Optimization',
    description: 'Advanced techniques for optimizing Node.js application performance',
    date: '2023-01-10T00:00:00.000Z',
    slug: 'nodejs-performance-optimization',
    url: '/blog/nodejs-performance-optimization',
    content:
      'Learn how to profile and optimize Node.js applications for better performance. Covers memory management, CPU optimization, and database query optimization techniques.',
    featured: false,
    tags: ['nodejs', 'performance', 'backend', 'optimization'],
    categories: ['backend', 'development', 'performance'],
  },
  {
    title: 'TypeScript Best Practices',
    description: 'Essential TypeScript patterns and practices for large applications',
    date: '2023-01-05T00:00:00.000Z',
    slug: 'typescript-best-practices',
    url: '/blog/typescript-best-practices',
    content:
      'Discover TypeScript best practices for building maintainable, scalable applications. Learn about type safety, interfaces, generics, and advanced TypeScript features.',
    featured: true,
    tags: ['typescript', 'javascript', 'best-practices', 'development'],
    categories: ['frontend', 'backend', 'development'],
  },
  {
    title: 'Docker Container Security',
    description: 'Securing Docker containers in production environments',
    date: '2022-12-20T00:00:00.000Z',
    slug: 'docker-container-security',
    url: '/blog/docker-container-security',
    content:
      'Learn essential Docker security practices including image scanning, runtime security, network policies, and container hardening techniques for production deployments.',
    featured: false,
    tags: ['docker', 'security', 'devops', 'containers'],
    categories: ['devops', 'security'],
  },
]

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

describe('Search Integration with Fuse.js', () => {
  let fuse: Fuse<SearchResult>

  beforeEach(() => {
    fuse = new Fuse(mockPosts, fuseOptions)
  })

  describe('Title-based searches', () => {
    it('should find posts by exact title match', () => {
      const results = fuse.search('React Testing Guide')

      expect(results).toHaveLength(1)
      expect(results[0].item.title).toBe('React Testing Guide')
      expect(results[0].score).toBeLessThan(0.1) // Very low score = high relevance
    })

    it('should find posts by partial title match', () => {
      const results = fuse.search('React')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].item.title).toBe('React Testing Guide')
    })

    it('should handle case insensitive title searches', () => {
      const results = fuse.search('react testing')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].item.title).toBe('React Testing Guide')
    })

    it('should rank title matches higher than content matches', () => {
      const results = fuse.search('TypeScript')

      // Should find the TypeScript post first, not posts that just mention TypeScript
      expect(results[0].item.title).toBe('TypeScript Best Practices')
    })
  })

  describe('Description-based searches', () => {
    it('should find posts by description content', () => {
      const results = fuse.search('Advanced techniques')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].item.title).toBe('Node.js Performance Optimization')
    })

    it('should weight description matches appropriately', () => {
      const results = fuse.search('testing React applications')

      expect(results[0].item.title).toBe('React Testing Guide')
      expect(results[0].score).toBeLessThan(0.9) // More lenient threshold
    })
  })

  describe('Content-based searches', () => {
    it('should find posts by content keywords', () => {
      const results = fuse.search('performance')

      expect(results.length).toBeGreaterThan(0)
      const titles = results.map((r) => r.item.title)
      expect(titles).toContain('Node.js Performance Optimization')
    })

    it('should find posts with technical terms in content', () => {
      const results = fuse.search('optimization')

      expect(results.length).toBeGreaterThan(0)
      const titles = results.map((r) => r.item.title)
      expect(titles).toContain('Node.js Performance Optimization')
    })

    it('should handle multi-word content searches', () => {
      const results = fuse.search('Docker security')

      expect(results.length).toBeGreaterThan(0)
      const titles = results.map((r) => r.item.title)
      expect(titles).toContain('Docker Container Security')
    })
  })

  describe('Tag-based searches', () => {
    it('should find posts by exact tag match', () => {
      const results = fuse.search('docker')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].item.title).toBe('Docker Container Security')
    })

    it('should find posts by multiple tags', () => {
      const results = fuse.search('javascript')

      const titles = results.map((r) => r.item.title)
      expect(titles).toContain('React Testing Guide')
      expect(titles).toContain('TypeScript Best Practices')
    })

    it('should handle tag searches with good relevance', () => {
      const results = fuse.search('devops')

      expect(results[0].item.title).toBe('Docker Container Security')
      expect(results[0].score).toBeLessThan(0.3)
    })
  })

  describe('Category-based searches', () => {
    it('should find posts by category', () => {
      const results = fuse.search('security')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].item.title).toBe('Docker Container Security')
    })

    it('should find posts in frontend category', () => {
      const results = fuse.search('frontend')

      const titles = results.map((r) => r.item.title)
      expect(titles).toContain('React Testing Guide')
      expect(titles).toContain('TypeScript Best Practices')
    })

    it('should find posts in development category', () => {
      const results = fuse.search('development')

      expect(results.length).toBeGreaterThan(2) // Multiple posts have this category
    })
  })

  describe('Fuzzy matching', () => {
    it('should handle typos in search terms', () => {
      const results = fuse.search('Reactt') // Extra 't'

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].item.title).toBe('React Testing Guide')
    })

    it('should handle partial word matches', () => {
      const results = fuse.search('Typ') // Partial 'TypeScript'

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].item.title).toBe('TypeScript Best Practices')
    })

    it('should handle misspellings within threshold', () => {
      const results = fuse.search('perfomance') // Missing 'r' in 'performance'

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].item.title).toBe('Node.js Performance Optimization')
    })
  })

  describe('Search result ranking', () => {
    it('should rank results by relevance score', () => {
      const results = fuse.search('React')

      // Scores should be in ascending order (lower = more relevant)
      for (let i = 1; i < results.length; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i - 1].score!)
      }
    })

    it('should prefer exact matches over partial matches', () => {
      const results = fuse.search('TypeScript')

      // Exact title match should be first
      expect(results[0].item.title).toBe('TypeScript Best Practices')
      expect(results[0].score).toBeLessThan(0.1)
    })

    it('should weight title matches higher than content', () => {
      const results = fuse.search('Docker')

      // Post with Docker in title should rank higher than posts mentioning Docker
      expect(results[0].item.title).toBe('Docker Container Security')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty search query', () => {
      const results = fuse.search('')

      expect(results).toHaveLength(0)
    })

    it('should handle single character searches', () => {
      const results = fuse.search('a')

      // Should respect minMatchCharLength: 2
      expect(results).toHaveLength(0)
    })

    it('should handle very long search queries', () => {
      const longQuery =
        'This is a very long search query that contains multiple words and should still work properly'
      const results = fuse.search(longQuery)

      // Should handle gracefully, might return empty results
      expect(Array.isArray(results)).toBe(true)
    })

    it('should handle special characters in search', () => {
      const results = fuse.search('Node.js')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].item.title).toBe('Node.js Performance Optimization')
    })

    it('should return no results for completely unrelated terms', () => {
      const results = fuse.search('quantum physics')

      expect(results).toHaveLength(0)
    })
  })

  describe('Search configuration validation', () => {
    it('should use correct weight distribution', () => {
      // This tests our configuration indirectly by ensuring title has highest weight
      const titleResults = fuse.search('React Testing Guide')
      const contentResults = fuse.search('comprehensive guide')

      // Both should return results
      expect(titleResults.length).toBeGreaterThan(0)
      expect(contentResults.length).toBeGreaterThan(0)

      // Title match should have better score than content match
      if (contentResults.length > 0 && titleResults.length > 0) {
        expect(titleResults[0].score).toBeLessThan(contentResults[0].score!)
      }
    })

    it('should respect threshold setting', () => {
      const results = fuse.search(
        'completely unrelated search term that should not match anything at all',
      )

      // With threshold 0.3, very poor matches should be excluded
      expect(results).toHaveLength(0)
    })

    it('should include match information when configured', () => {
      const results = fuse.search('React')

      expect(results[0]).toHaveProperty('item')
      expect(results[0]).toHaveProperty('score')
      expect(results[0]).toHaveProperty('matches')
    })
  })
})
