'use client'

import Link from 'next/link'
import { useKeyboardShortcut } from '@/hooks/use-os'

export function SearchButton() {
  const { searchShortcut } = useKeyboardShortcut()

  return (
    <Link
      href="/search"
      className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
      aria-label="Search posts"
    >
      <svg
        className="h-5 w-5 text-gray-600 dark:text-gray-300"
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
      <span className="hidden lg:flex items-center gap-1">
        <kbd className="rounded border border-gray-300 px-1.5 py-0.5 text-xs font-mono text-gray-500 dark:border-gray-600 dark:text-gray-400">
          {searchShortcut}
        </kbd>
      </span>
    </Link>
  )
}