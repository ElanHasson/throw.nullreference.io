import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/posts'
import { format } from 'date-fns'

export const metadata = {
  title: "Blog | Throwin' Exceptions",
  description: 'All blog posts about technology, software development, and random thoughts',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Blog</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {posts.length} post{posts.length === 1 ? '' : 's'} about technology, software development, and random thoughts
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-12">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group border-b border-gray-200 pb-12 last:border-b-0 dark:border-gray-800"
            >
              <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                <time>
                  {format(new Date(post.date), 'MMMM d, yyyy')}
                </time>
                
                {post.series && (
                  <Link
                    href={`/series/${encodeURIComponent(post.series.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                  >
                    Series: {post.series}
                  </Link>
                )}

                {post.featured && (
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                    Featured
                  </span>
                )}
              </div>

              {post.featuredImage && (
                <div className="mb-6 aspect-video relative overflow-hidden rounded-lg">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}

              <h2 className="mb-3 text-3xl font-bold">
                <Link
                  href={`/blog/${post.slug}`}
                  className="transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400"
                >
                  {post.title}
                </Link>
              </h2>

              {post.description && (
                <p className="mb-6 text-lg text-gray-600 dark:text-gray-400 line-clamp-3">
                  {post.description}
                </p>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}`}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No posts available yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  )
}
