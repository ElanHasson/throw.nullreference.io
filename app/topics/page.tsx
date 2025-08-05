import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export const metadata = {
  title: "Topics | Throwin' Exceptions",
  description: 'Browse posts by topic and category',
}

export default async function TopicsPage() {
  const posts = await getAllPosts()

  // Get all unique tags and categories
  const allTags = new Set<string>()
  const allCategories = new Set<string>()

  posts.forEach((post) => {
    post.tags?.forEach((tag) => allTags.add(tag))
    post.categories?.forEach((category) => allCategories.add(category))
  })

  const tags = Array.from(allTags).sort()
  const categories = Array.from(allCategories).sort()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-12 text-4xl font-bold">Topics</h1>

      {categories.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const count = posts.filter((post) => post.categories?.includes(category)).length

              return (
                <Link
                  key={category}
                  href={`/categories/${category
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <span>{category}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({count})</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {tags.length > 0 && (
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const count = posts.filter((post) => post.tags?.includes(tag)).length

              return (
                <Link
                  key={tag}
                  href={`/tags/${tag
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '')}`}
                  className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-sm text-rose-800 transition-colors hover:bg-rose-200 dark:bg-rose-900 dark:text-rose-200 dark:hover:bg-rose-800"
                >
                  <span>{tag}</span>
                  <span className="text-xs opacity-75">({count})</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {tags.length === 0 && categories.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No topics available yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  )
}