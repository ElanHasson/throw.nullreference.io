import { render, screen } from '@testing-library/react'
import { Figure } from '@/components/mdx/figure'

describe('Figure', () => {
  it('renders image with alt text', () => {
    render(<Figure src="/test.jpg" alt="Test image" />)
    const img = screen.getByAltText('Test image')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test.jpg')
  })

  it('renders caption when provided', () => {
    render(<Figure src="/test.jpg" alt="Test image" caption="Test caption" />)
    expect(screen.getByText('Test caption')).toBeInTheDocument()
  })

  it('handles Hugo-style width parameter in src', () => {
    render(<Figure src="/test.jpg?width=300px" alt="Test image" />)
    const img = screen.getByAltText('Test image')
    expect(img).toHaveAttribute('src', '/test.jpg')
    expect(img).toHaveAttribute('width', '300')
  })

  it('uses provided width and height over URL params', () => {
    render(<Figure src="/test.jpg?width=300px" alt="Test image" width={500} height={400} />)
    const img = screen.getByAltText('Test image')
    expect(img).toHaveAttribute('width', '500')
    expect(img).toHaveAttribute('height', '400')
  })

  it('applies custom className', () => {
    const { container } = render(
      <Figure src="/test.jpg" alt="Test image" className="custom-class" />,
    )
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
