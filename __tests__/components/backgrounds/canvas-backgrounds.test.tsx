import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { InteractiveParticles } from '@/components/backgrounds/interactive-particles'
import { NeuralNetwork } from '@/components/backgrounds/neural-network'
import { WaveMotion } from '@/components/backgrounds/wave-motion'
import { GeometricGrid } from '@/components/backgrounds/geometric-grid'
import { CyberGrid } from '@/components/backgrounds/cyber-grid'
import { FractalTrees } from '@/components/backgrounds/fractal-trees'
import { CodeRain } from '@/components/backgrounds/code-rain'
import { MatrixRain } from '@/components/backgrounds/matrix-rain'

// Mock canvas context
const mockContext = {
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  arc: jest.fn(),
  rect: jest.fn(),
  stroke: jest.fn(),
  fill: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  translate: jest.fn(),
  rotate: jest.fn(),
  fillText: jest.fn(),
  font: '',
}

// Mock canvas element
const createMockCanvas = () => {
  const canvas = document.createElement('canvas')
  jest.spyOn(canvas, 'getContext').mockReturnValue(mockContext as any)
  return canvas
}

// Mock requestAnimationFrame to run only once
let rafCallback: FrameRequestCallback | null = null
global.requestAnimationFrame = jest.fn((cb) => {
  rafCallback = cb
  return 0
}) as any

describe('Canvas-Based Backgrounds', () => {
  let canvasRef: React.RefObject<HTMLCanvasElement>

  beforeEach(() => {
    const canvas = createMockCanvas()
    canvasRef = { current: canvas }
    jest.clearAllMocks()
  })

  describe('InteractiveParticles', () => {
    it('renders without crashing', () => {
      const { unmount } = render(<InteractiveParticles canvasRef={canvasRef} />)
      expect(mockContext.fillRect).toHaveBeenCalled()
      unmount()
    })

    it('initializes canvas dimensions', () => {
      render(<InteractiveParticles canvasRef={canvasRef} />)
      expect(canvasRef.current?.width).toBe(window.innerWidth)
      expect(canvasRef.current?.height).toBe(window.innerHeight)
    })

    it('respects intensity prop for particle count', () => {
      const { rerender } = render(<InteractiveParticles canvasRef={canvasRef} intensity="low" />)
      expect(mockContext.arc).toHaveBeenCalled()
      
      jest.clearAllMocks()
      rerender(<InteractiveParticles canvasRef={canvasRef} intensity="high" />)
      expect(mockContext.arc).toHaveBeenCalled()
    })

    it('cleans up event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
      const { unmount } = render(<InteractiveParticles canvasRef={canvasRef} />)
      unmount()
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    })
  })

  describe('NeuralNetwork', () => {
    it('renders without crashing', () => {
      const { unmount } = render(<NeuralNetwork canvasRef={canvasRef} />)
      expect(mockContext.fillRect).toHaveBeenCalled()
      unmount()
    })

    it('draws nodes and connections', () => {
      render(<NeuralNetwork canvasRef={canvasRef} />)
      expect(mockContext.arc).toHaveBeenCalled() // Nodes
      expect(mockContext.stroke).toHaveBeenCalled() // Connections
    })

    it('respects intensity levels', () => {
      render(<NeuralNetwork canvasRef={canvasRef} intensity="low" />)
      expect(mockContext.arc).toHaveBeenCalled()
    })
  })

  describe('WaveMotion', () => {
    it('renders without crashing', () => {
      const { unmount } = render(<WaveMotion canvasRef={canvasRef} />)
      expect(mockContext.fillRect).toHaveBeenCalled()
      unmount()
    })

    it('draws wave patterns', () => {
      render(<WaveMotion canvasRef={canvasRef} />)
      expect(mockContext.beginPath).toHaveBeenCalled()
      expect(mockContext.stroke).toHaveBeenCalled()
    })
  })

  describe('GeometricGrid', () => {
    it('renders without crashing', () => {
      const { unmount } = render(<GeometricGrid canvasRef={canvasRef} />)
      expect(mockContext.fillRect).toHaveBeenCalled()
      unmount()
    })

    it('applies rotation transformation', () => {
      render(<GeometricGrid canvasRef={canvasRef} />)
      expect(mockContext.save).toHaveBeenCalled()
      expect(mockContext.translate).toHaveBeenCalled()
      expect(mockContext.rotate).toHaveBeenCalled()
      expect(mockContext.restore).toHaveBeenCalled()
    })
  })

  describe('CyberGrid', () => {
    it('renders without crashing', () => {
      const { unmount } = render(<CyberGrid canvasRef={canvasRef} />)
      expect(mockContext.fillRect).toHaveBeenCalled()
      unmount()
    })

    it('draws grid lines and nodes', () => {
      render(<CyberGrid canvasRef={canvasRef} />)
      expect(mockContext.stroke).toHaveBeenCalled() // Grid lines
      expect(mockContext.arc).toHaveBeenCalled() // Pulsing nodes
    })
  })

  describe('FractalTrees', () => {
    it('renders without crashing', () => {
      const { unmount } = render(<FractalTrees canvasRef={canvasRef} />)
      expect(mockContext.fillRect).toHaveBeenCalled()
      unmount()
    })

    it('draws tree branches', () => {
      render(<FractalTrees canvasRef={canvasRef} />)
      expect(mockContext.beginPath).toHaveBeenCalled()
      expect(mockContext.moveTo).toHaveBeenCalled()
      expect(mockContext.lineTo).toHaveBeenCalled()
      expect(mockContext.stroke).toHaveBeenCalled()
    })
  })

  describe('CodeRain', () => {
    it('renders without crashing', () => {
      const { unmount } = render(<CodeRain canvasRef={canvasRef} />)
      expect(mockContext.fillRect).toHaveBeenCalled()
      unmount()
    })

    it('draws code characters', () => {
      render(<CodeRain canvasRef={canvasRef} />)
      expect(mockContext.fillText).toHaveBeenCalled()
    })

    it('sets monospace font', () => {
      render(<CodeRain canvasRef={canvasRef} />)
      expect(mockContext.font).toContain('monospace')
    })
  })

  describe('MatrixRain', () => {
    it('renders without crashing', () => {
      const { unmount } = render(<MatrixRain canvasRef={canvasRef} />)
      expect(mockContext.fillRect).toHaveBeenCalled()
      unmount()
    })

    it('draws matrix characters', () => {
      render(<MatrixRain canvasRef={canvasRef} />)
      expect(mockContext.fillText).toHaveBeenCalled()
    })

    it('uses green color for text', () => {
      render(<MatrixRain canvasRef={canvasRef} />)
      expect(mockContext.fillStyle).toBe('#0F0')
    })

    it('respects intensity for font size', () => {
      render(<MatrixRain canvasRef={canvasRef} intensity="low" />)
      expect(mockContext.font).toContain('20px')
      
      const newCanvas = createMockCanvas()
      const newCanvasRef = { current: newCanvas }
      render(<MatrixRain canvasRef={newCanvasRef} intensity="high" />)
      const newContext = newCanvas.getContext('2d') as any
      expect(newContext.font).toContain('12px')
    })
  })
})