'use client'

import { useEffect } from 'react'
import { CanvasBackgroundProps } from './types'

export function WaveMotion({ canvasRef, intensity = 'medium' }: CanvasBackgroundProps) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const waveCount = intensity === 'low' ? 2 : intensity === 'high' ? 5 : 3
    let time = 0

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.01

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(${100 + i * 30}, 102, 241, ${0.3 - i * 0.05})`
        ctx.lineWidth = 2

        for (let x = 0; x < canvas.width; x += 5) {
          const y = canvas.height / 2 + 
                   Math.sin(x * 0.01 + time + i * 0.5) * 50 * (i + 1) +
                   Math.sin(x * 0.02 - time * 1.5 + i) * 30
          
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        
        ctx.stroke()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [canvasRef, intensity])

  return null
}