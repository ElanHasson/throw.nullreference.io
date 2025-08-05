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
    <div className="container mx-auto max-w-4xl px-4 py-16">
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
              <section key={year} className="border-b border-gray-200 pb-12 last:border-b-0 dark:border-gray-800">
                <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {year}
                  <span className="ml-2 text-base font-normal text-gray-500 dark:text-gray-400">
                    ({yearPosts.length} post{yearPosts.length === 1 ? '' : 's'})
                  </span>
                </h2>
                
                <div className="space-y-8">
                  {yearPosts.map((post, index) => (
                    <article
                      key={post.slug}
                      className="group animate-fade-in border-b border-gray-200 pb-8 last:border-b-0 dark:border-gray-800"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                        <div className="flex-1">
                          <h3 className="mb-3 text-2xl font-semibold">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="transition-colors hover:text-rose-600 focus:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:hover:text-rose-400 dark:focus:text-rose-400"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          
                          {post.description && (
                            <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-3">
                              {post.description}
                            </p>
                          )}
                          
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                            <time className="text-sm font-medium text-rose-600 dark:text-rose-400">
                              {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </time>

                            {post.featured && (
                              <span className="inline-flex w-fit rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                                Featured
                              </span>
                            )}

                            {post.series && (
                              <Link
                                href={`/series/${encodeURIComponent(post.series.toLowerCase().replace(/\s+/g, '-'))}`}
                                className="inline-flex w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200 focus:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 dark:focus:bg-blue-800"
                              >
                                {post.series}
                              </Link>
                            )}
                            
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <Link
                                    key={tag}
                                    href={`/tags/${tag
                                      .toLowerCase()
                                      .replace(/[^a-z0-9]+/g, '-')
                                      .replace(/^-|-$/g, '')}`}
                                    className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                                  >
                                    {tag}
                                  </Link>
                                ))}
                                {post.tags.length > 3 && (
                                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-500">
                                    +{post.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="opacity-0 transition-opacity group-hover:opacity-100">
                          <svg
                            className="h-5 w-5 text-rose-600 dark:text-rose-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
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
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
            No posts available yet
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Check back soon for new posts, or explore our topics.
          </p>
          <Link
            href="/topics"
            className="inline-flex items-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            Browse All Topics
          </Link>
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          href="/topics"
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-white transition-colors hover:bg-rose-700"
        >
          Browse All Topics
        </Link>
      </div>
    </div>
  )
}