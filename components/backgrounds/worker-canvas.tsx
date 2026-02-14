'use client'

import { useEffect, useRef } from 'react'

interface WorkerCanvasProps {
  type: string
  intensity?: 'low' | 'medium' | 'high'
}

export function WorkerCanvas({ type, intensity = 'medium' }: WorkerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const workerRef = useRef<Worker | null>(null)
  const offscreenCanvasRef = useRef<OffscreenCanvas | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Check if OffscreenCanvas is supported
    if (!('OffscreenCanvas' in window)) {
      console.warn('OffscreenCanvas not supported, falling back to main thread')
      // Could fall back to regular canvas here
      return
    }

    // Check if transferControlToOffscreen is supported
    if (!canvas.transferControlToOffscreen) {
      console.warn('transferControlToOffscreen not supported')
      return
    }

    try {
      // Transfer control to offscreen canvas
      const offscreen = canvas.transferControlToOffscreen()
      offscreenCanvasRef.current = offscreen

      // Create worker
      const worker = new Worker(
        new URL('../../workers/canvas-background.worker.ts', import.meta.url),
        { type: 'module' }
      )
      workerRef.current = worker

      // Initialize worker with canvas
      worker.postMessage(
        {
          type: 'init',
          data: {
            canvas: offscreen,
            backgroundType: type,
            intensity
          }
        },
        [offscreen as Transferable]
      )

      // Handle resize
      const handleResize = () => {
        worker.postMessage({
          type: 'resize',
          data: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        })
      }

      // Handle mouse move for interactive backgrounds
      const handleMouseMove = (e: MouseEvent) => {
        if (type === 'particles') {
          worker.postMessage({
            type: 'mouse',
            data: {
              x: e.clientX,
              y: e.clientY
            }
          })
        }
      }

      // Set initial size
      handleResize()

      // Add event listeners
      window.addEventListener('resize', handleResize)
      if (type === 'particles') {
        window.addEventListener('mousemove', handleMouseMove)
      }

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('mousemove', handleMouseMove)
        
        if (worker) {
          worker.postMessage({ type: 'stop' })
          worker.terminate()
        }
      }
    } catch (error) {
      console.error('Error initializing worker canvas:', error)
    }
  }, [type, intensity])

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.4 }}
    />
  )
}