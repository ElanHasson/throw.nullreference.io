'use client'

import { useEffect } from 'react'
import { CanvasBackgroundProps } from './types'

export function FractalTrees({ canvasRef, intensity = 'medium' }: CanvasBackgroundProps) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const maxDepth = intensity === 'low' ? 8 : intensity === 'high' ? 12 : 10
    const treeCount = intensity === 'low' ? 3 : intensity === 'high' ? 7 : 5
    let time = 0
    let windStrength = 0
    let windTarget = 0
    
    // Tree state for each tree
    const trees = Array(treeCount).fill(0).map((_, i) => ({
      x: (canvas.width / (treeCount + 1)) * (i + 1),
      baseAngle: -Math.PI / 2 + (Math.random() - 0.5) * 0.2,
      growthRate: 0.3 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      size: 0.8 + Math.random() * 0.4
    }))

    const drawBranch = (
      x: number, 
      y: number, 
      angle: number, 
      depth: number, 
      length: number, 
      growthFactor: number,
      windEffect: number,
      seasonalColor: { r: number, g: number, b: number }
    ) => {
      if (depth === 0 || growthFactor <= 0) return

      // Apply wind effect that increases with height
      const windAngle = angle + windEffect * (1 - depth / maxDepth) * 0.3
      const endX = x + Math.cos(windAngle) * length * growthFactor
      const endY = y + Math.sin(windAngle) * length * growthFactor

      // Vary color based on depth and season
      const alpha = 0.1 + (maxDepth - depth) * 0.06
      ctx.strokeStyle = `rgba(${seasonalColor.r}, ${seasonalColor.g}, ${seasonalColor.b}, ${alpha})`
      ctx.lineWidth = Math.max(depth * 0.5, 0.5)
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(endX, endY)
      ctx.stroke()

      // Add leaves/blossoms at endpoints
      if (depth <= 2 && growthFactor > 0.8) {
        ctx.fillStyle = `rgba(${seasonalColor.r + 50}, ${seasonalColor.g}, ${seasonalColor.b - 30}, 0.3)`
        ctx.beginPath()
        ctx.arc(endX, endY, 2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Dynamic branching angle based on time and depth
      const angleVariation = (Math.PI / 6) + Math.sin(time * 0.001 + depth) * 0.1
      const branchingRandomness = Math.sin(x + y + time * 0.0005) * 0.1
      
      // Recursively draw branches
      drawBranch(endX, endY, windAngle - angleVariation + branchingRandomness, depth - 1, length * 0.75, growthFactor, windEffect, seasonalColor)
      drawBranch(endX, endY, windAngle + angleVariation - branchingRandomness, depth - 1, length * 0.75, growthFactor, windEffect, seasonalColor)
      
      // Occasionally add a third branch for variety
      if (depth > maxDepth / 2 && Math.sin(time * 0.01 + x) > 0.7) {
        drawBranch(endX, endY, windAngle + branchingRandomness * 2, depth - 1, length * 0.6, growthFactor, windEffect, seasonalColor)
      }
    }

    const animate = () => {
      // Fade effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time++
      
      // Smooth wind transitions
      if (Math.random() > 0.98) {
        windTarget = (Math.random() - 0.5) * 2
      }
      windStrength += (windTarget - windStrength) * 0.02
      
      // Seasonal color changes (cycles through seasons)
      const seasonCycle = time * 0.0001
      const seasonalColor = {
        r: 34 + Math.sin(seasonCycle) * 50,
        g: 197 - Math.sin(seasonCycle + Math.PI / 3) * 30,
        b: 94 + Math.sin(seasonCycle + Math.PI * 2 / 3) * 40
      }

      // Draw each tree with its own growth cycle
      trees.forEach((tree) => {
        // Continuous growth cycle with sine wave
        const growthCycle = Math.sin(time * tree.growthRate * 0.01 + tree.phase)
        const growthFactor = 0.3 + (growthCycle + 1) * 0.35 // Oscillates between 0.3 and 1.0
        
        drawBranch(
          tree.x, 
          canvas.height, 
          tree.baseAngle, 
          maxDepth, 
          canvas.height / 5 * tree.size, 
          growthFactor,
          windStrength,
          seasonalColor
        )
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      // Recalculate tree positions for new canvas width
      trees.forEach((tree, i) => {
        tree.x = (canvas.width / (treeCount + 1)) * (i + 1)
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [canvasRef, intensity])

  return null
}