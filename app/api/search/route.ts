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

async function getPostMetadata(slug: string): Promise<SearchResult | null> {
  try {
    // Dynamically import the MDX file to get metadata safely
    const post = await import(`@/private/posts/${slug}.mdx`)
    const metadata = post.metadata as PostMetadata

    if (!metadata) {
      return null
    }

    // Read the file content for search indexing
    const filePath = path.join(process.cwd(), 'private/posts', `${slug}.mdx`)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    // Extract content after metadata
    const contentMatch = fileContent.match(/export const metadata = {[\s\S]*?};\s*([\s\S]*)/)
    const content = contentMatch ? contentMatch[1] : ''
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
      const metadata = await getPostMetadata(slug)
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