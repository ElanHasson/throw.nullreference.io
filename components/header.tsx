'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'
import { SearchButton } from './search-button'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isMobileMenuOpen && !target.closest('[data-mobile-menu]')) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileMenuOpen])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const navigation = [
    { name: 'Blog', href: '/blog' },
    { name: 'Series', href: '/series' },
    { name: 'Topics', href: '/topics' },
    { name: 'Archive', href: '/archive' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
      <div className="container mx-auto max-w-7xl flex h-16 items-center px-4 lg:px-8">
        {/* Skip to main content - Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-rose-600 focus:px-4 focus:py-2 focus:text-white focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>

        <div className="mr-4 flex flex-1">
          <Link href="/" className="group mr-8 flex items-center space-x-2">
            <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              Throwin&apos; Exceptions
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 text-sm font-medium md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`link-underline transition-colors hover:text-rose-600 dark:hover:text-rose-400 ${
                  pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <SearchButton />
          
          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            data-mobile-menu
            className="md:hidden rounded-lg p-2 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            <svg
              className={`h-6 w-6 text-gray-600 dark:text-gray-300 transition-transform ${
                isMobileMenuOpen ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div 
          data-mobile-menu
          className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/95"
        >
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-gray-100 hover:text-rose-600 dark:hover:bg-gray-800 dark:hover:text-rose-400 ${
                    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}