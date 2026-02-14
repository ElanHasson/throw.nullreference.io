import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useTheme } from 'next-themes'
import { ThemeToggle } from '@/components/theme-toggle'

// Mock next-themes
jest.mock('next-themes')

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>
const mockSetTheme = jest.fn()

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      resolvedTheme: 'light',
      systemTheme: 'light',
      themes: ['light', 'dark'],
      forcedTheme: undefined
    })
  })

  it('renders nothing when not mounted (SSR)', () => {
    // We need to test this properly by mocking useState to simulate the initial unmounted state
    const originalUseState = React.useState
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, jest.fn()]) // mounted = false
    
    const { container } = render(<ThemeToggle />)
    expect(container.firstChild).toBeNull()
    
    // Restore useState
    jest.restoreAllMocks()
  })

  it('renders theme toggle button when mounted', async () => {
    render(<ThemeToggle />)
    
    // Wait for useEffect to set mounted state
    await new Promise(resolve => setTimeout(resolve, 0))
    
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Toggle theme')
  })

  it('displays sun icon in light mode', async () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      resolvedTheme: 'light',
      systemTheme: 'light',
      themes: ['light', 'dark'],
      forcedTheme: undefined
    })

    render(<ThemeToggle />)
    await new Promise(resolve => setTimeout(resolve, 0))
    
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button).toBeInTheDocument()
    
    // Sun icon should be visible (has scale-100 class and dark:scale-0 for dark mode)
    const sunIcon = button.querySelector('.lucide-sun')
    expect(sunIcon).toBeInTheDocument()
    expect(sunIcon).toHaveClass('scale-100') // Should be visible in light mode
    expect(sunIcon).toHaveClass('dark:scale-0') // Should be hidden in dark mode
  })

  it('switches from light to dark theme when clicked', async () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      resolvedTheme: 'light',
      systemTheme: 'light',
      themes: ['light', 'dark'],
      forcedTheme: undefined
    })

    render(<ThemeToggle />)
    await new Promise(resolve => setTimeout(resolve, 0))
    
    const button = screen.getByRole('button', { name: /toggle theme/i })
    fireEvent.click(button)
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
    expect(mockSetTheme).toHaveBeenCalledTimes(1)
  })

  it('switches from dark to light theme when clicked', async () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      resolvedTheme: 'dark',
      systemTheme: 'dark',
      themes: ['light', 'dark'],
      forcedTheme: undefined
    })

    render(<ThemeToggle />)
    await new Promise(resolve => setTimeout(resolve, 0))
    
    const button = screen.getByRole('button', { name: /toggle theme/i })
    fireEvent.click(button)
    
    expect(mockSetTheme).toHaveBeenCalledWith('light')
    expect(mockSetTheme).toHaveBeenCalledTimes(1)
  })

  it('has proper CSS classes for styling', async () => {
    render(<ThemeToggle />)
    await new Promise(resolve => setTimeout(resolve, 0))
    
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button).toHaveClass(
      'hover:bg-accent',
      'hover:text-accent-foreground',
      'inline-flex',
      'h-9',
      'w-9',
      'items-center',
      'justify-center',
      'rounded-md',
      'text-sm',
      'font-medium',
      'transition-colors'
    )
  })

  it('handles keyboard interaction', async () => {
    render(<ThemeToggle />)
    await new Promise(resolve => setTimeout(resolve, 0))
    
    const button = screen.getByRole('button', { name: /toggle theme/i })
    
    // Focus and press Enter
    button.focus()
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
    
    // Button should be focusable and interactive
    expect(document.activeElement).toBe(button)
  })

  it('maintains accessibility with proper ARIA label', async () => {
    render(<ThemeToggle />)
    await new Promise(resolve => setTimeout(resolve, 0))
    
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button).toHaveAttribute('aria-label', 'Toggle theme')
  })
})