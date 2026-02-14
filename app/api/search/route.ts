import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { cleanContent } from '@/utils/content-cleaning'
import { getAllPosts } from '@/app/blog/_queries/get-all-posts'

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

export async function GET() {
  try {
    // Get all posts using the same query as the blog pages
    const posts = await getAllPosts()
    
    // Transform posts for search with cleaned content
    const searchResults: SearchResult[] = await Promise.all(
      posts.map(async (post) => {
        // Read the file content for search indexing
        const filePath = path.join(process.cwd(), 'private/blogs', post.slug, 'index.mdx')
        const fileContent = fs.readFileSync(filePath, 'utf8')
        
        // Extract content after metadata
        const contentMatch = fileContent.match(/export const metadata = {[\s\S]*?};\s*([\s\S]*)/)
        const content = contentMatch ? contentMatch[1] : ''
        const cleanedContent = cleanContent(content)
        
        return {
          title: post.title || '',
          description: post.excerpt || post.description || '',
          date: post.publishDate || new Date().toISOString(),
          slug: post.slug,
          url: `/blog/${post.slug}`,
          content: cleanedContent,
          featured: post.featured || false,
          tags: post.tags || [],
          categories: post.categories || [],
        }
      })
    )
    
    return NextResponse.json(searchResults)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Failed to generate search index' }, { status: 500 })
  }
}