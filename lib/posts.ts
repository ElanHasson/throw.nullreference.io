import { getAllPosts as getBlogPosts } from '@/app/blog/_queries/get-all-posts'
import { getPost } from '@/app/blog/[slug]/_queries/get-post'
import { PostMeta } from './types'
import { compareDesc } from 'date-fns'

export async function getAllPosts(includeDrafts = false): Promise<PostMeta[]> {
  const posts = await getBlogPosts(includeDrafts)
  
  return posts
    .map(post => ({
      slug: post.slug,
      title: post.title,
      date: post.publishDate,
      description: post.excerpt || post.description || '',
      featured: post.featured || false,
      draft: post.draft || false,
      featuredImage: post.featuredImage,
      categories: post.categories || [],
      tags: post.tags || [],
      series: post.series,
    }))
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
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
  try {
    const post = await getPost(slug)
    if (!post) return null
    
    return {
      slug: post.slug,
      title: post.title,
      date: post.publishDate,
      description: post.excerpt || post.description || '',
      featured: post.featured || false,
      draft: post.draft || false,
      featuredImage: post.featuredImage,
      categories: post.categories || [],
      tags: post.tags || [],
      series: post.series,
    }
  } catch {
    return null
  }
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