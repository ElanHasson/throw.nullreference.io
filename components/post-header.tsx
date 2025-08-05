import { format } from 'date-fns'
import { PostMeta } from '@/lib/types'

interface PostHeaderProps {
  post: PostMeta
}

export default function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="mb-16">
      <div className="space-y-6">
        <div className="max-w-4xl">
          <h1 className="text-4xl leading-tight font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-gray-100">
            {post.title}
          </h1>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-base text-gray-600 dark:text-gray-400">
            <time dateTime={post.date} className="font-medium">
              {format(new Date(post.date), 'LLLL d, yyyy')}
            </time>

            {post.readingTime && (
              <>
                <span className="text-gray-400">•</span>
                <span>{post.readingTime.text}</span>
              </>
            )}

            {post.wordCount && (
              <>
                <span className="text-gray-400">•</span>
                <span>{post.wordCount.toLocaleString()} words</span>
              </>
            )}
          </div>

          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
