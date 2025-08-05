import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

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

async function getBlogPosts(): Promise<SearchResult[]> {
  const blogDir = path.join(process.cwd(), 'app', 'blog')
  
  try {
    const entries = await fs.readdir(blogDir, { withFileTypes: true })
    const posts: SearchResult[] = []
    
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('[')) {
        const mdxPath = path.join(blogDir, entry.name, 'page.mdx')
        
        try {
          const fileContent = await fs.readFile(mdxPath, 'utf8')
          const { data: frontmatter, content } = matter(fileContent)
          
          // Clean content by removing JSX components and markdown syntax
          const cleanContent = content
            .replace(/<[^>]*>/g, '') // Remove JSX tags
            .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
            .replace(/#{1,6}\s+/g, '') // Remove heading markers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1') // Remove italic
            .replace(/`([^`]+)`/g, '$1') // Remove inline code
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/\n\s*\n/g, '\n') // Remove extra newlines
            .trim()
          
          posts.push({
            title: frontmatter.title || entry.name,
            description: frontmatter.description || '',
            date: frontmatter.date ? new Date(frontmatter.date).toISOString() : '',
            slug: entry.name,
            url: `/blog/${entry.name}`,
            content: cleanContent,
            featured: frontmatter.featured || false,
            tags: frontmatter.tags || [],
            categories: frontmatter.categories || []
          })
        } catch (error) {
          console.warn(`Failed to read ${mdxPath}:`, error)
        }
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