import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PostMeta } from '@/lib/types'

interface PostNavigationProps {
  previousPost: PostMeta | null
  nextPost: PostMeta | null
}

export default function PostNavigation({ previousPost, nextPost }: PostNavigationProps) {
  if (!previousPost && !nextPost) {
    return null
  }

  return (
    <nav className="mt-16 border-t border-gray-200 pt-8 dark:border-gray-700">
      <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Continue Reading
      </h3>
      <div className="grid gap-6 md:grid-cols-2">
        {previousPost ? (
          <Link
            href={`/blog/${previousPost.slug}`}
            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
          >
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-gray-200 dark:bg-gray-700 dark:group-hover:bg-gray-600">
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Previous</div>
              <div className="mt-1 line-clamp-2 font-semibold text-gray-900 dark:text-gray-100">
                {previousPost.title}
              </div>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
          >
            <div className="flex-1 text-right">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Next</div>
              <div className="mt-1 line-clamp-2 font-semibold text-gray-900 dark:text-gray-100">
                {nextPost.title}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-gray-200 dark:bg-gray-700 dark:group-hover:bg-gray-600">
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  )
}
