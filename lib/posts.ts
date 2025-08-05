import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compareDesc } from 'date-fns'
import { PostMeta, PostMetadata } from './types'

const postsDirectory = path.join(process.cwd(), 'private/posts')

function getPostFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  return fs.readdirSync(postsDirectory)
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace('.mdx', ''))
}

function getPostMetadata(slug: string): PostMeta | null {
  try {
    const filePath = path.join(postsDirectory, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    // First try to extract JS-style metadata export
    const metadataMatch = fileContent.match(/export const metadata = ({[\s\S]*?});/)
    if (metadataMatch) {
      try {
        // Use eval to parse the metadata object (safe since we control the content)
        const metadataObj = eval(`(${metadataMatch[1]})`) as PostMetadata
        
        return {
          title: metadataObj.title || '',
          date: metadataObj.publishDate || new Date().toISOString(),
          description: metadataObj.excerpt || metadataObj.description || '',
          tags: metadataObj.tags || [],
          categories: metadataObj.categories || [],
          series: metadataObj.series || '',
          featured: metadataObj.featured || false,
          draft: metadataObj.draft || false,
          featuredImage: metadataObj.featuredImage || '',
          slug,
        }
      } catch (evalError) {
        console.warn(`Failed to parse JS metadata for ${slug}, trying regex fallback`)
      }
    }

    // Fallback: try to parse as frontmatter
    try {
      const { data } = matter(fileContent)
      const metadata = data as PostMetadata
      return {
        title: metadata.title || '',
        date: metadata.publishDate || new Date().toISOString(),
        description: metadata.excerpt || metadata.description || '',
        tags: metadata.tags || [],
        categories: metadata.categories || [],
        series: metadata.series || '',
        featured: metadata.featured || false,
        draft: metadata.draft || false,
        featuredImage: metadata.featuredImage || '',
        slug,
      }
    } catch (frontmatterError) {
      console.warn(`Failed to parse frontmatter for ${slug}`)
      return null
    }
  } catch (error) {
    console.error(`Error reading post metadata for ${slug}:`, error)
    return null
  }
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const slugs = getPostFiles()
  const posts: PostMeta[] = []

  for (const slug of slugs) {
    const metadata = getPostMetadata(slug)
    if (metadata && !metadata.draft) {
      posts.push(metadata)
    }
  }

  return posts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
}

export async function getRecentPosts(limit: number = 5): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.slice(0, limit)
}

export async function getFeaturedPosts(limit: number = 3): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  const featuredPosts = posts.filter((post) => post.featured)
  return featuredPosts.length > 0 ? featuredPosts.slice(0, limit) : posts.slice(0, limit)
}

export async function getPostBySlug(slug: string): Promise<PostMeta | null> {
  return getPostMetadata(slug)
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.tags?.includes(tag))
}

export async function getPostsBySeries(series: string): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.series === series)
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tags = new Set<string>()
  posts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags).sort()
}

export async function getAllSeries(): Promise<string[]> {
  const posts = await getAllPosts()
  const series = new Set<string>()
  posts.forEach((post) => {
    if (post.series) {
      series.add(post.series)
    }
  })
  return Array.from(series).sort()
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts()
  const categories = new Set<string>()
  posts.forEach((post) => {
    post.categories?.forEach((category) => categories.add(category))
  })
  return Array.from(categories).sort()
}

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

export async function getAdjacentPosts(currentSlug: string) {
  const posts = await getAllPosts()
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug)

  if (currentIndex === -1) {
    return { previousPost: null, nextPost: null }
  }

  return {
    previousPost: currentIndex > 0 ? posts[currentIndex - 1] : null,
    nextPost: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
  }
}