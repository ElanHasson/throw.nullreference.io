import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getAllCategories } from '@/lib/posts'
import Breadcrumb from '@/components/breadcrumb'

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
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <Breadcrumb items={[{ label: 'Topics', href: '/topics' }, { label: categoryName }]} />

      <h1 className="mb-4 text-4xl font-bold">{categoryName}</h1>
      <p className="mb-12 text-gray-600 dark:text-gray-400">
        {categoryPosts.length} post{categoryPosts.length === 1 ? '' : 's'} in this category
      </p>

      {categoryPosts.length > 0 ? (
        <div className="space-y-8">
          {categoryPosts.map((post) => (
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

                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${tag
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-|-$/g, '')}`}
                        className="rounded bg-gray-100 px-2 py-1 text-xs transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
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
          <p className="text-gray-600 dark:text-gray-400">No posts found in this category.</p>
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
