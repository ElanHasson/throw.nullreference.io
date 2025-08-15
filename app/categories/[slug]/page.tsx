import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getAllCategories } from '@/lib/posts-utils'
import Breadcrumb from '@/components/breadcrumb'
import { TagPill } from '@/components/ui/tag-pill'
import { FeaturedBadge } from '@/components/ui/featured-badge'
import { BrowseTopicsButton } from '@/components/ui/browse-topics-button'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((category) => ({
    slug: category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
  }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const categories = await getAllCategories()
  const categoryName = getCategoryNameFromSlug(categories, slug)

  if (!categoryName) {
    return {
      title: "Category Not Found | Throwin' Exceptions",
    }
  }

  return {
    title: `${categoryName} | Categories | Throwin' Exceptions`,
    description: `All posts in the ${categoryName} category`,
  }
}

function getCategoryNameFromSlug(categories: string[], slug: string) {
  for (const category of categories) {
    const categorySlug = category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    if (categorySlug === slug) {
      return category
    }
  }
  return null
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const categories = await getAllCategories()
  const categoryName = getCategoryNameFromSlug(categories, slug)

  if (!categoryName) {
    notFound()
  }

  const posts = await getAllPosts()
  const categoryPosts = posts.filter((post) => post.categories?.includes(categoryName))

  return (
    <div className="w-full">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:px-8">
      <Breadcrumb items={[{ label: 'Topics', href: '/topics' }, { label: categoryName }]} />

      <h1 className="mb-4 text-4xl font-bold">{categoryName}</h1>
      <p className="mb-12 text-gray-600 dark:text-gray-400">
        {categoryPosts.length} post{categoryPosts.length === 1 ? '' : 's'} in this category
      </p>

      {categoryPosts.length > 0 ? (
        <div className="space-y-8">
          {categoryPosts.map((post, index) => (
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

                    {post.featured && <FeaturedBadge />}

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
      ) : (
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
            No posts in this category yet
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Check back soon for new posts, or explore other categories.
          </p>
          <BrowseTopicsButton />
        </div>
      )}

      <div className="mt-16 text-center">
        <BrowseTopicsButton />
      </div>
      </div>
    </div>
  )
}