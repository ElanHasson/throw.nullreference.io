import Link from 'next/link'
import { getAllPosts } from '@/lib/posts-utils'

export const metadata = {
  title: "Series | Throwin' Exceptions",
  description: 'Browse posts organized by series',
}

export default async function SeriesPage() {
  const posts = await getAllPosts()

  // Group posts by series
  const seriesMap = new Map<string, typeof posts>()

  posts.forEach((post) => {
    if (post.series && post.series.trim() !== '') {
      const seriesName = post.series
      if (!seriesMap.has(seriesName)) {
        seriesMap.set(seriesName, [])
      }
      seriesMap.get(seriesName)!.push(post)
    }
  })

  // Sort posts within each series by date (oldest first for series)
  seriesMap.forEach((posts) => {
    posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  })

  const seriesArray = Array.from(seriesMap.entries()).sort()

  return (
    <div className="w-full">
      <div className="container mx-auto max-w-[2000px] px-4 sm:px-6 py-20 lg:px-8 lg:py-24 xl:px-12 2xl:px-16">
      <div className="mb-20">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Series</h1>
        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          Blog posts organized into focused series on specific topics and technologies.
        </p>
      </div>

      {seriesArray.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {seriesArray.map(([seriesName, seriesPosts]) => {
            const seriesSlug = seriesName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')

            return (
              <section
                key={seriesName}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
              >
                <h2 className="mb-6 text-2xl font-bold">
                  <Link
                    href={`/series/${seriesSlug}`}
                    className="transition-colors hover:text-rose-600 dark:hover:text-rose-400"
                  >
                    {seriesName}
                  </Link>
                </h2>
                <p className="mb-8 text-gray-600 dark:text-gray-400">
                  {seriesPosts.length} part{seriesPosts.length === 1 ? '' : 's'}
                </p>

                <div className="space-y-6">
                  {seriesPosts.map((post, index) => (
                    <article key={post.slug} className="flex items-start gap-5">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-3 text-lg font-bold leading-tight">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="transition-colors hover:text-rose-600 dark:hover:text-rose-400"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        {post.description && (
                          <p className="mb-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                            {post.description}
                          </p>
                        )}
                        <time className="text-xs font-medium text-gray-500 dark:text-gray-500">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No series available yet. Check back soon!
          </p>
        </div>
      )}
      </div>
    </div>
  )
}