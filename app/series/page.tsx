import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

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
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-12 text-4xl font-bold">Series</h1>

      {seriesArray.length > 0 ? (
        <div className="space-y-12">
          {seriesArray.map(([seriesName, seriesPosts]) => {
            const seriesSlug = seriesName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')

            return (
              <section
                key={seriesName}
                className="border-b border-gray-200 pb-8 dark:border-gray-800"
              >
                <h2 className="mb-4 text-2xl font-semibold">
                  <Link
                    href={`/series/${seriesSlug}`}
                    className="transition-colors hover:text-rose-600 dark:hover:text-rose-400"
                  >
                    {seriesName}
                  </Link>
                </h2>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  {seriesPosts.length} part{seriesPosts.length === 1 ? '' : 's'}
                </p>

                <div className="space-y-4">
                  {seriesPosts.map((post, index) => (
                    <article key={post.slug} className="flex items-start gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-medium text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-medium">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="transition-colors hover:text-rose-600 dark:hover:text-rose-400"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        {post.description && (
                          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                            {post.description}
                          </p>
                        )}
                        <time className="text-xs text-gray-500 dark:text-gray-500">
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
        <div className="py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No series available yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  )
}
