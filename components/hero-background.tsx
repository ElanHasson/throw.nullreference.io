'use client'

import { useRef, useEffect, useState } from 'react'
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
  Ecosystem,
  HikingTrail
} from './backgrounds'
import { EcosystemWorker } from './backgrounds/ecosystem-worker'

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
  | 'hiking-trail'

interface HeroBackgroundProps {
  type?: BackgroundType
  intensity?: 'low' | 'medium' | 'high'
  interactive?: boolean
}

export function HeroBackground({ 
  type = 'animated-gradient', 
  intensity = 'medium'
}: HeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [key, setKey] = useState(0)
  const [mounted, setMounted] = useState(false)
  
  // Ensure client-side only rendering for canvas features
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Force re-render on resize to restart the scene
  useEffect(() => {
    if (!mounted) return
    
    const handleResize = () => {
      setKey(prev => prev + 1)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mounted])
  
  // Force re-render when type changes to ensure clean switch
  useEffect(() => {
    if (mounted) {
      setKey(prev => prev + 1)
    }
  }, [type, mounted])
  
  // Check if we can use worker for ecosystem (only on client)
  // Disabled for now due to static export limitations
  const useWorkerForEcosystem = false // mounted && 
    // type === 'ecosystem' && 
    // typeof window !== 'undefined' && 
    // 'OffscreenCanvas' in window

  // CSS-only backgrounds (can render on server)
  if (type === 'animated-gradient') {
    return <AnimatedGradient key={key} intensity={intensity} />
  }

  if (type === 'floating-orbs') {
    return <FloatingOrbs key={key} intensity={intensity} />
  }
  
  // Don't render canvas-based backgrounds until mounted (client-side only)
  if (!mounted) {
    return <div className="absolute inset-0 w-full h-full" />
  }
  
  // Use worker for ecosystem if supported
  if (useWorkerForEcosystem) {
    return <EcosystemWorker key={key} intensity={intensity} />
  }

  // Canvas-based backgrounds
  return (
    <div key={key}>
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
      {type === 'hiking-trail' && <HikingTrail />}
    </div>
  )
}