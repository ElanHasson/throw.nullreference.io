'use client'

import { useRef } from 'react'
import {
  AnimatedGradient,
  FloatingOrbs,
  InteractiveParticles,
  NeuralNetwork,
  WaveMotion,
  GeometricGrid,
  CyberGrid,
  FractalTrees,
  CodeRain,
  MatrixRain,
  Ecosystem
} from './backgrounds'

export type BackgroundType = 
  | 'animated-gradient'
  | 'particles'
  | 'geometric-grid'
  | 'floating-orbs'
  | 'matrix-rain'
  | 'neural-network'
  | 'wave-motion'
  | 'code-rain'
  | 'fractal-tree'
  | 'cyber-grid'
  | 'ecosystem'

interface HeroBackgroundProps {
  type?: BackgroundType
  intensity?: 'low' | 'medium' | 'high'
}

export function HeroBackground({ 
  type = 'animated-gradient', 
  intensity = 'medium' 
}: HeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // CSS-only backgrounds
  if (type === 'animated-gradient') {
    return <AnimatedGradient intensity={intensity} />
  }

  if (type === 'floating-orbs') {
    return <FloatingOrbs intensity={intensity} />
  }

  // Canvas-based backgrounds
  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full" 
        style={{ opacity: 0.4 }}
      />
      {type === 'particles' && <InteractiveParticles canvasRef={canvasRef} intensity={intensity} />}
      {type === 'neural-network' && <NeuralNetwork canvasRef={canvasRef} intensity={intensity} />}
      {type === 'wave-motion' && <WaveMotion canvasRef={canvasRef} intensity={intensity} />}
      {type === 'geometric-grid' && <GeometricGrid canvasRef={canvasRef} intensity={intensity} />}
      {type === 'cyber-grid' && <CyberGrid canvasRef={canvasRef} intensity={intensity} />}
      {type === 'fractal-tree' && <FractalTrees canvasRef={canvasRef} intensity={intensity} />}
      {type === 'code-rain' && <CodeRain canvasRef={canvasRef} intensity={intensity} />}
      {type === 'matrix-rain' && <MatrixRain canvasRef={canvasRef} intensity={intensity} />}
      {type === 'ecosystem' && <Ecosystem canvasRef={canvasRef} intensity={intensity} />}
    </>
  )
}