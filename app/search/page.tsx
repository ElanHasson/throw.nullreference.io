'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useSearch } from '@/hooks/use-search'

function SearchResultItem({
  title,
  description,
  date,
  url,
  featured,
}: {
  title: string
  description?: string
  date: string
  url: string
  featured: boolean
}) {
  return (
    <article className="border-b border-gray-200 pb-6 dark:border-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              <Link
                href={url}
                className="text-gray-900 transition-colors hover:text-rose-600 dark:text-gray-100 dark:hover:text-rose-400"
              >
                {title}
              </Link>
            </h2>
            {featured && (
              <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                Featured
              </span>
            )}
          </div>
          {description && <p className="mb-2 text-gray-600 dark:text-gray-400">{description}</p>}
          <time className="text-sm text-gray-500 dark:text-gray-500">
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </div>
    </article>
  )
}

function SearchContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const { search, loading, error } = useSearch()

  const results = query ? search(query) : []

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
    }
  }, [searchParams])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K or / to focus search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        const searchInput = document.getElementById('search-input')
        searchInput?.focus()
      }
      
      // Escape to clear search
      if (event.key === 'Escape' && query) {
        setQuery('')
        const searchInput = document.getElementById('search-input')
        searchInput?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [query])

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Search</h1>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <kbd className="rounded border border-gray-300 px-2 py-1 text-xs font-mono dark:border-gray-600">
              ⌘K
            </kbd>
            <span>to focus</span>
            <kbd className="rounded border border-gray-300 px-2 py-1 text-xs font-mono dark:border-gray-600">
              ESC
            </kbd>
            <span>to clear</span>
          </div>
        </div>

        <div className="relative">
          <input
            id="search-input"
            type="text"
            placeholder="Search posts by title, content, tags, or categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-12 pr-4 text-lg transition-colors focus:border-transparent focus:ring-2 focus:ring-rose-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-rose-400"
            autoFocus
            aria-label="Search posts"
            aria-describedby="search-description"
          />
          <svg
            className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute top-1/2 right-4 -translate-y-1/2 transform rounded-full p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <p id="search-description" className="sr-only">
          Use keyboard shortcuts: Command or Control + K to focus the search input, Escape to clear the search
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16" role="status" aria-live="polite">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-rose-600 dark:border-gray-700 dark:border-t-rose-400"></div>
            <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full border-4 border-rose-200 dark:border-rose-800"></div>
          </div>
          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">
            Loading search index...
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
            This may take a moment on first load
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20" role="alert">
          <div className="flex items-start">
            <svg className="mr-3 h-6 w-6 flex-shrink-0 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                Search Error
              </h3>
              <p className="mt-1 text-red-700 dark:text-red-300">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {query && (
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {results.length === 0
                  ? `No results found for "${query}"`
                  : `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
              </p>
            </div>
          )}

          <div className="space-y-8">
            {results.map((post) => (
              <SearchResultItem
                key={post.slug}
                title={post.title}
                description={post.description}
                date={post.date}
                url={post.url}
                featured={post.featured}
              />
            ))}
          </div>

          {query && results.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                No results found for &quot;{query}&quot;
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or browse our content by category.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                >
                  Browse All Posts
                </Link>
                <Link 
                  href="/topics" 
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Browse Topics
                </Link>
              </div>
            </div>
          )}

          {!query && (
            <div className="py-16 text-center">
              <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gradient-to-br from-rose-100 to-purple-100 dark:from-rose-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-rose-600 dark:text-rose-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Start Your Search
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Enter a search term to find posts by title, content, tags, or categories.
              </p>
              <div className="max-w-md mx-auto text-sm text-gray-500 dark:text-gray-400">
                <p className="mb-2">💡 <strong>Search Tips:</strong></p>
                <ul className="text-left space-y-1">
                  <li>• Try keywords like &quot;React&quot;, &quot;TypeScript&quot;, or &quot;Node.js&quot;</li>
                  <li>• Search for specific topics or technologies</li>
                  <li>• Use multiple words for more specific results</li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-rose-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading search...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}