import { getAllPosts, getRecentPosts, getFeaturedPosts } from '@/lib/posts'
import { getAllPosts as getBlogPosts } from '@/app/blog/_queries/get-all-posts'

// Mock the blog posts query
jest.mock('@/app/blog/_queries/get-all-posts')

const mockGetBlogPosts = getBlogPosts as jest.MockedFunction<typeof getBlogPosts>

describe('Posts Library', () => {
  const mockPosts = [
    {
      slug: 'post-1',
      title: 'First Post',
      publishDate: '2024-01-15',
      excerpt: 'First post excerpt',
      description: 'First post description',
      featured: true,
      draft: false,
      featuredImage: '/images/post-1.jpg',
      categories: ['Tech'],
      tags: ['JavaScript', 'React'],
      series: 'Web Development'
    },
    {
      slug: 'post-2',
      title: 'Second Post',
      publishDate: '2024-01-10',
      excerpt: '',
      description: 'Second post description',
      featured: false,
      draft: false,
      featuredImage: undefined,
      categories: ['Programming'],
      tags: ['TypeScript'],
      series: undefined
    },
    {
      slug: 'post-3',
      title: 'Third Post (Draft)',
      publishDate: '2024-01-20',
      excerpt: 'Draft post excerpt',
      description: 'Draft post description',
      featured: false,
      draft: true,
      featuredImage: undefined,
      categories: ['Tech'],
      tags: ['Node.js'],
      series: undefined
    },
    {
      slug: 'post-4',
      title: 'Fourth Post',
      publishDate: '2024-01-05',
      excerpt: 'Older post excerpt',
      description: 'Older post description',
      featured: true,
      draft: false,
      featuredImage: '/images/post-4.jpg',
      categories: ['Tech'],
      tags: ['Python'],
      series: undefined
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllPosts', () => {
    it('should return all non-draft posts by default, sorted by date descending', async () => {
      const nonDraftPosts = mockPosts.filter(post => !post.draft)
      mockGetBlogPosts.mockResolvedValue(nonDraftPosts)

      const result = await getAllPosts()

      expect(mockGetBlogPosts).toHaveBeenCalledWith(false)
      expect(result).toHaveLength(3)
      
      // Should be sorted by date descending (newest first)
      expect(result[0].slug).toBe('post-1') // 2024-01-15
      expect(result[1].slug).toBe('post-2') // 2024-01-10
      expect(result[2].slug).toBe('post-4') // 2024-01-05
    })

    it('should include draft posts when includeDrafts is true', async () => {
      mockGetBlogPosts.mockResolvedValue(mockPosts)

      const result = await getAllPosts(true)

      expect(mockGetBlogPosts).toHaveBeenCalledWith(true)
      expect(result).toHaveLength(4)
      
      // Should include the draft post, sorted by date
      expect(result[0].slug).toBe('post-3') // 2024-01-20 (newest)
      expect(result[0].draft).toBe(true)
    })

    it('should transform posts correctly with proper field mapping', async () => {
      mockGetBlogPosts.mockResolvedValue([mockPosts[0]])

      const result = await getAllPosts()

      expect(result[0]).toEqual({
        slug: 'post-1',
        title: 'First Post',
        date: '2024-01-15',
        description: 'First post excerpt', // Uses excerpt over description
        featured: true,
        draft: false,
        featuredImage: '/images/post-1.jpg',
        categories: ['Tech'],
        tags: ['JavaScript', 'React'],
        series: 'Web Development'
      })
    })

    it('should use description when excerpt is empty', async () => {
      mockGetBlogPosts.mockResolvedValue([mockPosts[1]])

      const result = await getAllPosts()

      expect(result[0].description).toBe('Second post description')
    })

    it('should handle missing optional fields gracefully', async () => {
      const minimalPost = {
        slug: 'minimal-post',
        title: 'Minimal Post',
        publishDate: '2024-01-01'
      }
      mockGetBlogPosts.mockResolvedValue([minimalPost])

      const result = await getAllPosts()

      expect(result[0]).toEqual({
        slug: 'minimal-post',
        title: 'Minimal Post',
        date: '2024-01-01',
        description: '',
        featured: false,
        draft: false,
        featuredImage: undefined,
        categories: [],
        tags: [],
        series: undefined
      })
    })
  })

  describe('getRecentPosts', () => {
    it('should return the specified number of recent posts', async () => {
      const nonDraftPosts = mockPosts.filter(post => !post.draft)
      mockGetBlogPosts.mockResolvedValue(nonDraftPosts)

      const result = await getRecentPosts(2)

      expect(result).toHaveLength(2)
      expect(result[0].slug).toBe('post-1') // Most recent
      expect(result[1].slug).toBe('post-2') // Second most recent
    })

    it('should default to 5 posts when no limit is specified', async () => {
      const nonDraftPosts = mockPosts.filter(post => !post.draft)
      mockGetBlogPosts.mockResolvedValue(nonDraftPosts)

      const result = await getRecentPosts()

      // Should call getAllPosts and slice to 5 (though we only have 3 posts)
      expect(result).toHaveLength(3)
    })

    it('should handle when there are fewer posts than the limit', async () => {
      const nonDraftPosts = mockPosts.filter(post => !post.draft)
      mockGetBlogPosts.mockResolvedValue(nonDraftPosts)

      const result = await getRecentPosts(10)

      expect(result).toHaveLength(3) // Only 3 available
    })
  })

  describe('getFeaturedPosts', () => {
    it('should return only featured posts up to the limit', async () => {
      const nonDraftPosts = mockPosts.filter(post => !post.draft)
      mockGetBlogPosts.mockResolvedValue(nonDraftPosts)

      const result = await getFeaturedPosts(3)

      expect(result).toHaveLength(2) // Only 2 featured posts available
      expect(result.every(post => post.featured)).toBe(true)
      expect(result[0].slug).toBe('post-1') // Most recent featured
      expect(result[1].slug).toBe('post-4') // Older featured
    })

    it('should default to 3 posts when no limit is specified', async () => {
      const nonDraftPosts = mockPosts.filter(post => !post.draft)
      mockGetBlogPosts.mockResolvedValue(nonDraftPosts)

      const result = await getFeaturedPosts()

      expect(result).toHaveLength(2) // Only 2 featured posts available
      expect(result.every(post => post.featured)).toBe(true)
    })

    it('should return regular posts as fallback when no featured posts exist', async () => {
      const nonFeaturedPosts = mockPosts.filter(post => !post.featured && !post.draft)
      mockGetBlogPosts.mockResolvedValue(nonFeaturedPosts)

      const result = await getFeaturedPosts()

      // Should return regular posts as fallback, limited by the limit
      expect(result).toHaveLength(1) // Only 1 non-featured, non-draft post
      expect(result[0].featured).toBe(false)
    })

    it('should maintain date sorting for featured posts', async () => {
      const nonDraftPosts = mockPosts.filter(post => !post.draft)
      mockGetBlogPosts.mockResolvedValue(nonDraftPosts)

      const result = await getFeaturedPosts()

      // Featured posts should be sorted by date descending
      expect(result[0].slug).toBe('post-1') // 2024-01-15
      expect(result[1].slug).toBe('post-4') // 2024-01-05
    })
  })

  describe('Error Handling', () => {
    it('should handle when getBlogPosts throws an error', async () => {
      mockGetBlogPosts.mockRejectedValue(new Error('Failed to fetch posts'))

      await expect(getAllPosts()).rejects.toThrow('Failed to fetch posts')
    })

    it('should handle empty posts array', async () => {
      mockGetBlogPosts.mockResolvedValue([])

      const result = await getAllPosts()
      expect(result).toHaveLength(0)

      const recentResult = await getRecentPosts()
      expect(recentResult).toHaveLength(0)

      const featuredResult = await getFeaturedPosts()
      expect(featuredResult).toHaveLength(0)
    })
  })
})