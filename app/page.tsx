import Link from 'next/link'
import { format } from 'date-fns'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface PostMeta {
  title: string
  date: string
  description?: string
  slug: string
  draft?: boolean
}

async function getRecentPosts(): Promise<PostMeta[]> {
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
            ...data,
            slug: entry.name,
          } as PostMeta)
        }
      }
    }
  }
  
  // Sort posts by date and get the 5 most recent
  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
}

export default async function HomePage() {
  const posts = await getRecentPosts()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome to Throwin&apos; Exceptions</h1>
        
        <p className="text-lg text-muted-foreground mb-12">
          A blog about software development, technology, and life. Join me as I go through my 
          daily journey of struggling with under-documented technology, random ideas, and life in general.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.slug} className="border-b pb-6 last:border-b-0">
                <Link href={`/blog/${post.slug}`} className="group">
                  <h3 className="text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <time className="text-sm text-muted-foreground">
                    {format(new Date(post.date), 'LLLL d, yyyy')}
                  </time>
                  {post.description && (
                    <p className="mt-2 text-muted-foreground">{post.description}</p>
                  )}
                </Link>
              </article>
            ))}
          </div>
          
          <div className="mt-8">
            <Link 
              href="/blog" 
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              View all posts →
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}