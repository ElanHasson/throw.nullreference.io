'use client'

import { useEffect } from 'react'
import { CanvasBackgroundProps } from './types'

export function CodeRain({ canvasRef, intensity = 'medium' }: CanvasBackgroundProps) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const fontSize = intensity === 'low' ? 20 : intensity === 'high' ? 12 : 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    const codeChars = 'const function return async await class extends import export default => {} [] () ; : , . < > / = + - * & | ! ?'
      .split(' ')

    let animationId: number

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgba(16, 185, 129, 0.8)'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        
        const char = codeChars[Math.floor(Math.random() * codeChars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.fillText(char, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      // Recalculate columns and reinitialize drops array
      const newColumns = Math.floor(canvas.width / fontSize)
      if (newColumns > drops.length) {
        // Add new drops for new columns
        for (let i = drops.length; i < newColumns; i++) {
          drops[i] = Math.random() * -100
        }
      } else {
        // Remove excess drops
        drops.length = newColumns
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [canvasRef, intensity])

  return null
}