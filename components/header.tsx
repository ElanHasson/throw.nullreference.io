import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-4 flex flex-1">
          <Link href="/" className="group mr-8 flex items-center space-x-2">
            <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              Throwin&apos; Exceptions
            </span>
          </Link>
          <nav className="hidden items-center space-x-8 text-sm font-medium md:flex">
            <Link
              href="/blog"
              className="link-underline text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400"
            >
              Blog
            </Link>
            <Link
              href="/learn"
              className="link-underline text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400"
            >
              Learn
            </Link>
            <Link
              href="/topics"
              className="link-underline text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400"
            >
              Topics
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Search"
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
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
