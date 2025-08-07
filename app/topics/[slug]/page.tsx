import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts, getAllTags } from '@/lib/posts-utils'
import type { Metadata } from 'next/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const tags = await getAllTags()
  
  return tags.map((tag) => ({
    slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tags = await getAllTags()
  
  // Find the tag name from the slug
  const tagName = tags.find((tag) => {
    const tagSlug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    return tagSlug === slug
  })

  if (!tagName) {
    return {
      title: 'Topic Not Found',
    }
  }

  const posts = await getAllPosts()
  const tagPosts = posts.filter((post) => post.tags?.includes(tagName))

  return {
    title: `${tagName} | Throwin' Exceptions`,
    description: `${tagPosts.length} post${tagPosts.length === 1 ? '' : 's'} tagged with ${tagName}`,
  }
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params
  const tags = await getAllTags()
  const posts = await getAllPosts()

  // Find the tag name from the slug
  const tagName = tags.find((tag) => {
    const tagSlug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    return tagSlug === slug
  })

  if (!tagName) {
    notFound()
  }

  const tagPosts = posts
    .filter((post) => post.tags?.includes(tagName))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <Link
          href="/topics"
          className="mb-4 inline-flex items-center text-sm text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
        >
          ← Back to Topics
        </Link>
        <h1 className="text-4xl font-bold">{tagName}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {tagPosts.length} post{tagPosts.length === 1 ? '' : 's'} tagged with {tagName}
        </p>
      </div>

      {tagPosts.length > 0 ? (
        <div className="space-y-8">
          {tagPosts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-gray-200 pb-8 last:border-b-0 dark:border-gray-800"
            >
              <h2 className="mb-3 text-2xl font-semibold">
                <Link
                  href={`/blog/${post.slug}`}
                  className="transition-colors hover:text-rose-600 dark:hover:text-rose-400"
                >
                  {post.title}
                </Link>
              </h2>
              
              {post.description && (
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  {post.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                <time>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                
                {post.series && (
                  <Link
                    href={`/series/${post.series.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
                    className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                  >
                    Series: {post.series}
                  </Link>
                )}

                {post.tags && post.tags.length > 1 && (
                  <div className="flex gap-2">
                    {post.tags
                      .filter((tag) => tag !== tagName)
                      .slice(0, 3)
                      .map((tag) => (
                        <Link
                          key={tag}
                          href={`/topics/${tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
                          className="rounded-full bg-gray-100 px-2 py-1 text-xs transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          {tag}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No posts found for this topic.
          </p>
        </div>
      )}
    </div>
  )
}