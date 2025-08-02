import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/footer'

describe('Footer', () => {
  it('renders copyright notice with current year', () => {
    const currentYear = new Date().getFullYear()
    render(<Footer />)
    expect(
      screen.getByText(`Copyright © 2020-${currentYear} Elan Hasson. All Rights Reserved.`)
    ).toBeInTheDocument()
  })

  it('renders footer links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute('href', '/search')
    expect(screen.getByRole('link', { name: 'Offline' })).toHaveAttribute('href', '/offline')
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/ElanHasson/throw.nullreference.io'
    )
  })

  it('opens GitHub link in new tab', () => {
    render(<Footer />)
    const githubLink = screen.getByRole('link', { name: 'GitHub' })
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})