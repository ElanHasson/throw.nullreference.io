import { getAllPosts as getAllPostsQuery } from '@/app/blog/_queries/get-all-posts'
import { PostMeta } from './types'

// Convert Post from queries to PostMeta for backward compatibility
function postToPostMeta(post: Awaited<ReturnType<typeof getAllPostsQuery>>[0]): PostMeta {
  return {
    slug: post.slug,
    title: post.title,
    date: post.publishDate,
    description: post.excerpt || post.description || '',
    tags: post.tags || [],
    categories: post.categories || [],
    featured: post.featured || false,
    series: post.series,
    featuredImage: post.featuredImage,
    thumbnail: post.featuredImage,
  }
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const posts = await getAllPostsQuery()
  return posts.map(postToPostMeta)
}

export async function getRecentPosts(limit: number = 5): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.slice(0, limit)
}

export async function getFeaturedPosts(limit: number = 3): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter(post => post.featured).slice(0, limit)
}

export async function getPostBySlug(slug: string): Promise<PostMeta | null> {
  const posts = await getAllPosts()
  return posts.find(post => post.slug === slug) || null
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter(post => post.tags?.includes(tag) ?? false)
}

export async function getPostsBySeries(series: string): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter(post => post.series === series)
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tagsSet = new Set<string>()
  posts.forEach(post => {
    post.tags?.forEach(tag => tagsSet.add(tag))
  })
  return Array.from(tagsSet).sort()
}

export async function getAllSeries(): Promise<string[]> {
  const posts = await getAllPosts()
  const seriesSet = new Set<string>()
  posts.forEach(post => {
    if (post.series) {
      seriesSet.add(post.series)
    }
  })
  return Array.from(seriesSet).sort()
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts()
  const categoriesSet = new Set<string>()
  posts.forEach(post => {
    post.categories?.forEach(category => categoriesSet.add(category))
  })
  return Array.from(categoriesSet).sort()
}

export function groupPostsByYear(posts: PostMeta[]): Record<number, PostMeta[]> {
  return posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(post)
    return acc
  }, {} as Record<number, PostMeta[]>)
}

export async function getAdjacentPosts(currentSlug: string) {
  const posts = await getAllPosts()
  const currentIndex = posts.findIndex(post => post.slug === currentSlug)
  
  if (currentIndex === -1) {
    return { previous: null, next: null }
  }
  
  return {
    previous: currentIndex > 0 ? posts[currentIndex - 1] : null,
    next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
  }
}

// groupPostsByYear is already exported above