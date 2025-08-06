import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getAllTags } from '@/lib/posts-utils'
import Breadcrumb from '@/components/breadcrumb'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map((tag) => ({
    slug: encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-')),
  }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const tags = await getAllTags()
  const tagName = getTagNameFromSlug(tags, slug)

  if (!tagName) {
    return {
      title: "Tag Not Found | Throwin' Exceptions",
    }
  }

  return {
    title: `${tagName} | Tags | Throwin' Exceptions`,
    description: `All posts tagged with ${tagName}`,
  }
}

function getTagNameFromSlug(tags: string[], slug: string) {
  for (const tag of tags) {
    const tagSlug = encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))
    if (tagSlug === decodeURIComponent(slug)) {
      return tag
    }
  }
  return null
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params
  const tags = await getAllTags()
  const tagName = getTagNameFromSlug(tags, slug)

  if (!tagName) {
    notFound()
  }

  const posts = await getAllPosts()
  const tagPosts = posts.filter((post) => post.tags?.includes(tagName))

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <Breadcrumb items={[{ label: 'Topics', href: '/topics' }, { label: tagName }]} />

      <h1 className="mb-4 text-4xl font-bold">#{tagName}</h1>
      <p className="mb-12 text-gray-600 dark:text-gray-400">
        {tagPosts.length} post{tagPosts.length === 1 ? '' : 's'} tagged with {tagName}
      </p>

      {tagPosts.length > 0 ? (
        <div className="space-y-8">
          {tagPosts.map((post, index) => (
            <article
              key={post.slug}
              className="group animate-fade-in border-b border-gray-200 pb-8 last:border-b-0 dark:border-gray-800"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                <div className="flex-1">
                  <h2 className="mb-3 text-2xl font-semibold">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition-colors hover:text-rose-600 focus:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:hover:text-rose-400 dark:focus:text-rose-400"
                    >
                      {post.title}
                    </Link>
                  </h2>

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

                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.categories.slice(0, 3).map((category) => (
                          <Link
                            key={category}
                            href={`/categories/${category
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/^-|-$/g, '')}`}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                          >
                            {category}
                          </Link>
                        ))}
                        {post.categories.length > 3 && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-500">
                            +{post.categories.length - 3} more
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
      ) : (
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
            No posts with this tag yet
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Check back soon for new posts, or explore other tags.
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