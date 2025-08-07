import Link from 'next/link'

interface SeriesPillProps {
  series: string
  size?: 'sm' | 'md'
  className?: string
}

export function SeriesPill({ series, size = 'md', className = '' }: SeriesPillProps) {
  const seriesSlug = encodeURIComponent(series.toLowerCase().replace(/\s+/g, '-'))
  
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1 text-xs'
  }

  return (
    <Link
      href={`/series/${seriesSlug}`}
      className={`
        inline-flex items-center rounded-full font-medium
        bg-blue-100 text-blue-800 transition-colors duration-200
        hover:bg-blue-200 focus:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 dark:focus:bg-blue-800 dark:focus:ring-offset-gray-900
        ${sizeClasses[size]}
        ${className.includes('whitespace-normal') ? '' : 'whitespace-nowrap'}
        ${className}
      `}
    >
      {series}
    </Link>
  )
}