'use client'

import { useEffect } from 'react'
import { CanvasBackgroundProps } from './types'

export function NeuralNetwork({ canvasRef, intensity = 'medium' }: CanvasBackgroundProps) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const nodeCount = intensity === 'low' ? 20 : intensity === 'high' ? 50 : 35
    const nodes: Array<{
      x: number
      y: number
      vx: number
      vy: number
      connections: number[]
      layer: number
      activity: number
      hue: number
    }> = []

    // Create nodes in layers for more neural network-like structure
    for (let i = 0; i < nodeCount; i++) {
      const layer = Math.floor(i / (nodeCount / 5))
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        connections: [],
        layer,
        activity: Math.random(),
        hue: 200 + Math.random() * 160 // Blue to purple range
      })
    }

    // Create connections with preference for forward connections
    nodes.forEach((node, i) => {
      const connectionCount = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < connectionCount; j++) {
        // Prefer connecting to nodes in next layers
        const layerBias = Math.random() > 0.3 ? 1 : Math.floor(Math.random() * 3)
        const targetLayer = Math.min(4, node.layer + layerBias)
        const layerNodes = nodes.filter((n, idx) => n.layer === targetLayer && idx !== i)
        
        if (layerNodes.length > 0) {
          const target = nodes.indexOf(layerNodes[Math.floor(Math.random() * layerNodes.length)])
          if (target !== -1 && !node.connections.includes(target)) {
            node.connections.push(target)
          }
        }
      }
    })

    let pulsePhase = 0
    // let time = 0 // Not used currently
    let signalWaves: Array<{ from: number, to: number, progress: number }> = []
    let animationId: number

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      pulsePhase += 0.02
      // time++

      // Occasionally trigger signal propagation
      if (Math.random() > 0.98 && signalWaves.length < 10) {
        const sourceNode = Math.floor(Math.random() * nodes.length)
        nodes[sourceNode].connections.forEach(target => {
          signalWaves.push({ from: sourceNode, to: target, progress: 0 })
        })
        nodes[sourceNode].activity = 1
      }

      // Update signal waves
      signalWaves = signalWaves.filter(wave => {
        wave.progress += 0.05
        if (wave.progress >= 1) {
          nodes[wave.to].activity = Math.min(1, nodes[wave.to].activity + 0.5)
          return false
        }
        return true
      })

      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach(targetIndex => {
          const target = nodes[targetIndex]
          const dx = target.x - node.x
          const dy = target.y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 300) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(target.x, target.y)
            
            const pulse = Math.sin(pulsePhase + i * 0.5) * 0.5 + 0.5
            const activity = (node.activity + target.activity) / 2
            
            // Color based on node hue and activity
            const avgHue = (node.hue + target.hue) / 2
            ctx.strokeStyle = `hsla(${avgHue}, 70%, ${50 + activity * 20}%, ${0.1 + pulse * 0.2 + activity * 0.3})`
            ctx.lineWidth = 0.5 + pulse * 0.5 + activity
            ctx.stroke()
          }
        })
      })

      // Draw signal waves
      signalWaves.forEach(wave => {
        const from = nodes[wave.from]
        const to = nodes[wave.to]
        const x = from.x + (to.x - from.x) * wave.progress
        const y = from.y + (to.y - from.y) * wave.progress
        
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${from.hue}, 80%, 60%, ${1 - wave.progress})`
        ctx.fill()
      })

      // Update and draw nodes
      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy

        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Decay activity
        node.activity *= 0.98

        // Slowly shift color
        node.hue = (node.hue + 0.1) % 360

        const pulse = Math.sin(pulsePhase + i * 0.5) * 0.5 + 0.5
        const size = 3 + pulse * 2 + node.activity * 3
        
        // Inner core
        ctx.beginPath()
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${node.hue}, 70%, ${50 + node.activity * 30}%, ${0.6 + pulse * 0.4})`
        ctx.fill()
        
        // Outer glow
        ctx.beginPath()
        ctx.arc(node.x, node.y, size * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${node.hue}, 60%, 50%, ${0.05 + pulse * 0.05 + node.activity * 0.2})`
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [canvasRef, intensity])

  return null
}