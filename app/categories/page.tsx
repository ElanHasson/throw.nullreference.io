import Link from 'next/link'
import { getAllPosts } from '@/lib/posts-utils'

export const metadata = {
  title: "Categories | Throwin' Exceptions",
  description: 'Browse posts by category',
}

export default async function CategoriesPage() {
  const posts = await getAllPosts()

  // Get all unique categories
  const allCategories = new Set<string>()
  posts.forEach((post) => {
    post.categories?.forEach((category) => allCategories.add(category))
  })

  const categories = Array.from(allCategories).sort()

  // Get post count for each category
  const categoryCounts = categories.map((category) => ({
    name: category,
    count: posts.filter((post) => post.categories?.includes(category)).length,
    slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  }))

  // Sort by count (descending) then by name
  const sortedCategories = categoryCounts.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count
    }
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-12 text-4xl font-bold">Categories</h1>

      {sortedCategories.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCategories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${category.slug}`}
              className="group block rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700 dark:hover:bg-blue-950"
            >
              <h2 className="mb-2 text-lg font-semibold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {category.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {category.count} post{category.count === 1 ? '' : 's'}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No categories available yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  )
}