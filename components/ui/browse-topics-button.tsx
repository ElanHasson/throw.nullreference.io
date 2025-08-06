import Link from 'next/link'

interface BrowseTopicsButtonProps {
  className?: string
}

export function BrowseTopicsButton({ className = '' }: BrowseTopicsButtonProps) {
  return (
    <Link
      href="/topics"
      className={`
        inline-flex items-center gap-2 rounded-lg font-semibold border-2 shadow-lg
        bg-white text-rose-700 border-rose-600
        px-6 py-3 text-sm
        transition-all duration-200
        hover:bg-rose-600 hover:text-white hover:border-rose-700 hover:shadow-xl hover:-translate-y-0.5
        focus:outline-none focus:ring-4 focus:ring-rose-500/50 focus:ring-offset-2
        active:scale-[0.98] active:shadow-md
        dark:bg-gray-800 dark:text-rose-400 dark:border-rose-500 dark:hover:bg-rose-600 dark:hover:text-white dark:hover:border-rose-600
        dark:focus:ring-offset-gray-900
        ${className}
      `}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" 
        />
      </svg>
      Browse All Topics
    </Link>
  )
}