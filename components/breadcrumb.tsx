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
    <nav className="mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <Link
            href="/"
            className="flex items-center transition-colors hover:text-gray-900 dark:hover:text-gray-200"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-gray-900 dark:hover:text-gray-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-900 dark:text-gray-100">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
