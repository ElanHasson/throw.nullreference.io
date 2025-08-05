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
  featured 
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
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-semibold">
              <Link 
                href={url}
                className="text-gray-900 hover:text-rose-600 dark:text-gray-100 dark:hover:text-rose-400 transition-colors"
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
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {description}
            </p>
          )}
          <time className="text-sm text-gray-500 dark:text-gray-500">
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
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
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search</h1>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            autoFocus
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading search index...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <>
          {query && (
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {results.length === 0 
                  ? `No results found for "${query}"`
                  : `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`
                }
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
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search terms or browse all posts in the{' '}
                <Link href="/blog" className="text-rose-600 hover:text-rose-700 dark:text-rose-400">
                  blog section
                </Link>
                .
              </p>
            </div>
          )}
          
          {!query && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">
                Enter a search term to find posts by title, content, tags, or categories.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}