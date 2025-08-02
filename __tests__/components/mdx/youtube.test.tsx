import { render, screen } from '@testing-library/react'
import { YouTube } from '@/components/mdx/youtube'

describe('YouTube', () => {
  it('renders iframe with correct src', () => {
    render(<YouTube id="abc123" />)
    const iframe = screen.getByTitle('YouTube video')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/abc123')
  })

  it('uses custom title when provided', () => {
    render(<YouTube id="abc123" title="Custom video title" />)
    const iframe = screen.getByTitle('Custom video title')
    expect(iframe).toBeInTheDocument()
  })

  it('has correct iframe attributes', () => {
    render(<YouTube id="abc123" />)
    const iframe = screen.getByTitle('YouTube video')
    expect(iframe).toHaveAttribute('allowFullScreen')
    expect(iframe).toHaveAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    )
  })

  it('maintains 16:9 aspect ratio', () => {
    const { container } = render(<YouTube id="abc123" />)
    const wrapper = container.querySelector('.relative')
    expect(wrapper).toBeInTheDocument()
    // Check the inline style directly on the wrapper
    expect(wrapper?.getAttribute('style')).toContain('padding-bottom: 56.25%')
  })
})