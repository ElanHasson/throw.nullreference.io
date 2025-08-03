import { allPostMeta } from '@/.contentlayer/generated'
import { compareDesc } from 'date-fns'
import { PostMeta } from './types'

/**
 * Convert ContentLayer post metadata to PostMeta
 */
function postMetaToPostMeta(postMeta: typeof allPostMeta[0]): PostMeta {
  return {
    title: postMeta.title,
    date: postMeta.date,
    description: postMeta.description,
    thumbnail: postMeta.thumbnail,
    tags: postMeta.tags,
    categories: postMeta.categories,
    draft: postMeta.draft,
    featured: postMeta.featured,
    slug: postMeta.slug,
    series: postMeta.series,
    // Add computed fields
    readingTime: postMeta.readingTime,
    wordCount: postMeta.wordCount,
  }
}

/**
 * Get all blog posts from ContentLayer
 */
export async function getAllPosts(): Promise<PostMeta[]> {
  return allPostMeta
    .filter(post => !post.draft)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .map(postMetaToPostMeta)
}

/**
 * Get recent blog posts (limit to specified number)
 */
export async function getRecentPosts(limit: number = 5): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.slice(0, limit)
}

/**
 * Get posts for the main blog page
 */
export async function getPostsForBlog(): Promise<PostMeta[]> {
  return getAllPosts()
}

/**
 * Get a specific post by slug
 */
export async function getPostBySlug(slug: string): Promise<PostMeta | null> {
  const post = allPostMeta.find(post => post.slug === slug && !post.draft)
  return post ? postMetaToPostMeta(post) : null
}

/**
 * Get the full post metadata (no longer returns compiled content)
 */
export function getFullPost(slug: string) {
  const post = allPostMeta.find(post => post.slug === slug && !post.draft)
  return post ? postMetaToPostMeta(post) : null
}

/**
 * Get featured blog posts
 */
export async function getFeaturedPosts(limit: number = 3): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  const featuredPosts = posts.filter(post => post.featured)
  return featuredPosts.length > 0 ? featuredPosts.slice(0, limit) : posts.slice(0, limit)
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(category: string): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter(post => post.categories?.includes(category))
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter(post => post.tags?.includes(tag))
}

/**
 * Get posts in a series
 */
export async function getPostsBySeries(series: string): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter(post => post.series === series)
}

/**
 * Group posts by year
 */
export function groupPostsByYear(posts: PostMeta[]): Record<number, PostMeta[]> {
  return posts.reduce(
    (acc, post) => {
      const year = new Date(post.date).getFullYear()
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(post)
      return acc
    },
    {} as Record<number, PostMeta[]>,
  )
}

/**
 * Get all unique categories
 */
export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts()
  const categories = new Set<string>()
  posts.forEach(post => {
    post.categories?.forEach(cat => categories.add(cat))
  })
  return Array.from(categories).sort()
}

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tags = new Set<string>()
  posts.forEach(post => {
    post.tags?.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
}