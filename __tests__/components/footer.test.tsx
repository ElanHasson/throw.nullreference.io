import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/footer'

describe('Footer', () => {
  it('renders copyright notice with current year', () => {
    const currentYear = new Date().getFullYear()
    render(<Footer />)
    expect(
      screen.getByText(`© 2014-${currentYear} Elan Hasson. All Rights Reserved.`),
    ).toBeInTheDocument()
  })

  it('renders footer links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute('href', '/search')
    expect(screen.getByRole('link', { name: 'View Source' })).toHaveAttribute(
      'href',
      'https://github.com/ElanHasson/throw.nullreference.io',
    )
  })

  it('opens GitHub link in new tab', () => {
    render(<Footer />)
    const githubLink = screen.getByRole('link', { name: 'View Source' })
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
