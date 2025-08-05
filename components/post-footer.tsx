import Link from 'next/link'
import { PostMeta } from '@/lib/types'

interface PostFooterProps {
  post: PostMeta
}

export default function PostFooter({ post }: PostFooterProps) {
  return (
    <div className="space-y-8">
      {post.tags && post.tags.length > 0 && (
        <footer className="border-t border-gray-200 pt-8 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Tags</h3>
          <div className="flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '')}`}
                className="inline-flex items-center rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </footer>
      )}

      {post.series && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                Part of a Series
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                This post is part of the{' '}
                <Link
                  href={`/series/${post.series
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '')}`}
                  className="font-medium underline hover:no-underline"
                >
                  {post.series}
                </Link>{' '}
                series.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
