'use client'

import { useEffect } from 'react'
import { CanvasBackgroundProps } from './types'

interface Creature {
  branchIndex: number
  position: number // 0-1 along branch
  size: number
  color: string
  wingPhase: number
  type: 'butterfly' | 'bird' | 'dragonfly' | 'fairy'
}

interface Animal {
  x: number
  y: number
  vx: number
  size: number
  type: 'rabbit' | 'fox' | 'deer' | 'squirrel'
  animPhase: number
  color: string
  jumpHeight: number
}

interface Cloud {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
}

export function Ecosystem({ canvasRef, intensity = 'medium' }: CanvasBackgroundProps) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const maxDepth = intensity === 'low' ? 7 : intensity === 'high' ? 10 : 8
    const treeCount = intensity === 'low' ? 2 : intensity === 'high' ? 4 : 3
    const creatureCount = intensity === 'low' ? 5 : intensity === 'high' ? 15 : 10
    const animalCount = intensity === 'low' ? 3 : intensity === 'high' ? 8 : 5
    
    let time = 0
    let windStrength = 0
    let windTarget = 0
    let dayNightCycle = 0
    
    // Initialize trees
    const trees = Array(treeCount).fill(0).map((_, i) => ({
      x: (canvas.width / (treeCount + 1)) * (i + 1),
      baseAngle: -Math.PI / 2 + (Math.random() - 0.5) * 0.1,
      growthRate: 0.3 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
      size: 0.7 + Math.random() * 0.3,
      branches: [] as Array<{x: number, y: number, angle: number, depth: number}>
    }))
    
    // Initialize creatures
    const creatures: Creature[] = Array(creatureCount).fill(0).map(() => ({
      branchIndex: Math.floor(Math.random() * trees.length),
      position: Math.random(),
      size: 0.5 + Math.random() * 0.5,
      color: `${Math.random() * 360}`, // Store just the hue value
      wingPhase: Math.random() * Math.PI * 2,
      type: (['butterfly', 'bird', 'dragonfly', 'fairy'] as const)[Math.floor(Math.random() * 4)]
    }))
    
    // Initialize ground animals
    const animals: Animal[] = Array(animalCount).fill(0).map(() => ({
      x: Math.random() * canvas.width,
      y: canvas.height - 20 - Math.random() * 50,
      vx: (Math.random() - 0.5) * 2,
      size: 0.7 + Math.random() * 0.5,
      type: (['rabbit', 'fox', 'deer', 'squirrel'] as const)[Math.floor(Math.random() * 4)],
      animPhase: Math.random() * Math.PI * 2,
      color: `${20 + Math.random() * 40}`, // Store just the hue value
      jumpHeight: 0
    }))
    
    // Initialize clouds
    const clouds: Cloud[] = Array(5).fill(0).map(() => ({
      x: Math.random() * canvas.width,
      y: 50 + Math.random() * 150,
      size: 50 + Math.random() * 100,
      opacity: 0.3 + Math.random() * 0.3,
      speed: 0.1 + Math.random() * 0.3
    }))

    // Draw mountain range
    const drawMountains = () => {
      const mountainCount = 5
      ctx.save()
      
      for (let i = 0; i < mountainCount; i++) {
        const x = (canvas.width / mountainCount) * i
        const width = canvas.width / mountainCount + 50
        const height = 200 + Math.sin(i * 0.5) * 100
        const peakX = x + width / 2 + Math.sin(i * 1.5) * 30
        
        // Mountain shadow
        ctx.fillStyle = `hsla(220, 30%, ${20 + dayNightCycle * 10}%, 0.3)`
        ctx.beginPath()
        ctx.moveTo(x, canvas.height * 0.7)
        ctx.lineTo(peakX + 10, canvas.height * 0.7 - height)
        ctx.lineTo(x + width + 10, canvas.height * 0.7)
        ctx.closePath()
        ctx.fill()
        
        // Mountain body
        const gradient = ctx.createLinearGradient(0, canvas.height * 0.7 - height, 0, canvas.height * 0.7)
        gradient.addColorStop(0, `hsla(220, 25%, ${35 + dayNightCycle * 20}%, 0.6)`)
        gradient.addColorStop(0.3, `hsla(220, 20%, ${30 + dayNightCycle * 15}%, 0.6)`)
        gradient.addColorStop(1, `hsla(220, 15%, ${25 + dayNightCycle * 10}%, 0.6)`)
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.moveTo(x, canvas.height * 0.7)
        ctx.lineTo(peakX, canvas.height * 0.7 - height)
        ctx.lineTo(x + width, canvas.height * 0.7)
        ctx.closePath()
        ctx.fill()
        
        // Snow cap
        if (height > 250) {
          ctx.fillStyle = `hsla(0, 0%, ${90 + dayNightCycle * 10}%, 0.8)`
          ctx.beginPath()
          ctx.moveTo(peakX - 20, canvas.height * 0.7 - height + 40)
          ctx.lineTo(peakX, canvas.height * 0.7 - height)
          ctx.lineTo(peakX + 20, canvas.height * 0.7 - height + 40)
          ctx.closePath()
          ctx.fill()
        }
      }
      ctx.restore()
    }

    // Draw sun/moon
    const drawCelestialBody = () => {
      const sunX = canvas.width * 0.8
      const sunY = 100 + Math.sin(dayNightCycle * Math.PI) * 50
      const isDay = Math.cos(dayNightCycle * Math.PI * 2) > 0
      
      ctx.save()
      
      if (isDay) {
        // Sun
        const sunRadius = 40
        
        // Sun rays
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2 + time * 0.01
          const rayLength = sunRadius + 20 + Math.sin(time * 0.05 + i) * 10
          
          ctx.strokeStyle = `hsla(45, 100%, 60%, ${0.3 + Math.sin(time * 0.02 + i) * 0.2})`
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(
            sunX + Math.cos(angle) * sunRadius,
            sunY + Math.sin(angle) * sunRadius
          )
          ctx.lineTo(
            sunX + Math.cos(angle) * rayLength,
            sunY + Math.sin(angle) * rayLength
          )
          ctx.stroke()
        }
        
        // Sun glow
        const glowGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2)
        glowGradient.addColorStop(0, 'hsla(45, 100%, 65%, 0.8)')
        glowGradient.addColorStop(0.5, 'hsla(45, 100%, 60%, 0.4)')
        glowGradient.addColorStop(1, 'hsla(45, 100%, 55%, 0)')
        
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(sunX, sunY, sunRadius * 2, 0, Math.PI * 2)
        ctx.fill()
        
        // Sun body
        ctx.fillStyle = 'hsl(45, 100%, 65%)'
        ctx.beginPath()
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Moon
        ctx.fillStyle = 'hsla(220, 20%, 85%, 0.9)'
        ctx.beginPath()
        ctx.arc(sunX, sunY, 35, 0, Math.PI * 2)
        ctx.fill()
        
        // Moon craters
        ctx.fillStyle = 'hsla(220, 20%, 75%, 0.5)'
        ctx.beginPath()
        ctx.arc(sunX - 10, sunY - 5, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(sunX + 8, sunY + 8, 3, 0, Math.PI * 2)
        ctx.fill()
        
        // Stars
        for (let i = 0; i < 50; i++) {
          const starX = (i * 73) % canvas.width
          const starY = (i * 37) % (canvas.height * 0.5)
          const twinkle = Math.sin(time * 0.02 + i) * 0.5 + 0.5
          
          ctx.fillStyle = `hsla(220, 100%, 90%, ${twinkle * 0.8})`
          ctx.beginPath()
          ctx.arc(starX, starY, twinkle * 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      
      ctx.restore()
    }

    // Draw clouds
    const drawClouds = () => {
      clouds.forEach(cloud => {
        cloud.x += cloud.speed
        if (cloud.x > canvas.width + cloud.size) {
          cloud.x = -cloud.size
          cloud.y = 50 + Math.random() * 150
        }
        
        ctx.save()
        ctx.fillStyle = `hsla(0, 0%, ${85 + dayNightCycle * 10}%, ${cloud.opacity})`
        
        // Draw puffy cloud shape
        for (let i = 0; i < 5; i++) {
          const offsetX = Math.sin(i * 1.5) * cloud.size * 0.3
          const offsetY = Math.cos(i * 2) * cloud.size * 0.2
          const puffSize = cloud.size * (0.4 + Math.sin(i + time * 0.001) * 0.1)
          
          ctx.beginPath()
          ctx.arc(cloud.x + offsetX, cloud.y + offsetY, puffSize, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      })
    }

    // Enhanced tree drawing with branch tracking
    const drawBranch = (
      x: number, 
      y: number, 
      angle: number, 
      depth: number, 
      length: number, 
      growthFactor: number,
      windEffect: number,
      treeIndex: number
    ) => {
      if (depth === 0 || growthFactor <= 0) return

      const windAngle = angle + windEffect * (1 - depth / maxDepth) * 0.2
      const endX = x + Math.cos(windAngle) * length * growthFactor
      const endY = y + Math.sin(windAngle) * length * growthFactor

      // Store main branches for creature positioning
      if (depth === maxDepth - 2) {
        trees[treeIndex].branches.push({ x: endX, y: endY, angle: windAngle, depth })
      }

      // Tree trunk and branches
      const thickness = Math.max(depth * 0.8, 0.5)
      ctx.strokeStyle = `hsla(25, 40%, ${20 + depth * 3}%, 0.9)`
      ctx.lineWidth = thickness
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(endX, endY)
      ctx.stroke()

      // Leaves
      if (depth <= 3 && growthFactor > 0.7) {
        const leafColor = `hsla(${90 + Math.sin(time * 0.001) * 30}, 60%, ${40 + depth * 5}%, 0.7)`
        ctx.fillStyle = leafColor
        
        for (let i = 0; i < 3; i++) {
          const leafX = x + (endX - x) * (0.3 + i * 0.3)
          const leafY = y + (endY - y) * (0.3 + i * 0.3)
          const leafSize = 3 + Math.sin(time * 0.01 + i) * 1
          
          ctx.beginPath()
          ctx.ellipse(leafX, leafY, leafSize * 2, leafSize, windAngle + Math.PI / 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Recursive branching
      const angleVariation = (Math.PI / 5) + Math.sin(time * 0.001 + depth) * 0.1
      const branchingRandomness = Math.sin(x + y + time * 0.0005) * 0.1
      
      drawBranch(endX, endY, windAngle - angleVariation + branchingRandomness, depth - 1, length * 0.75, growthFactor, windEffect, treeIndex)
      drawBranch(endX, endY, windAngle + angleVariation - branchingRandomness, depth - 1, length * 0.75, growthFactor, windEffect, treeIndex)
      
      if (depth > maxDepth / 2 && Math.sin(time * 0.01 + x) > 0.6) {
        drawBranch(endX, endY, windAngle + branchingRandomness * 2, depth - 1, length * 0.6, growthFactor, windEffect, treeIndex)
      }
    }

    // Draw creatures on branches
    const drawCreatures = () => {
      creatures.forEach((creature, i) => {
        const tree = trees[creature.branchIndex]
        if (!tree.branches.length) return
        
        const branch = tree.branches[Math.floor(creature.position * tree.branches.length)]
        if (!branch) return
        
        creature.wingPhase += 0.15
        creature.position += Math.sin(time * 0.01 + i) * 0.002
        if (creature.position > 1) creature.position = 0
        if (creature.position < 0) creature.position = 1
        
        const x = branch.x + Math.sin(creature.wingPhase * 0.5) * 10
        const y = branch.y + Math.cos(creature.wingPhase * 0.3) * 5
        
        ctx.save()
        ctx.translate(x, y)
        
        switch(creature.type) {
          case 'butterfly':
            // Wings
            const wingSpan = 15 * creature.size * (1 + Math.sin(creature.wingPhase) * 0.3)
            ctx.fillStyle = `hsl(${creature.color}, 70%, 50%)`
            ctx.globalAlpha = 0.7
            
            // Left wing
            ctx.beginPath()
            ctx.ellipse(-wingSpan/2, 0, wingSpan/2, wingSpan/3, -Math.PI/6 + Math.sin(creature.wingPhase) * 0.3, 0, Math.PI * 2)
            ctx.fill()
            
            // Right wing
            ctx.beginPath()
            ctx.ellipse(wingSpan/2, 0, wingSpan/2, wingSpan/3, Math.PI/6 - Math.sin(creature.wingPhase) * 0.3, 0, Math.PI * 2)
            ctx.fill()
            
            // Body
            ctx.globalAlpha = 1
            ctx.fillStyle = 'hsl(30, 40%, 30%)'
            ctx.fillRect(-1, -3, 2, 6)
            break
            
          case 'bird':
            // Simple bird shape
            ctx.fillStyle = `hsl(${creature.color}, 70%, 50%)`
            ctx.beginPath()
            ctx.arc(0, 0, 4 * creature.size, 0, Math.PI * 2)
            ctx.fill()
            
            // Wing flap
            const flapAngle = Math.sin(creature.wingPhase) * 0.5
            ctx.strokeStyle = `hsl(${creature.color}, 70%, 50%)`
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(-10 * creature.size, -5 + flapAngle * 10)
            ctx.moveTo(0, 0)
            ctx.lineTo(10 * creature.size, -5 - flapAngle * 10)
            ctx.stroke()
            break
            
          case 'dragonfly':
            // Four wings
            ctx.fillStyle = `hsla(${creature.color}, 70%, 50%, 0.33)`
            const dfWingSize = 12 * creature.size
            
            for (let w = 0; w < 4; w++) {
              const wingAngle = (w / 4) * Math.PI + Math.sin(creature.wingPhase * 2) * 0.2
              ctx.beginPath()
              ctx.ellipse(
                Math.cos(wingAngle) * dfWingSize/2,
                Math.sin(wingAngle) * dfWingSize/2,
                dfWingSize, dfWingSize/4,
                wingAngle, 0, Math.PI * 2
              )
              ctx.fill()
            }
            
            // Body
            ctx.fillStyle = `hsl(${creature.color}, 70%, 50%)`
            ctx.fillRect(-1, -8, 2, 16)
            break
            
          case 'fairy':
            // Glowing fairy
            const glowSize = 8 * creature.size * (1 + Math.sin(creature.wingPhase * 2) * 0.2)
            const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize)
            glow.addColorStop(0, `hsla(${creature.color}, 70%, 50%, 0.6)`)
            glow.addColorStop(0.5, `hsla(${creature.color}, 70%, 50%, 0.27)`)
            glow.addColorStop(1, `hsla(${creature.color}, 70%, 50%, 0)`)
            
            ctx.fillStyle = glow
            ctx.beginPath()
            ctx.arc(0, 0, glowSize, 0, Math.PI * 2)
            ctx.fill()
            
            // Sparkles
            for (let s = 0; s < 3; s++) {
              const sparkleAngle = (s / 3) * Math.PI * 2 + creature.wingPhase
              const sparkleR = glowSize + 5
              ctx.fillStyle = `hsla(60, 100%, 80%, ${Math.sin(creature.wingPhase * 3 + s) * 0.5 + 0.5})`
              ctx.beginPath()
              ctx.arc(
                Math.cos(sparkleAngle) * sparkleR,
                Math.sin(sparkleAngle) * sparkleR,
                2, 0, Math.PI * 2
              )
              ctx.fill()
            }
            break
        }
        
        ctx.restore()
      })
    }

    // Draw ground animals
    const drawAnimals = () => {
      animals.forEach((animal, i) => {
        animal.animPhase += 0.1
        animal.x += animal.vx
        
        // Bounce at edges
        if (animal.x < 0 || animal.x > canvas.width) {
          animal.vx *= -1
          animal.x = Math.max(0, Math.min(canvas.width, animal.x))
        }
        
        // Random direction changes
        if (Math.random() > 0.99) {
          animal.vx = (Math.random() - 0.5) * 2
        }
        
        // Jumping animation
        if (Math.random() > 0.995 && animal.jumpHeight === 0) {
          animal.jumpHeight = 20 + Math.random() * 20
        }
        if (animal.jumpHeight > 0) {
          animal.jumpHeight -= 2
        }
        
        const y = animal.y - Math.abs(animal.jumpHeight)
        
        ctx.save()
        ctx.translate(animal.x, y)
        
        // Flip if moving left
        if (animal.vx < 0) {
          ctx.scale(-1, 1)
        }
        
        switch(animal.type) {
          case 'rabbit':
            // Body
            ctx.fillStyle = `hsl(${animal.color}, 40%, ${30 + Math.random() * 20}%)`
            ctx.beginPath()
            ctx.ellipse(0, 0, 8 * animal.size, 6 * animal.size, 0, 0, Math.PI * 2)
            ctx.fill()
            
            // Head
            ctx.beginPath()
            ctx.arc(-6 * animal.size, -2, 5 * animal.size, 0, Math.PI * 2)
            ctx.fill()
            
            // Ears
            ctx.beginPath()
            ctx.ellipse(-6 * animal.size, -8, 2 * animal.size, 6 * animal.size, -0.2, 0, Math.PI * 2)
            ctx.ellipse(-4 * animal.size, -8, 2 * animal.size, 6 * animal.size, 0.2, 0, Math.PI * 2)
            ctx.fill()
            
            // Tail
            ctx.fillStyle = 'hsla(0, 0%, 90%, 0.8)'
            ctx.beginPath()
            ctx.arc(8 * animal.size, -2, 3 * animal.size, 0, Math.PI * 2)
            ctx.fill()
            break
            
          case 'fox':
            // Body
            ctx.fillStyle = `hsl(${animal.color}, 40%, 40%)`
            ctx.beginPath()
            ctx.ellipse(0, 0, 12 * animal.size, 6 * animal.size, 0, 0, Math.PI * 2)
            ctx.fill()
            
            // Head (triangular)
            ctx.beginPath()
            ctx.moveTo(-10 * animal.size, -2)
            ctx.lineTo(-15 * animal.size, -6)
            ctx.lineTo(-15 * animal.size, 2)
            ctx.closePath()
            ctx.fill()
            
            // Tail (bushy)
            ctx.beginPath()
            ctx.ellipse(10 * animal.size, -3, 8 * animal.size, 4 * animal.size, -0.3, 0, Math.PI * 2)
            ctx.fill()
            
            // White tail tip
            ctx.fillStyle = 'hsla(0, 0%, 95%, 0.9)'
            ctx.beginPath()
            ctx.ellipse(14 * animal.size, -4, 3 * animal.size, 2 * animal.size, -0.3, 0, Math.PI * 2)
            ctx.fill()
            break
            
          case 'deer':
            // Body
            ctx.fillStyle = `hsl(${animal.color}, 40%, 35%)`
            ctx.beginPath()
            ctx.ellipse(0, -5, 10 * animal.size, 8 * animal.size, 0, 0, Math.PI * 2)
            ctx.fill()
            
            // Neck
            ctx.beginPath()
            ctx.moveTo(-8 * animal.size, -5)
            ctx.lineTo(-12 * animal.size, -15)
            ctx.lineTo(-6 * animal.size, -10)
            ctx.closePath()
            ctx.fill()
            
            // Head
            ctx.beginPath()
            ctx.ellipse(-12 * animal.size, -15, 4 * animal.size, 3 * animal.size, -0.5, 0, Math.PI * 2)
            ctx.fill()
            
            // Antlers (simple)
            ctx.strokeStyle = `hsl(${animal.color}, 40%, 35%)`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(-13 * animal.size, -18)
            ctx.lineTo(-15 * animal.size, -22)
            ctx.moveTo(-11 * animal.size, -18)
            ctx.lineTo(-9 * animal.size, -22)
            ctx.stroke()
            
            // Legs (simple lines)
            ctx.strokeStyle = `hsl(${animal.color}, 40%, 35%)`
            ctx.lineWidth = 2
            for (let leg = 0; leg < 4; leg++) {
              const legX = -5 + leg * 4
              const legPhase = Math.sin(animal.animPhase + leg * Math.PI / 2) * 2
              ctx.beginPath()
              ctx.moveTo(legX * animal.size, 0)
              ctx.lineTo(legX * animal.size + legPhase, 8)
              ctx.stroke()
            }
            break
            
          case 'squirrel':
            // Body
            ctx.fillStyle = `hsl(${animal.color}, 40%, 30%)`
            ctx.beginPath()
            ctx.ellipse(0, 0, 6 * animal.size, 5 * animal.size, 0.2, 0, Math.PI * 2)
            ctx.fill()
            
            // Head
            ctx.beginPath()
            ctx.arc(-5 * animal.size, -3, 4 * animal.size, 0, Math.PI * 2)
            ctx.fill()
            
            // Bushy tail
            ctx.beginPath()
            ctx.ellipse(6 * animal.size, -8, 5 * animal.size, 10 * animal.size, 0.5, 0, Math.PI * 2)
            ctx.fill()
            
            // Acorn (if stationary)
            if (Math.abs(animal.vx) < 0.1) {
              ctx.fillStyle = 'hsl(30, 60%, 40%)'
              ctx.beginPath()
              ctx.ellipse(-8 * animal.size, 2, 2, 3, 0, 0, Math.PI * 2)
              ctx.fill()
            }
            break
        }
        
        ctx.restore()
      })
    }

    // Ground and grass
    const drawGround = () => {
      // Ground gradient
      const groundGradient = ctx.createLinearGradient(0, canvas.height - 100, 0, canvas.height)
      groundGradient.addColorStop(0, `hsla(90, 40%, ${25 + dayNightCycle * 10}%, 0.9)`)
      groundGradient.addColorStop(1, `hsla(30, 30%, ${20 + dayNightCycle * 5}%, 0.9)`)
      
      ctx.fillStyle = groundGradient
      ctx.fillRect(0, canvas.height - 100, canvas.width, 100)
      
      // Grass blades
      ctx.strokeStyle = `hsla(90, 50%, ${30 + dayNightCycle * 15}%, 0.7)`
      for (let x = 0; x < canvas.width; x += 5) {
        const grassHeight = 10 + Math.sin(x * 0.1 + time * 0.01) * 5
        const sway = Math.sin(time * 0.02 + x * 0.01) * 2 + windStrength * 3
        
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, canvas.height)
        ctx.quadraticCurveTo(x + sway, canvas.height - grassHeight / 2, x + sway * 2, canvas.height - grassHeight)
        ctx.stroke()
      }
    }

    const animate = () => {
      // Sky gradient based on day/night
      dayNightCycle = (Math.sin(time * 0.0005) + 1) / 2 // 0 = night, 1 = day
      
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      if (dayNightCycle > 0.5) {
        // Day sky
        skyGradient.addColorStop(0, `hsl(200, 70%, ${50 + dayNightCycle * 30}%)`)
        skyGradient.addColorStop(0.5, `hsl(190, 60%, ${60 + dayNightCycle * 20}%)`)
        skyGradient.addColorStop(1, `hsl(180, 50%, ${70 + dayNightCycle * 15}%)`)
      } else {
        // Night sky
        skyGradient.addColorStop(0, `hsl(240, 80%, ${5 + dayNightCycle * 10}%)`)
        skyGradient.addColorStop(0.5, `hsl(230, 70%, ${10 + dayNightCycle * 15}%)`)
        skyGradient.addColorStop(1, `hsl(220, 60%, ${15 + dayNightCycle * 20}%)`)
      }
      
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time++
      
      // Wind effect
      if (Math.random() > 0.98) {
        windTarget = (Math.random() - 0.5) * 1.5
      }
      windStrength += (windTarget - windStrength) * 0.02

      // Draw scene layers (back to front)
      drawCelestialBody()
      drawClouds()
      drawMountains()
      
      // Clear branches for recalculation
      trees.forEach(tree => tree.branches = [])
      
      // Draw trees with growth animation
      trees.forEach((tree, treeIndex) => {
        const growthCycle = Math.sin(time * tree.growthRate * 0.01 + tree.phase)
        const growthFactor = 0.7 + (growthCycle + 1) * 0.15
        
        drawBranch(
          tree.x, 
          canvas.height - 80, 
          tree.baseAngle, 
          maxDepth, 
          canvas.height / 6 * tree.size, 
          growthFactor,
          windStrength,
          treeIndex
        )
      })
      
      drawCreatures()
      drawGround()
      drawAnimals()

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      // Recalculate tree positions
      trees.forEach((tree, i) => {
        tree.x = (canvas.width / (treeCount + 1)) * (i + 1)
      })
      // Redistribute animals
      animals.forEach(animal => {
        animal.x = Math.random() * canvas.width
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [canvasRef, intensity])

  return null
}