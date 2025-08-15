interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function Loading({ size = 'md', text, className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`} role="status" aria-live="polite">
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-rose-600 dark:border-gray-700 dark:border-t-rose-400`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} animate-pulse rounded-full border-4 border-rose-200 dark:border-rose-800`}></div>
      </div>
      {text && (
        <p className={`mt-3 font-medium text-gray-600 dark:text-gray-400 ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  )
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
    </div>
  )
}

export function PostCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
      <div className="mb-4 h-4 w-24 bg-gray-200 rounded dark:bg-gray-700"></div>
      <div className="mb-3 h-8 bg-gray-200 rounded dark:bg-gray-700"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
        <div className="h-4 w-4/5 bg-gray-200 rounded dark:bg-gray-700"></div>
      </div>
    </div>
  )
}