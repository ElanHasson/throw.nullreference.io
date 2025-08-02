import { render, screen } from '@testing-library/react'
import { Header } from '@/components/header'

// Mock the ThemeToggle component
jest.mock('@/components/theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}))

describe('Header', () => {
  it('renders site title', () => {
    render(<Header />)
    expect(screen.getByText("Throwin' Exceptions")).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog')
    expect(screen.getByRole('link', { name: 'Learn' })).toHaveAttribute('href', '/learn')
    expect(screen.getByRole('link', { name: 'Topics' })).toHaveAttribute('href', '/topics')
    expect(screen.getByRole('link', { name: 'Archive' })).toHaveAttribute('href', '/archive')
  })

  it('renders theme toggle', () => {
    render(<Header />)
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })

  it('has sticky positioning', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('sticky', 'top-0')
  })
})