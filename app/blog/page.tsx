import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { format } from 'date-fns'
import { FeaturedImage } from '@/components/featured-image'

export const metadata = {
  title: "Blog | Throwin' Exceptions",
  description: 'All blog posts about technology, software development, and random thoughts',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-16 max-w-4xl">
        <h1 className="mb-4 text-5xl font-bold tracking-tight">Blog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Thoughts on technology, software development, and everything in between.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid auto-rows-auto gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {posts.map((post, index) => {
            const hasImage = !!post.featuredImage
            const isFeatured = post.featured
            const hasLongDescription = post.description && post.description.length > 120
            const hasLongTitle = post.title.length > 40
            const hasManyTags = post.tags && post.tags.length > 5
            
            // Determine column span based on content
            let colSpan = "col-span-1" // Default single column
            
            // Special cases for specific posts
            if (index === 0 && hasImage) {
              // First post with image gets featured treatment
              colSpan = "col-span-1 md:col-span-2 lg:col-span-2"
            } else if (hasLongTitle && !hasImage) {
              // Long titles without images span wider
              colSpan = "col-span-1 md:col-span-2 lg:col-span-2"
            } else if (hasImage && hasLongDescription) {
              // Images with long descriptions
              colSpan = "col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-1"
            } else if (hasManyTags && hasLongDescription) {
              // Posts with many tags and long descriptions
              colSpan = "col-span-1 md:col-span-2"
            }
            
            return (
              <article
                key={post.slug}
                className={`group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 ${colSpan}`}
              >
                {hasImage && post.featuredImage && (
                  <Link href={`/blog/${post.slug}`} className="block">
                    <FeaturedImage
                      src={post.featuredImage}
                      alt={`Featured image for ${post.title}`}
                      priority={index < 3}
                      variant={isFeatured ? "large" : hasLongDescription ? "medium" : "small"}
                    />
                  </Link>
                )}
              
              <div className={`flex flex-1 flex-col p-6 ${
                !hasImage ? 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700' : ''
              }`}>
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

              <h2 className={`mb-3 font-bold ${
                isFeatured ? 'text-3xl' : 'text-2xl'
              }`}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400"
                >
                  {post.title}
                </Link>
              </h2>

              {post.description && (
                <p className="mb-6 flex-1 text-gray-600 dark:text-gray-400 line-clamp-3">
                  {post.description}
                </p>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="mt-auto flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}`}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
              </div>
            </article>
            )
          })}
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