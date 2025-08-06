import Link from 'next/link'
import { getAllPosts, groupPostsByYear } from '@/lib/posts-utils'
import { SeriesPill } from '@/components/ui/series-pill'
import { TagPill } from '@/components/ui/tag-pill'
import { FeaturedBadge } from '@/components/ui/featured-badge'
import { BrowseTopicsButton } from '@/components/ui/browse-topics-button'

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
    <div className="w-full">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-20 lg:px-8 lg:py-24">
      <div className="mb-20">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Archive</h1>
        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          {totalPosts} post{totalPosts === 1 ? '' : 's'} across {years.length} year{years.length === 1 ? '' : 's'}
        </p>
      </div>

      {years.length > 0 ? (
        <div className="space-y-16">
          {years.map((year) => {
            const yearPosts = postsByYear[year]
            return (
              <section key={year} className="border-b border-gray-200 pb-16 last:border-b-0 dark:border-gray-800">
                <h2 className="mb-12 text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {year}
                  <span className="ml-3 text-lg font-normal text-gray-500 dark:text-gray-400">
                    ({yearPosts.length} post{yearPosts.length === 1 ? '' : 's'})
                  </span>
                </h2>
                
                <div className="space-y-10">
                  {yearPosts.map((post, index) => (
                    <article
                      key={post.slug}
                      className="group animate-fade-in border-b border-gray-200 pb-10 last:border-b-0 dark:border-gray-800"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                        <div className="flex-1">
                          <h3 className="mb-4 text-2xl font-bold leading-tight">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="transition-colors hover:text-rose-600 focus:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:hover:text-rose-400 dark:focus:text-rose-400"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          
                          {post.description && (
                            <p className="mb-6 text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                              {post.description}
                            </p>
                          )}
                          
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                            <time className="text-sm font-medium text-rose-600 dark:text-rose-400">
                              {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </time>

                            {post.featured && <FeaturedBadge />}

                            {post.series && <SeriesPill series={post.series} />}
                            
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <TagPill key={tag} tag={tag} showHash={false} />
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
          <BrowseTopicsButton />
        </div>
      )}

      <div className="mt-20 text-center">
        <BrowseTopicsButton />
      </div>
      </div>
    </div>
  )
}