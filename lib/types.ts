/**
 * Shared type definitions for the blog application
 */

export interface PostMeta {
  title: string
  date: string
  description?: string
  thumbnail?: string
  tags?: string[]
  categories?: string[]
  draft?: boolean
  featured?: boolean
  series?: string
  slug: string
  // Computed fields from ContentLayer
  readingTime?: any
  wordCount?: number
}

export interface PostsByYear {
  [year: number]: PostMeta[]
}

export interface BlogPageProps {
  params?: { slug?: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export interface LayoutProps {
  children: React.ReactNode
  params?: { [key: string]: string }
}
