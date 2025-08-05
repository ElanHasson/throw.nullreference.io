import Link from 'next/link'
import { getAllPosts, groupPostsByYear } from '@/lib/posts'

export const metadata = {
  title: "Archive | Throwin' Exceptions",
  description: 'Browse all posts organized by year',
}

export default async function ArchivePage() {
  const posts = await getAllPosts()
  const postsByYear = groupPostsByYear(posts)
  const years = Object.keys(postsByYear)
    .map(Number)
    .sort((a, b) => b - a) // Sort years in descending order

  const totalPosts = posts.length

  return (
    <div className="container mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold">Archive</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {totalPosts} post{totalPosts === 1 ? '' : 's'} across {years.length} year{years.length === 1 ? '' : 's'}
        </p>
      </div>

      {years.length > 0 ? (
        <div className="space-y-12">
          {years.map((year) => {
            const yearPosts = postsByYear[year]
            return (
              <section key={year} className="border-b border-gray-200 pb-8 dark:border-gray-800">
                <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {year}
                  <span className="ml-2 text-base font-normal text-gray-500 dark:text-gray-400">
                    ({yearPosts.length} post{yearPosts.length === 1 ? '' : 's'})
                  </span>
                </h2>
                
                <div className="space-y-4">
                  {yearPosts.map((post) => (
                    <article key={post.slug} className="group flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                      <time className="flex-shrink-0 text-sm font-mono text-gray-500 dark:text-gray-400 sm:w-24">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        
                        {post.description && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {post.description}
                          </p>
                        )}
                        
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          {post.series && (
                            <Link
                              href={`/series/${encodeURIComponent(post.series.toLowerCase().replace(/\s+/g, '-'))}`}
                              className="rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                            >
                              {post.series}
                            </Link>
                          )}
                          
                          {post.tags?.slice(0, 3).map((tag) => (
                            <Link
                              key={tag}
                              href={`/tags/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}`}
                              className="rounded-full bg-gray-100 px-2 py-1 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                              {tag}
                            </Link>
                          ))}
                          
                          {post.featured && (
                            <span className="rounded-full bg-rose-100 px-2 py-1 font-medium text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
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