export interface Author {
  name: string
  bio?: string
  avatar?: string
}

export interface SEO {
  metaTitle?: string
  metaDescription?: string
}

export interface PostMetadata {
  title: string
  featuredImage?: string
  publishDate: string
  lastModified?: string
  author: Author
  excerpt?: string
  description?: string
  tags?: string[]
  categories?: string[]
  series?: string
  featured?: boolean
  draft?: boolean
  seo?: SEO
}

export interface PostMeta {
  title: string
  date: string
  description?: string
  thumbnail?: string
  featuredImage?: string
  tags?: string[]
  categories?: string[]
  draft?: boolean
  featured?: boolean
  series?: string
  slug: string
  readingTime?: { text: string; minutes: number; words: number }
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
