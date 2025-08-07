'use client'

import { useEffect } from 'react'
import { CanvasBackgroundProps } from './types'

export function CyberGrid({ canvasRef, intensity = 'medium' }: CanvasBackgroundProps) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const gridSpacing = intensity === 'low' ? 50 : intensity === 'high' ? 25 : 35
    let time = 0
    let scrollOffset = 0
    let colorShift = 0
    
    // Data streams
    const dataStreams: Array<{ lane: number, position: number, speed: number, length: number, hue: number }> = []
    for (let i = 0; i < (intensity === 'low' ? 3 : intensity === 'high' ? 8 : 5); i++) {
      dataStreams.push({
        lane: Math.floor(Math.random() * 10) - 5,
        position: Math.random() * 100,
        speed: 0.5 + Math.random() * 1.5,
        length: 10 + Math.random() * 20,
        hue: Math.random() * 60 + 160 // Cyan to purple range
      })
    }

    const animate = () => {
      // Darker fade for cyberpunk feel
      ctx.fillStyle = 'rgba(0, 0, 10, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.01
      scrollOffset += 0.5
      colorShift = Math.sin(time) * 30

      // Draw perspective grid
      const horizon = canvas.height * 0.5
      const vanishingPoint = { x: canvas.width / 2 + Math.sin(time * 0.5) * 50, y: horizon }

      // Moving horizontal lines (creates movement effect)
      const lineOffset = scrollOffset % gridSpacing
      for (let y = horizon; y < canvas.height + gridSpacing; y += gridSpacing) {
        const adjustedY = y + lineOffset
        if (adjustedY < horizon) continue
        
        const progress = (adjustedY - horizon) / (canvas.height - horizon)
        const hue = 180 + colorShift + progress * 40
        
        ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${0.4 - progress * 0.3})`
        ctx.lineWidth = 1 + progress * 2
        
        ctx.beginPath()
        ctx.moveTo(0, adjustedY)
        ctx.lineTo(canvas.width, adjustedY)
        ctx.stroke()
        
        // Add scan line effect
        if (Math.random() > 0.98) {
          ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.8})`
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(0, adjustedY)
          ctx.lineTo(canvas.width, adjustedY)
          ctx.stroke()
        }
      }

      // Vertical lines with perspective
      for (let i = -20; i <= 20; i++) {
        const x = vanishingPoint.x + i * gridSpacing * 2
        const hue = 300 + colorShift + Math.abs(i) * 5
        
        ctx.strokeStyle = `hsla(${hue}, 80%, 50%, 0.2)`
        ctx.lineWidth = 0.5
        
        ctx.beginPath()
        ctx.moveTo(vanishingPoint.x, vanishingPoint.y)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Data streams flowing down the grid
      dataStreams.forEach(stream => {
        stream.position += stream.speed
        if (stream.position > 100) {
          stream.position = -stream.length
          stream.lane = Math.floor(Math.random() * 10) - 5
          stream.hue = Math.random() * 60 + 160
        }
        
        const x = vanishingPoint.x + stream.lane * gridSpacing * 2
        
        for (let i = 0; i < stream.length; i++) {
          const progress = (stream.position - i) / 100
          if (progress < 0 || progress > 1) continue
          
          const y = horizon + progress * (canvas.height - horizon)
          const opacity = 1 - Math.abs(i - stream.length / 2) / (stream.length / 2)
          
          ctx.fillStyle = `hsla(${stream.hue}, 100%, 60%, ${opacity * 0.8})`
          ctx.fillRect(x - 2, y - 1, 4, 2)
        }
      })

      // Add pulsing nodes at intersections with color variation
      for (let i = -5; i <= 5; i++) {
        for (let j = 0; j < 5; j++) {
          const x = vanishingPoint.x + i * gridSpacing * 2
          const y = horizon + j * gridSpacing * 2 + lineOffset
          
          const pulse = Math.sin(time * 2 + i * 0.5 + j * 0.5) * 0.5 + 0.5
          const nodeHue = 180 + colorShift + Math.abs(i) * 10 + j * 20
          
          // Core
          ctx.beginPath()
          ctx.arc(x, y, 2 + pulse * 3, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${nodeHue}, 100%, 60%, ${0.5 + pulse * 0.5})`
          ctx.fill()
          
          // Glow effect
          ctx.beginPath()
          ctx.arc(x, y, 5 + pulse * 5, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${nodeHue}, 100%, 50%, ${0.1 + pulse * 0.1})`
          ctx.fill()
          
          // Connection lines between active nodes
          if (pulse > 0.7 && i < 5) {
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + gridSpacing * 2, y)
            ctx.strokeStyle = `hsla(${nodeHue}, 100%, 60%, ${pulse * 0.3})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
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