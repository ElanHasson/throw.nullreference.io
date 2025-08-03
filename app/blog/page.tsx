import Link from 'next/link'
import { format } from 'date-fns'
import { getPostsForBlog } from '@/lib/posts'
import type { PostMeta } from '@/lib/types'

export const metadata = {
  title: "Blog | Throwin' Exceptions",
  description: 'All blog posts about software development, technology, and life',
}

export default async function BlogPage() {
  const posts = await getPostsForBlog()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-12 text-4xl font-bold">Blog</h1>

        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex gap-6">
                  {post.thumbnail && (
                    <div className="flex-shrink-0">
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
                    <h2 className="mb-2 text-2xl font-semibold transition-colors group-hover:text-rose-600">
                      {post.title}
                    </h2>
                    <div className="text-muted-foreground mb-2 flex items-center gap-4 text-sm">
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
                            className="bg-secondary inline-block rounded-full px-3 py-1 text-xs"
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
