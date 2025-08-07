import Link from 'next/link'

interface TagPillProps {
  tag: string
  size?: 'sm' | 'md'
  showHash?: boolean
  className?: string
}

export function TagPill({ tag, size = 'md', showHash = true, className = '' }: TagPillProps) {
  const tagSlug = encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))
  
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  }

  return (
    <Link
      href={`/tags/${tagSlug}`}
      className={`
        inline-flex items-center rounded-full font-medium
        bg-gray-100 text-gray-700 transition-colors duration-200
        hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
        dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 dark:focus:ring-offset-gray-900
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {showHash ? '#' : ''}{tag}
    </Link>
  )
}