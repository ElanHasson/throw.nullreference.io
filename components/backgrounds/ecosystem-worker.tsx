'use client'

import { useEffect, useRef } from 'react'

interface EcosystemWorkerProps {
  intensity?: 'low' | 'medium' | 'high'
}

export function EcosystemWorker({ intensity = 'medium' }: EcosystemWorkerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const workerRef = useRef<Worker | null>(null)
  const transferredRef = useRef<boolean>(false)

  useEffect(() => {
    const canvas = canvasRef.current
    console.log('EcosystemWorker: Canvas element:', canvas)
    if (!canvas) {
      console.warn('EcosystemWorker: No canvas element found')
      return
    }

    // Check browser support
    if (!('OffscreenCanvas' in window) || !canvas.transferControlToOffscreen) {
      console.warn('OffscreenCanvas not supported, falling back')
      return
    }

    // Prevent multiple transfers
    if (transferredRef.current) {
      console.log('EcosystemWorker: Already transferred')
      return
    }

    console.log('EcosystemWorker: Starting worker initialization')
    try {
      // Transfer control to offscreen canvas
      const offscreen = canvas.transferControlToOffscreen()
      transferredRef.current = true

      // Create worker
      console.log('EcosystemWorker: Creating web worker')
      const worker = new Worker(
        new URL('../../workers/ecosystem.worker.ts', import.meta.url),
        { type: 'module' }
      )
      workerRef.current = worker
      console.log('EcosystemWorker: Worker created successfully')
      
      // Listen for messages from worker
      worker.addEventListener('message', (event) => {
        console.log('EcosystemWorker: Message from worker:', event.data)
      })
      
      worker.addEventListener('error', (error) => {
        console.error('EcosystemWorker: Worker error:', error)
      })

      // Get user location if available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            worker.postMessage({
              type: 'updateLocation',
              data: {},
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
          },
          () => {
            // Using default location (NYC)
          }
        )
      }

      // Initialize worker with canvas
      worker.postMessage(
        {
          type: 'init',
          data: {
            canvas: offscreen,
            intensity
          },
          latitude: 40.7128, // Default NYC
          longitude: -74.0060
        },
        [offscreen as Transferable]
      )

      // Handle resize with debounce to avoid too many updates
      let resizeTimer: NodeJS.Timeout
      const handleResize = () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          worker.postMessage({
            type: 'resize',
            data: {
              width: window.innerWidth,
              height: window.innerHeight
            }
          })
        }, 100)
      }

      // Set initial size
      worker.postMessage({
        type: 'resize',
        data: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      })

      // Add event listeners
      window.addEventListener('resize', handleResize)

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize)
        
        if (worker) {
          worker.postMessage({ type: 'stop' })
          worker.terminate()
        }
      }
    } catch (error) {
      console.error('Error initializing ecosystem worker:', error)
    }
  }, []) // Remove intensity dependency to prevent re-transfers

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      width={typeof window !== 'undefined' ? window.innerWidth : 1920}
      height={typeof window !== 'undefined' ? window.innerHeight : 1080}
      style={{ opacity: 0.4 }}
    />
  )
}