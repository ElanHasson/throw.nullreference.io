import Link from 'next/link'
import { format } from 'date-fns'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const metadata = {
  title: 'Archive | Throwin\' Exceptions',
  description: 'All blog posts organized by date',
}

interface PostMeta {
  title: string
  date: string
  slug: string
  draft?: boolean
}

async function getAllPosts(): Promise<PostMeta[]> {
  const postsDirectory = path.join(process.cwd(), 'app/blog')
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true })
  
  const posts: PostMeta[] = []
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const mdxPath = path.join(postsDirectory, entry.name, 'page.mdx')
      if (fs.existsSync(mdxPath)) {
        const fileContents = fs.readFileSync(mdxPath, 'utf8')
        const { data } = matter(fileContents)
        
        if (!data.draft) {
          posts.push({
            title: data.title,
            date: data.date,
            slug: entry.name,
          })
        }
      }
    }
  }
  
  return posts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export default async function ArchivePage() {
  const posts = await getAllPosts()
  
  // Group posts by year
  const postsByYear = posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(post)
    return acc
  }, {} as Record<number, PostMeta[]>)
  
  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-12">Archive</h1>
        
        <div className="space-y-8">
          {years.map((year) => (
            <div key={year}>
              <h2 className="text-2xl font-semibold mb-4">{year}</h2>
              <ul className="space-y-3">
                {postsByYear[Number(year)].map((post) => (
                  <li key={post.slug}>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="flex items-baseline gap-4 hover:text-primary transition-colors"
                    >
                      <time className="text-sm text-muted-foreground min-w-[100px]">
                        {format(new Date(post.date), 'MMM dd')}
                      </time>
                      <span>{post.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}