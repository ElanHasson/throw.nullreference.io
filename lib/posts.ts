import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compareDesc } from 'date-fns'
import { PostMeta } from './types'

const postsDirectory = path.join(process.cwd(), 'app/blog')

/**
 * Get all blog post directories
 */
function getPostDirectories(): string[] {
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith('[')) // Exclude dynamic routes
}

/**
 * Read post metadata from page.mdx file
 */
function getPostMetadata(slug: string): PostMeta | null {
  try {
    const postPath = path.join(postsDirectory, slug, 'page.mdx')
    if (!fs.existsSync(postPath)) {
      return null
    }

    const fileContents = fs.readFileSync(postPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      title: data.title || '',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      description: data.description || '',
      thumbnail: data.thumbnail || '',
      tags: data.tags || [],
      categories: data.categories || [],
      draft: data.draft || false,
      featured: data.featured || false,
      series: data.series || '',
      slug,
    }
  } catch (error) {
    console.error(`Error reading post metadata for ${slug}:`, error)
    return null
  }
}

/**
 * Get all blog posts
 */
export async function getAllPosts(): Promise<PostMeta[]> {
  const directories = getPostDirectories()
  const posts: PostMeta[] = []

  for (const slug of directories) {
    const metadata = getPostMetadata(slug)
    if (metadata && !metadata.draft) {
      posts.push(metadata)
    }
  }

  return posts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
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
  return getPostMetadata(slug)
}

/**
 * Get the full post metadata
 */
export function getFullPost(slug: string): PostMeta | null {
  return getPostMetadata(slug)
}

/**
 * Get featured blog posts
 */
export async function getFeaturedPosts(limit: number = 3): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  const featuredPosts = posts.filter((post) => post.featured)
  return featuredPosts.length > 0 ? featuredPosts.slice(0, limit) : posts.slice(0, limit)
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(category: string): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.categories?.includes(category))
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.tags?.includes(tag))
}

/**
 * Get posts in a series
 */
export async function getPostsBySeries(series: string): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.series === series)
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
  posts.forEach((post) => {
    post.categories?.forEach((cat) => categories.add(cat))
  })
  return Array.from(categories).sort()
}

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tags = new Set<string>()
  posts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags).sort()
}
