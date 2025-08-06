import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb navigation">
      <ol className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <Link
            href="/"
            className="flex items-center rounded-lg p-2 transition-colors hover:text-gray-900 hover:bg-gray-100 focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:hover:text-gray-200 dark:hover:bg-gray-800 dark:focus:text-gray-200"
            aria-label="Go to home page"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center">
              <ChevronRight 
                className="mx-3 h-4 w-4 text-gray-400" 
                aria-hidden="true"
              />
              {item.href ? (
                <Link
                  href={item.href}
                  className="rounded-lg px-3 py-2 transition-colors hover:text-gray-900 hover:bg-gray-100 focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:hover:text-gray-200 dark:hover:bg-gray-800 dark:focus:text-gray-200"
                  aria-label={`Go to ${item.label}`}
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  className="font-medium text-gray-900 dark:text-gray-100 px-3 py-2 truncate max-w-xs"
                  aria-current={isLast ? "page" : undefined}
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}