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

// Parse metadata manually from the export statement without eval
function parseMetadataFromExport(metadataString: string): PostMetadata | null {
  try {
    // Create a safe parsing function that extracts key-value pairs
    const parseValue = (value: string): any => {
      value = value.trim()
      // Handle strings
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1)
      }
      // Handle booleans
      if (value === 'true') return true
      if (value === 'false') return false
      // Handle numbers
      if (/^\d+$/.test(value)) return parseInt(value, 10)
      if (/^\d+\.\d+$/.test(value)) return parseFloat(value)
      // Handle arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        const items = value.slice(1, -1).split(',').map(item => parseValue(item.trim()))
        return items.filter(item => item !== null)
      }
      // Handle nested objects (simplified)
      if (value.startsWith('{') && value.endsWith('}')) {
        // For now, return empty object - in production, use a proper JSON parser
        return {}
      }
      return null
    }

    // Extract simple properties using regex patterns
    const metadata: Partial<PostMetadata> = {}
    
    // Extract title
    const titleMatch = metadataString.match(/title:\s*["']([^"']+)["']/)
    if (titleMatch) metadata.title = titleMatch[1]
    
    // Extract featuredImage
    const featuredImageMatch = metadataString.match(/featuredImage:\s*["']([^"']+)["']/)
    if (featuredImageMatch) metadata.featuredImage = featuredImageMatch[1]
    
    // Extract dates
    const publishDateMatch = metadataString.match(/publishDate:\s*["']([^"']+)["']/)
    if (publishDateMatch) metadata.publishDate = publishDateMatch[1]
    
    // Extract excerpt
    const excerptMatch = metadataString.match(/excerpt:\s*["']([^"']+)["']/)
    if (excerptMatch) metadata.excerpt = excerptMatch[1]
    
    // Extract description
    const descriptionMatch = metadataString.match(/description:\s*["']([^"']+)["']/)
    if (descriptionMatch) metadata.description = descriptionMatch[1]
    
    // Extract series
    const seriesMatch = metadataString.match(/series:\s*["']([^"']+)["']/)
    if (seriesMatch) metadata.series = seriesMatch[1]
    
    // Extract booleans
    const featuredMatch = metadataString.match(/featured:\s*(true|false)/)
    if (featuredMatch) metadata.featured = featuredMatch[1] === 'true'
    
    const draftMatch = metadataString.match(/draft:\s*(true|false)/)
    if (draftMatch) metadata.draft = draftMatch[1] === 'true'
    
    // Extract tags array
    const tagsMatch = metadataString.match(/tags:\s*\[([^\]]+)\]/)
    if (tagsMatch) {
      metadata.tags = tagsMatch[1]
        .split(',')
        .map(tag => tag.trim().replace(/["']/g, ''))
        .filter(tag => tag.length > 0)
    }
    
    // Extract categories array
    const categoriesMatch = metadataString.match(/categories:\s*\[([^\]]+)\]/)
    if (categoriesMatch) {
      metadata.categories = categoriesMatch[1]
        .split(',')
        .map(cat => cat.trim().replace(/["']/g, ''))
        .filter(cat => cat.length > 0)
    }

    return metadata as PostMetadata
  } catch (error) {
    console.error('Failed to parse metadata:', error)
    return null
  }
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
      const metadataObj = parseMetadataFromExport(metadataMatch[1])
      if (metadataObj) {
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