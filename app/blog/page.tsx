import Link from 'next/link'
import { format } from 'date-fns'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const metadata = {
  title: 'Blog | Throwin\' Exceptions',
  description: 'All blog posts about software development, technology, and life',
}

interface PostMeta {
  title: string
  date: string
  description?: string
  thumbnail?: string
  tags?: string[]
  categories?: string[]
  draft?: boolean
  slug: string
}

async function getPosts(): Promise<PostMeta[]> {
  const postsDirectory = path.join(process.cwd(), 'app/blog')
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true })
  
  const posts: PostMeta[] = []
  
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== '[slug]') {
      const mdxPath = path.join(postsDirectory, entry.name, 'page.mdx')
      if (fs.existsSync(mdxPath)) {
        const fileContents = fs.readFileSync(mdxPath, 'utf8')
        const { data } = matter(fileContents)
        
        if (!data.draft) {
          posts.push({
            ...data,
            slug: entry.name,
          } as PostMeta)
        }
      }
    }
  }
  
  // Sort posts by date
  return posts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-12">Blog</h1>
        
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex gap-6">
                  {post.thumbnail && (
                    <div className="flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        width={200}
                        height={150}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <time>{format(new Date(post.date), 'LLLL d, yyyy')}</time>
                    </div>
                    {post.description && (
                      <p className="text-muted-foreground">{post.description}</p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-3 py-1 text-xs bg-secondary rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}