import { render, screen } from '@testing-library/react'
import { Alert } from '@/components/mdx/alert'

describe('Alert', () => {
  it('renders children content', () => {
    render(<Alert>Test alert content</Alert>)
    expect(screen.getByText('Test alert content')).toBeInTheDocument()
  })

  it('applies correct styles for info type', () => {
    const { container } = render(<Alert type="info">Info alert</Alert>)
    const alert = container.querySelector('.alert-info')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass('bg-blue-50')
  })

  it('applies correct styles for success type', () => {
    const { container } = render(<Alert type="success">Success alert</Alert>)
    const alert = container.querySelector('.alert-success')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass('bg-green-50')
  })

  it('applies correct styles for warning type', () => {
    const { container } = render(<Alert type="warning">Warning alert</Alert>)
    const alert = container.querySelector('.alert-warning')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass('bg-yellow-50')
  })

  it('applies correct styles for error type', () => {
    const { container } = render(<Alert type="error">Error alert</Alert>)
    const alert = container.querySelector('.alert-error')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass('bg-red-50')
  })

  it('renders with custom icon', () => {
    const { container } = render(
      <Alert type="info" icon="check-circle-fill">
        Alert with custom icon
      </Alert>,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('defaults to info type when no type provided', () => {
    const { container } = render(<Alert>Default alert</Alert>)
    const alert = container.querySelector('.alert-info')
    expect(alert).toBeInTheDocument()
  })
})
