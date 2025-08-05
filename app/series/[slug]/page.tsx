import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts } from '@/lib/posts'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  const seriesSet = new Set<string>()

  posts.forEach((post) => {
    if (post.series && post.series.trim() !== '') {
      const seriesSlug = post.series
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      seriesSet.add(seriesSlug)
    }
  })

  return Array.from(seriesSet).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const posts = await getAllPosts()
  const seriesName = getSeriesNameFromSlug(posts, slug)

  if (!seriesName) {
    return {
      title: "Series Not Found | Throwin' Exceptions",
    }
  }

  return {
    title: `${seriesName} | Series | Throwin' Exceptions`,
    description: `All posts in the ${seriesName} series`,
  }
}

function getSeriesNameFromSlug(posts: Awaited<ReturnType<typeof getAllPosts>>, slug: string) {
  for (const post of posts) {
    if (post.series && post.series.trim() !== '') {
      const postSlug = post.series
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      if (postSlug === slug) {
        return post.series
      }
    }
  }
  return null
}

export default async function SeriesSlugPage({ params }: Props) {
  const { slug } = await params
  const posts = await getAllPosts()
  const seriesName = getSeriesNameFromSlug(posts, slug)

  if (!seriesName) {
    notFound()
  }

  const seriesPosts = posts
    .filter((post) => post.series === seriesName)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <nav className="mb-8">
        <Link
          href="/series"
          className="text-rose-600 transition-colors hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
        >
          ← Back to Series
        </Link>
      </nav>

      <h1 className="mb-4 text-4xl font-bold">{seriesName}</h1>
      <p className="mb-12 text-gray-600 dark:text-gray-400">
        {seriesPosts.length} part{seriesPosts.length === 1 ? '' : 's'} in this series
      </p>

      <div className="space-y-8">
        {seriesPosts.map((post, index) => (
          <article
            key={post.slug}
            className="border-b border-gray-200 pb-8 last:border-b-0 dark:border-gray-800"
          >
            <div className="flex items-start gap-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-lg font-bold text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                {index + 1}
              </div>

              <div className="flex-1">
                <h2 className="mb-2 text-2xl font-semibold">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors hover:text-rose-600 dark:hover:text-rose-400"
                  >
                    {post.title}
                  </Link>
                </h2>

                {post.description && (
                  <p className="mb-4 text-gray-600 dark:text-gray-400">{post.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                  <time>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/series"
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-white transition-colors hover:bg-rose-700"
        >
          Browse All Series
        </Link>
      </div>
    </div>
  )
}