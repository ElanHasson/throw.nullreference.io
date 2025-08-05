import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { cleanContent } from '@/utils/content-cleaning'
import { PostMetadata } from '@/lib/types'

export const dynamic = 'force-static'

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

function getPostMetadata(slug: string): SearchResult | null {
  try {
    const filePath = path.join(process.cwd(), 'private/posts', `${slug}.mdx`)
    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    // First try to extract JS-style metadata export
    const metadataMatch = fileContent.match(/export const metadata = ({[\s\S]*?});/)
    let metadata: Partial<PostMetadata> = {}
    let content = fileContent

    if (metadataMatch) {
      try {
        // Use eval to parse the metadata object (safe since we control the content)
        metadata = eval(`(${metadataMatch[1]})`) as PostMetadata
        // Extract content after metadata
        const contentMatch = fileContent.match(/export const metadata = {[\s\S]*?};\s*([\s\S]*)/)
        content = contentMatch ? contentMatch[1] : ''
      } catch {
        console.warn(`Failed to parse JS metadata for ${slug}, trying regex fallback`)
      }
    } else {
      // Fallback: try to parse as frontmatter
      try {
        const matterResult = matter(fileContent)
        metadata = matterResult.data as PostMetadata
        content = matterResult.content
      } catch {
        console.warn(`Failed to parse frontmatter for ${slug}`)
        return null
      }
    }

    const cleanedContent = cleanContent(content)

    return {
      title: metadata.title || '',
      description: metadata.excerpt || metadata.description || '',
      date: metadata.publishDate || new Date().toISOString(),
      slug,
      url: `/blog/${slug}`,
      content: cleanedContent,
      featured: metadata.featured || false,
      tags: metadata.tags || [],
      categories: metadata.categories || [],
    }
  } catch (error) {
    console.error(`Error reading post metadata for ${slug}:`, error)
    return null
  }
}

async function getBlogPosts(): Promise<SearchResult[]> {
  const postsDirectory = path.join(process.cwd(), 'private/posts')

  try {
    if (!fs.existsSync(postsDirectory)) {
      return []
    }
    
    const files = fs.readdirSync(postsDirectory)
      .filter(file => file.endsWith('.mdx'))
      .map(file => file.replace('.mdx', ''))

    const posts: SearchResult[] = []

    for (const slug of files) {
      const metadata = getPostMetadata(slug)
      if (metadata) {
        posts.push(metadata)
      }
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Failed to read blog directory:', error)
    return []
  }
}

export async function GET() {
  try {
    const posts = await getBlogPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Failed to generate search index' }, { status: 500 })
  }
}