import Link from 'next/link'
import { getAllPosts } from '@/lib/posts-utils'

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
    <div className="w-full">
      <div className="container mx-auto max-w-[2000px] px-4 sm:px-6 py-20 lg:px-8 lg:py-24 xl:px-12 2xl:px-16">
      <div className="mb-20 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Topics</h1>
        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          Explore posts organized by categories and tags
        </p>
      </div>

      <div className="grid gap-16 lg:grid-cols-2 xl:gap-24">
        {categories.length > 0 && (
          <section className="animate-fade-in">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-4 dark:from-blue-900/20 dark:to-indigo-900/20">
                <svg className="h-7 w-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold">Categories</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {categories.length} categor{categories.length === 1 ? 'y' : 'ies'}
                </p>
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {categories.map((category, index) => {
                const count = posts.filter((post) => post.categories?.includes(category)).length

                return (
                  <Link
                    key={category}
                    href={`/categories/${category
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-|-$/g, '')}`}
                    className="group flex items-center justify-between rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:bg-gray-800"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                      {category}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {count}
                      </span>
                      <svg className="h-5 w-5 text-gray-400 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {tags.length > 0 && (
          <section className="animate-fade-in animation-delay-200">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 p-4 dark:from-rose-900/20 dark:to-pink-900/20">
                <svg className="h-7 w-7 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold">Tags</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {tags.length} tag{tags.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {tags.map((tag, index) => {
                const count = posts.filter((post) => post.tags?.includes(tag)).length

                return (
                  <Link
                    key={tag}
                    href={`/tags/${tag
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-|-$/g, '')}`}
                    className="animate-fade-in inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2.5 text-sm font-semibold text-rose-800 transition-all hover:bg-rose-200 hover:scale-105 focus:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:bg-rose-900/30 dark:text-rose-200 dark:hover:bg-rose-800/50"
                    style={{ animationDelay: `${(index * 25) + 200}ms` }}
                  >
                    <span>{tag}</span>
                    <span className="rounded-full bg-rose-200 px-2 py-1 text-xs font-bold text-rose-700 dark:bg-rose-800 dark:text-rose-200">
                      {count}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>

      {tags.length === 0 && categories.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
            No topics available yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Check back soon for organized content by categories and tags!
          </p>
        </div>
      )}
      </div>
    </div>
  )
}