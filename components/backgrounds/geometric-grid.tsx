'use client'

import { useEffect } from 'react'
import { CanvasBackgroundProps } from './types'

export function GeometricGrid({ canvasRef, intensity = 'medium' }: CanvasBackgroundProps) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const gridSize = intensity === 'low' ? 80 : intensity === 'high' ? 40 : 60
    let rotation = 0
    let time = 0
    let colorShift = 0

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      rotation += 0.005
      time++
      colorShift = Math.sin(time * 0.001) * 360

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(rotation)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)

      for (let x = -gridSize; x < canvas.width + gridSize * 2; x += gridSize) {
        for (let y = -gridSize; y < canvas.height + gridSize * 2; y += gridSize) {
          const distanceFromCenter = Math.sqrt(
            Math.pow(x - canvas.width / 2, 2) + 
            Math.pow(y - canvas.height / 2, 2)
          )
          
          const scale = Math.sin(distanceFromCenter * 0.005 - rotation * 5) * 0.5 + 0.5
          const pulseEffect = Math.sin(time * 0.01 + distanceFromCenter * 0.001) * 0.3
          
          // Dynamic color based on position and time
          const hue = (distanceFromCenter * 0.5 + colorShift) % 360
          const saturation = 60 + Math.sin(time * 0.002 + x * 0.01) * 20
          const lightness = 50 + Math.sin(time * 0.003 + y * 0.01) * 10
          
          ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.1 + scale * 0.2 + pulseEffect})`
          ctx.lineWidth = 0.5 + scale + Math.abs(pulseEffect)
          
          // Alternate between squares and diamonds based on position
          ctx.beginPath()
          if ((Math.floor(x / gridSize) + Math.floor(y / gridSize)) % 2 === 0) {
            ctx.rect(
              x - gridSize / 2 * scale,
              y - gridSize / 2 * scale,
              gridSize * scale,
              gridSize * scale
            )
          } else {
            // Draw diamond
            ctx.moveTo(x, y - gridSize / 2 * scale)
            ctx.lineTo(x + gridSize / 2 * scale, y)
            ctx.lineTo(x, y + gridSize / 2 * scale)
            ctx.lineTo(x - gridSize / 2 * scale, y)
            ctx.closePath()
          }
          ctx.stroke()
        }
      }

      ctx.restore()
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