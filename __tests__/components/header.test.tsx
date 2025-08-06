import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { Header } from '@/components/header'

// Mock Next.js modules
const mockUsePathname = jest.fn()
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname()
}))
jest.mock('@/components/theme-toggle', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>
}))
jest.mock('@/components/search-button', () => ({
  SearchButton: () => <button data-testid="search-button">Search</button>
}))

describe('Header Component', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.style.overflow = ''
    jest.clearAllMocks()
  })

  it('renders the main branding', () => {
    render(<Header />)
    
    const brandingLink = screen.getByRole('link', { name: /throwin' exceptions/i })
    expect(brandingLink).toBeInTheDocument()
    expect(brandingLink).toHaveAttribute('href', '/')
  })

  it('renders all navigation links', () => {
    render(<Header />)
    
    const navigation = [
      { name: 'Blog', href: '/blog' },
      { name: 'Series', href: '/series' },
      { name: 'Topics', href: '/topics' },
      { name: 'Archive', href: '/archive' },
    ]

    navigation.forEach(item => {
      const link = screen.getByRole('link', { name: item.name })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', item.href)
    })
  })

  it('renders theme toggle and search button', () => {
    render(<Header />)
    
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('search-button')).toBeInTheDocument()
  })

  it('renders skip to main content link for accessibility', () => {
    render(<Header />)
    
    const skipLink = screen.getByRole('link', { name: /skip to main content/i })
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  describe('Mobile Menu', () => {
    it('toggles mobile menu when hamburger button is clicked', async () => {
      render(<Header />)
      
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i })
      expect(menuButton).toBeInTheDocument()
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      
      // Menu should not be visible initially
      expect(screen.queryByText('Blog')).toBeVisible() // Desktop nav
      
      // Click to open mobile menu
      fireEvent.click(menuButton)
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')
      
      // Click to close mobile menu
      fireEvent.click(menuButton)
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('prevents body scroll when mobile menu is open', async () => {
      render(<Header />)
      
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i })
      
      // Open mobile menu
      fireEvent.click(menuButton)
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden')
      })
      
      // Close mobile menu
      fireEvent.click(menuButton)
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('unset')
      })
    })

    it('closes mobile menu when clicking outside', async () => {
      render(<Header />)
      
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i })
      
      // Open mobile menu
      fireEvent.click(menuButton)
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')
      
      // Click outside (on document body)
      fireEvent.mouseDown(document.body)
      
      await waitFor(() => {
        expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      })
    })

    it('closes mobile menu when route changes', () => {
      const { rerender } = render(<Header />)
      
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i })
      
      // Open mobile menu
      fireEvent.click(menuButton)
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')
      
      // Simulate route change
      mockUsePathname.mockReturnValue('/blog')
      rerender(<Header />)
      
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Active Navigation State', () => {
    it('highlights current page in navigation', () => {
      mockUsePathname.mockReturnValue('/blog')
      render(<Header />)
      
      const blogLink = screen.getByRole('link', { name: 'Blog' })
      expect(blogLink).toHaveClass('text-rose-600', 'dark:text-rose-400')
    })

    it('highlights parent section for nested routes', () => {
      mockUsePathname.mockReturnValue('/blog/some-post')
      render(<Header />)
      
      const blogLink = screen.getByRole('link', { name: 'Blog' })
      expect(blogLink).toHaveClass('text-rose-600', 'dark:text-rose-400')
    })

    it('does not highlight home link for other routes', () => {
      mockUsePathname.mockReturnValue('/blog')
      render(<Header />)
      
      const homeLink = screen.getByRole('link', { name: /throwin' exceptions/i })
      // Home link doesn't have active state styling in the navigation
      expect(homeLink).not.toHaveClass('text-rose-600')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes on mobile menu button', () => {
      render(<Header />)
      
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i })
      expect(menuButton).toHaveAttribute('aria-expanded')
      expect(menuButton).toHaveAttribute('aria-label', 'Toggle mobile menu')
    })

    it('has proper focus management', () => {
      render(<Header />)
      
      const skipLink = screen.getByRole('link', { name: /skip to main content/i })
      expect(skipLink).toHaveClass('sr-only', 'focus:not-sr-only')
      
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i })
      expect(menuButton).toHaveClass('focus:outline-none', 'focus:ring-2')
    })
  })
})