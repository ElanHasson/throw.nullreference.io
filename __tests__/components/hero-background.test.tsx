import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { HeroBackground } from '@/components/hero-background'

// Mock the background components
jest.mock('@/components/backgrounds', () => ({
  AnimatedGradient: ({ intensity }: { intensity?: string }) => (
    <div data-testid="animated-gradient" data-intensity={intensity}>AnimatedGradient</div>
  ),
  FloatingOrbs: ({ intensity }: { intensity?: string }) => (
    <div data-testid="floating-orbs" data-intensity={intensity}>FloatingOrbs</div>
  ),
  InteractiveParticles: ({ canvasRef, intensity }: any) => (
    <div data-testid="interactive-particles" data-intensity={intensity}>InteractiveParticles</div>
  ),
  NeuralNetwork: ({ canvasRef, intensity }: any) => (
    <div data-testid="neural-network" data-intensity={intensity}>NeuralNetwork</div>
  ),
  WaveMotion: ({ canvasRef, intensity }: any) => (
    <div data-testid="wave-motion" data-intensity={intensity}>WaveMotion</div>
  ),
  GeometricGrid: ({ canvasRef, intensity }: any) => (
    <div data-testid="geometric-grid" data-intensity={intensity}>GeometricGrid</div>
  ),
  CyberGrid: ({ canvasRef, intensity }: any) => (
    <div data-testid="cyber-grid" data-intensity={intensity}>CyberGrid</div>
  ),
  FractalTrees: ({ canvasRef, intensity }: any) => (
    <div data-testid="fractal-trees" data-intensity={intensity}>FractalTrees</div>
  ),
  CodeRain: ({ canvasRef, intensity }: any) => (
    <div data-testid="code-rain" data-intensity={intensity}>CodeRain</div>
  ),
  MatrixRain: ({ canvasRef, intensity }: any) => (
    <div data-testid="matrix-rain" data-intensity={intensity}>MatrixRain</div>
  ),
}))

describe('HeroBackground', () => {
  it('renders AnimatedGradient by default', () => {
    const { getByTestId } = render(<HeroBackground />)
    expect(getByTestId('animated-gradient')).toBeInTheDocument()
  })

  it('renders AnimatedGradient with specified type', () => {
    const { getByTestId } = render(<HeroBackground type="animated-gradient" />)
    expect(getByTestId('animated-gradient')).toBeInTheDocument()
  })

  it('renders FloatingOrbs with specified type', () => {
    const { getByTestId } = render(<HeroBackground type="floating-orbs" />)
    expect(getByTestId('floating-orbs')).toBeInTheDocument()
  })

  describe('Canvas-based backgrounds', () => {
    const canvasBackgrounds: Array<{ type: any, testId: string }> = [
      { type: 'particles', testId: 'interactive-particles' },
      { type: 'neural-network', testId: 'neural-network' },
      { type: 'wave-motion', testId: 'wave-motion' },
      { type: 'geometric-grid', testId: 'geometric-grid' },
      { type: 'cyber-grid', testId: 'cyber-grid' },
      { type: 'fractal-tree', testId: 'fractal-trees' },
      { type: 'code-rain', testId: 'code-rain' },
      { type: 'matrix-rain', testId: 'matrix-rain' },
    ]

    canvasBackgrounds.forEach(({ type, testId }) => {
      it(`renders ${type} with canvas`, () => {
        const { getByTestId, container } = render(<HeroBackground type={type} />)
        
        // Check canvas is rendered
        const canvas = container.querySelector('canvas')
        expect(canvas).toBeInTheDocument()
        expect(canvas).toHaveClass('absolute', 'inset-0', 'w-full', 'h-full')
        expect(canvas).toHaveStyle({ opacity: '0.4' })
        
        // Check specific background component is rendered
        expect(getByTestId(testId)).toBeInTheDocument()
      })
    })
  })

  describe('Intensity prop', () => {
    it('passes intensity prop to CSS backgrounds', () => {
      const { getByTestId, rerender } = render(<HeroBackground type="animated-gradient" intensity="low" />)
      expect(getByTestId('animated-gradient')).toHaveAttribute('data-intensity', 'low')
      
      rerender(<HeroBackground type="animated-gradient" intensity="high" />)
      expect(getByTestId('animated-gradient')).toHaveAttribute('data-intensity', 'high')
    })

    it('passes intensity prop to canvas backgrounds', () => {
      const { getByTestId } = render(<HeroBackground type="particles" intensity="high" />)
      expect(getByTestId('interactive-particles')).toHaveAttribute('data-intensity', 'high')
    })

    it('defaults to medium intensity', () => {
      const { getByTestId } = render(<HeroBackground type="animated-gradient" />)
      expect(getByTestId('animated-gradient')).toHaveAttribute('data-intensity', 'medium')
    })
  })

  describe('Background type validation', () => {
    const validTypes: Array<any> = [
      'animated-gradient',
      'particles',
      'geometric-grid',
      'floating-orbs',
      'matrix-rain',
      'neural-network',
      'wave-motion',
      'code-rain',
      'fractal-tree',
      'cyber-grid',
    ]

    validTypes.forEach(type => {
      it(`accepts valid type: ${type}`, () => {
        expect(() => render(<HeroBackground type={type} />)).not.toThrow()
      })
    })
  })
})