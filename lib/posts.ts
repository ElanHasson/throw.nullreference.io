import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { PostMeta } from './types'

/**
 * Get all blog posts from the file system
 */
export async function getAllPosts(): Promise<PostMeta[]> {
  const postsDirectory = path.join(process.cwd(), 'app/blog')
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true })

  const posts: PostMeta[] = []

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== '[slug]') {
      const mdxPath = path.join(postsDirectory, entry.name, 'page.mdx')
      if (fs.existsSync(mdxPath)) {
        const fileContents = fs.readFileSync(mdxPath, 'utf8')
        const { data } = matter(fileContents)

        if (!data.draft) {
          posts.push({
            ...data,
            slug: entry.name,
          } as PostMeta)
        }
      }
    }
  }

  // Sort posts by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get recent blog posts (limit to specified number)
 */
export async function getRecentPosts(limit: number = 5): Promise<PostMeta[]> {
  const allPosts = await getAllPosts()
  return allPosts.slice(0, limit)
}

/**
 * Get posts for the main blog page (includes additional fields)
 */
export async function getPostsForBlog(): Promise<PostMeta[]> {
  return getAllPosts()
}

/**
 * Get a specific post by slug
 */
export async function getPostBySlug(slug: string): Promise<PostMeta | null> {
  const postsDirectory = path.join(process.cwd(), 'app/blog')
  const mdxPath = path.join(postsDirectory, slug, 'page.mdx')

  if (!fs.existsSync(mdxPath)) {
    return null
  }

  const fileContents = fs.readFileSync(mdxPath, 'utf8')
  const { data } = matter(fileContents)

  if (data.draft) {
    return null
  }

  return {
    ...data,
    slug,
  } as PostMeta
}

/**
 * Get featured blog posts
 */
export async function getFeaturedPosts(limit: number = 3): Promise<PostMeta[]> {
  const allPosts = await getAllPosts()
  // For now, return the most recent posts as featured
  // In the future, this could check for a "featured" frontmatter field
  return allPosts.filter((post) => post.featured).slice(0, limit).length > 0
    ? allPosts.filter((post) => post.featured).slice(0, limit)
    : allPosts.slice(0, limit)
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
