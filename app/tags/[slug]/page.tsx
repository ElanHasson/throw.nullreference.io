import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getAllTags } from '@/lib/posts'
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
          {tagPosts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-gray-200 pb-8 last:border-b-0 dark:border-gray-800"
            >
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

                {post.categories && post.categories.length > 0 && (
                  <div className="flex gap-2">
                    {post.categories.slice(0, 3).map((category) => (
                      <Link
                        key={category}
                        href={`/categories/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`}
                        className="rounded bg-gray-100 px-2 py-1 text-xs transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        {category}
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
          <p className="text-gray-600 dark:text-gray-400">No posts found with this tag.</p>
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