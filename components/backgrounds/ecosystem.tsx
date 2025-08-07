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
    // const dayNightCycle = 0 // Not used currently
    
    // User location (default to NYC)
    let userLatitude = 40.7128
    // let userLongitude = -74.0060 // Not used
    
    // Get user location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLatitude = position.coords.latitude
          // userLongitude = position.coords.longitude
        },
        () => {
          // Keep default location on error
        }
      )
    }
    
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
    
    // Initialize clouds with more variety
    const clouds: Cloud[] = Array(8).fill(0).map((_, i) => {
      const isNearMountains = Math.random() > 0.6 // 40% chance of being near mountains
      const baseY = isNearMountains ? canvas.height * 0.4 + Math.random() * 100 : 50 + Math.random() * 150
      
      return {
        x: (canvas.width / 8) * i + Math.random() * (canvas.width / 8),
        y: baseY,
        size: 50 + Math.random() * 80,
        // Clouds near mountains are almost invisible
        opacity: isNearMountains ? 0.02 + Math.random() * 0.03 : 0.2 + Math.random() * 0.3,
        speed: isNearMountains ? 0.005 + Math.random() * 0.015 : 0.03 + Math.random() * 0.07,
        type: isNearMountains ? 'stratus' : (Math.random() > 0.5 ? 'cumulus' : 'stratus'),
        puffs: Array(Math.floor(4 + Math.random() * 3)).fill(0).map(() => ({
          offsetX: (Math.random() - 0.5) * 60,
          offsetY: (Math.random() - 0.5) * 30,
          size: 0.5 + Math.random() * 0.5
        })),
        isNearMountains
      }
    }) as (Cloud & {puffs: Array<{offsetX: number, offsetY: number, size: number}>, isNearMountains: boolean, type: string})[]

    // Astronomical calculations
    const getSunMoonPosition = (date: Date, latitude: number) => {
      const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
      const hour = date.getHours() + date.getMinutes() / 60
      
      // Simplified sun position calculation
      const declination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180)
      const hourAngle = 15 * (hour - 12) // 15 degrees per hour
      const solarAltitude = Math.asin(
        Math.sin(latitude * Math.PI / 180) * Math.sin(declination * Math.PI / 180) +
        Math.cos(latitude * Math.PI / 180) * Math.cos(declination * Math.PI / 180) * Math.cos(hourAngle * Math.PI / 180)
      ) * 180 / Math.PI
      
      const solarAzimuth = Math.atan2(
        Math.sin(hourAngle * Math.PI / 180),
        Math.cos(hourAngle * Math.PI / 180) * Math.sin(latitude * Math.PI / 180) -
        Math.tan(declination * Math.PI / 180) * Math.cos(latitude * Math.PI / 180)
      ) * 180 / Math.PI + 180
      
      // Moon phase calculation (simplified)
      const knownNewMoon = new Date(2000, 0, 6, 18, 14)
      const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / 86400000
      const moonPhase = (daysSinceNewMoon % 29.53059) / 29.53059
      
      // Moon position (opposite of sun at full moon)
      const moonAltitude = -solarAltitude + 30 * Math.sin(moonPhase * Math.PI * 2)
      const moonAzimuth = (solarAzimuth + 180) % 360
      
      return {
        sun: { altitude: solarAltitude, azimuth: solarAzimuth },
        moon: { altitude: moonAltitude, azimuth: moonAzimuth, phase: moonPhase }
      }
    }

    // Draw mountain range with crags and varied terrain
    const drawMountains = (isDay: boolean, sunAltitude: number) => {
      ctx.save()
      
      // Multiple mountain layers for depth
      for (let layer = 0; layer < 3; layer++) {
        const layerDepth = 1 - layer * 0.3
        const mountainCount = 4 + layer
        
        for (let i = 0; i < mountainCount; i++) {
          const x = (canvas.width / mountainCount) * i - 50
          const width = canvas.width / mountainCount + 100
          const height = (200 + Math.sin(i * 0.7 + layer) * 80) * layerDepth
          const peakX = x + width / 2 + Math.sin(i * 1.5 + layer * 0.5) * 40
          const baseY = canvas.height * 0.7
          const peakY = baseY - height
          
          // Mountain shadow
          const shadowOffset = isDay ? (sunAltitude / 90) * 20 : 5
          ctx.fillStyle = `hsla(220, 30%, ${10 + layer * 5}%, ${0.3 * layerDepth})`
          ctx.beginPath()
          ctx.moveTo(x + shadowOffset, baseY)
          ctx.lineTo(peakX + shadowOffset, peakY)
          ctx.lineTo(x + width + shadowOffset, baseY)
          ctx.closePath()
          ctx.fill()
          
          // Mountain gradient
          const gradient = ctx.createLinearGradient(0, peakY, 0, baseY)
          const lightness = isDay ? 25 + layer * 10 + sunAltitude / 3 : 15 + layer * 5
          gradient.addColorStop(0, `hsla(220, 25%, ${lightness + 15}%, ${0.8 * layerDepth})`)
          gradient.addColorStop(0.3, `hsla(220, 20%, ${lightness + 10}%, ${0.8 * layerDepth})`)
          gradient.addColorStop(0.7, `hsla(220, 15%, ${lightness + 5}%, ${0.8 * layerDepth})`)
          gradient.addColorStop(1, `hsla(220, 10%, ${lightness}%, ${0.8 * layerDepth})`)
          
          // Draw mountain with crags
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.moveTo(x, baseY)
          
          // Left slope with crags
          // let currentX = x
          // let currentY = baseY
          const leftSteps = 8
          for (let j = 0; j < leftSteps; j++) {
            const progress = j / leftSteps
            const targetX = x + (peakX - x) * progress
            const targetY = baseY - height * progress * progress // Exponential curve
            const cragOffset = Math.sin(j * 2 + i) * 5 * (1 - progress)
            ctx.lineTo(targetX + cragOffset, targetY)
            // currentX = targetX  
            // currentY = targetY
          }
          
          // Peak
          ctx.lineTo(peakX, peakY)
          
          // Right slope with crags
          const rightSteps = 8
          for (let j = 0; j < rightSteps; j++) {
            const progress = 1 - j / rightSteps
            const targetX = peakX + (x + width - peakX) * (1 - progress)
            const targetY = baseY - height * progress * progress
            const cragOffset = Math.sin(j * 3 + i * 2) * 5 * (1 - progress)
            ctx.lineTo(targetX + cragOffset, targetY)
          }
          
          ctx.lineTo(x + width, baseY)
          ctx.closePath()
          ctx.fill()
          
          // Rock texture details
          ctx.strokeStyle = `hsla(220, 15%, ${lightness - 5}%, ${0.2 * layerDepth})`
          ctx.lineWidth = 1
          for (let j = 0; j < 5; j++) {
            const rockY = peakY + (height * 0.3) + j * 20
            const rockX1 = peakX - (baseY - rockY) * 0.5
            const rockX2 = peakX + (baseY - rockY) * 0.3
            
            ctx.beginPath()
            ctx.moveTo(rockX1, rockY)
            ctx.lineTo(rockX2, rockY + Math.random() * 10)
            ctx.stroke()
          }
          
          // Natural snow cap with irregular patches
          if (height > 150 && layer < 2) {
            const snowLine = peakY + height * 0.35
            
            // Irregular snow patches
            for (let s = 0; s < 5; s++) {
              const snowX = peakX + (Math.random() - 0.5) * width * 0.3
              const snowY = peakY + Math.random() * (snowLine - peakY)
              const snowWidth = 20 + Math.random() * 30
              
              const snowGradient = ctx.createRadialGradient(snowX, snowY, 0, snowX, snowY, snowWidth)
              const snowBrightness = isDay ? 95 + sunAltitude / 18 : 80
              snowGradient.addColorStop(0, `hsla(200, 20%, ${snowBrightness}%, 0.9)`)
              snowGradient.addColorStop(0.5, `hsla(200, 15%, ${snowBrightness - 5}%, 0.7)`)
              snowGradient.addColorStop(1, `hsla(200, 10%, ${snowBrightness - 10}%, 0.3)`)
              
              ctx.fillStyle = snowGradient
              ctx.beginPath()
              ctx.ellipse(snowX, snowY, snowWidth * layerDepth, snowWidth * 0.6 * layerDepth, Math.random() * Math.PI, 0, Math.PI * 2)
              ctx.fill()
            }
            
            // Main snow cap
            const mainSnowGradient = ctx.createLinearGradient(peakX, peakY, peakX, snowLine)
            const brightness = isDay ? 92 + sunAltitude / 12 : 75
            mainSnowGradient.addColorStop(0, `hsla(200, 25%, ${brightness}%, 0.95)`)
            mainSnowGradient.addColorStop(0.3, `hsla(200, 20%, ${brightness - 5}%, 0.85)`)
            mainSnowGradient.addColorStop(1, `hsla(200, 10%, ${brightness - 15}%, 0.4)`)
            
            ctx.fillStyle = mainSnowGradient
            ctx.beginPath()
            ctx.moveTo(peakX - 35 * layerDepth, snowLine)
            ctx.quadraticCurveTo(peakX - 20 * layerDepth, peakY + height * 0.15, peakX, peakY)
            ctx.quadraticCurveTo(peakX + 20 * layerDepth, peakY + height * 0.15, peakX + 35 * layerDepth, snowLine)
            ctx.lineTo(peakX + 25 * layerDepth, snowLine + 10)
            ctx.lineTo(peakX - 25 * layerDepth, snowLine + 10)
            ctx.closePath()
            ctx.fill()
          }
        }
      }
      ctx.restore()
    }

    // Initialize stars for nighttime
    const stars = Array(100).fill(0).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.6,
      size: Math.random() * 2 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
      brightness: 0.3 + Math.random() * 0.7
    }))
    
    // Comet state
    let lastCometTime = 0
    let nextCometInterval = 30000 + Math.random() * 60000 // 30-90 seconds
    interface Comet {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      tailLength: number
      brightness: number
      trail: Array<{x: number, y: number}>
    }
    let comet: Comet | null = null

    // Draw stars with twinkling effect
    const drawStars = () => {
      stars.forEach((star) => {
        star.twinkle += 0.05
        const opacity = star.brightness * (0.5 + Math.sin(star.twinkle) * 0.5)
        
        ctx.fillStyle = `hsla(60, 100%, 90%, ${opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Add glow for brighter stars
        if (star.brightness > 0.7) {
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3)
          glow.addColorStop(0, `hsla(60, 100%, 90%, ${opacity * 0.3})`)
          glow.addColorStop(1, 'transparent')
          ctx.fillStyle = glow
          ctx.fillRect(star.x - star.size * 3, star.y - star.size * 3, star.size * 6, star.size * 6)
        }
      })
    }
    
    // Initialize and update comet
    const updateComet = () => {
      const currentTime = Date.now()
      
      // Check if it's time for a new comet
      if (!comet && currentTime - lastCometTime > nextCometInterval) {
        // Create new comet
        const startSide = Math.random() > 0.5 ? 'left' : 'right'
        comet = {
          x: startSide === 'left' ? -50 : canvas.width + 50,
          y: Math.random() * canvas.height * 0.4 + 50,
          vx: startSide === 'left' ? 3 + Math.random() * 2 : -(3 + Math.random() * 2),
          vy: (Math.random() - 0.5) * 1.5,
          size: 2 + Math.random() * 2,
          tailLength: 40 + Math.random() * 30,
          brightness: 0.7 + Math.random() * 0.3,
          trail: []
        }
        lastCometTime = currentTime
        nextCometInterval = 30000 + Math.random() * 60000 // Next comet in 30-90 seconds
      }
      
      // Update existing comet
      if (comet) {
        comet.x += comet.vx
        comet.y += comet.vy
        
        // Add to trail
        comet.trail.push({ x: comet.x, y: comet.y })
        if (comet.trail.length > comet.tailLength) {
          comet.trail.shift()
        }
        
        // Remove comet when off screen
        if (comet.x < -100 || comet.x > canvas.width + 100 || 
            comet.y < -100 || comet.y > canvas.height + 100) {
          comet = null
        }
      }
    }
    
    // Draw comet
    const drawComet = () => {
      if (!comet) return
      
      ctx.save()
      
      // Draw trail
      comet.trail.forEach((point, i) => {
        const progress = i / comet!.trail.length
        const opacity = progress * comet!.brightness * 0.6
        const size = comet!.size * (1 - progress * 0.8)
        
        // Trail glow
        const glowGradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size * 4)
        glowGradient.addColorStop(0, `hsla(200, 100%, 80%, ${opacity * 0.5})`)
        glowGradient.addColorStop(0.5, `hsla(190, 100%, 70%, ${opacity * 0.3})`)
        glowGradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(point.x, point.y, size * 4, 0, Math.PI * 2)
        ctx.fill()
        
        // Trail core
        ctx.fillStyle = `hsla(200, 100%, 90%, ${opacity})`
        ctx.beginPath()
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
        ctx.fill()
      })
      
      // Draw comet head
      // Bright glow
      const headGlow = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, comet.size * 6)
      headGlow.addColorStop(0, `hsla(60, 100%, 95%, ${comet.brightness})`)
      headGlow.addColorStop(0.3, `hsla(200, 100%, 85%, ${comet.brightness * 0.6})`)
      headGlow.addColorStop(0.6, `hsla(190, 100%, 75%, ${comet.brightness * 0.3})`)
      headGlow.addColorStop(1, 'transparent')
      
      ctx.fillStyle = headGlow
      ctx.beginPath()
      ctx.arc(comet.x, comet.y, comet.size * 6, 0, Math.PI * 2)
      ctx.fill()
      
      // Core
      ctx.fillStyle = `hsla(60, 100%, 100%, ${comet.brightness})`
      ctx.beginPath()
      ctx.arc(comet.x, comet.y, comet.size, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }

    // Draw realistic sun with proper positioning
    const drawSun = (sun: {altitude: number, azimuth: number}) => {
      if (sun.altitude < -10) return // Don't draw if well below horizon
      
      // Convert altitude/azimuth to x/y position
      const x = canvas.width * (sun.azimuth / 360)
      const y = canvas.height * (0.5 - sun.altitude / 90)
      
      const sunRadius = 30 + Math.abs(sun.altitude) / 3
      
      ctx.save()
      
      // Sun rays (only during day)
      if (sun.altitude > 0) {
        for (let i = 0; i < 16; i++) {
          const angle = (i / 16) * Math.PI * 2 + time * 0.001
          const rayLength = sunRadius + 30 + Math.sin(time * 0.01 + i) * 15
          
          const gradient = ctx.createLinearGradient(
            x + Math.cos(angle) * sunRadius,
            y + Math.sin(angle) * sunRadius,
            x + Math.cos(angle) * rayLength,
            y + Math.sin(angle) * rayLength
          )
          gradient.addColorStop(0, `hsla(45, 100%, 60%, ${0.4})`)
          gradient.addColorStop(1, 'transparent')
          
          ctx.strokeStyle = gradient
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(x + Math.cos(angle) * sunRadius, y + Math.sin(angle) * sunRadius)
          ctx.lineTo(x + Math.cos(angle) * rayLength, y + Math.sin(angle) * rayLength)
          ctx.stroke()
        }
      }
      
      // Sun glow
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, sunRadius * 3)
      if (sun.altitude > 0) {
        // Daytime colors
        glowGradient.addColorStop(0, 'hsla(45, 100%, 65%, 0.6)')
        glowGradient.addColorStop(0.3, 'hsla(45, 100%, 60%, 0.3)')
        glowGradient.addColorStop(1, 'transparent')
      } else {
        // Sunset/sunrise colors
        glowGradient.addColorStop(0, 'hsla(15, 100%, 50%, 0.6)')
        glowGradient.addColorStop(0.3, 'hsla(25, 100%, 45%, 0.3)')
        glowGradient.addColorStop(1, 'transparent')
      }
      
      ctx.fillStyle = glowGradient
      ctx.beginPath()
      ctx.arc(x, y, sunRadius * 3, 0, Math.PI * 2)
      ctx.fill()
      
      // Sun body with realistic coloring
      const sunGradient = ctx.createRadialGradient(x, y, 0, x, y, sunRadius)
      if (sun.altitude > 0) {
        sunGradient.addColorStop(0, 'hsl(45, 100%, 75%)')
        sunGradient.addColorStop(0.5, 'hsl(45, 100%, 65%)')
        sunGradient.addColorStop(1, 'hsl(45, 100%, 55%)')
      } else {
        // Sunset colors
        sunGradient.addColorStop(0, 'hsl(20, 100%, 65%)')
        sunGradient.addColorStop(0.5, 'hsl(20, 100%, 55%)')
        sunGradient.addColorStop(1, 'hsl(15, 100%, 45%)')
      }
      
      ctx.fillStyle = sunGradient
      ctx.beginPath()
      ctx.arc(x, y, sunRadius, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }

    // Draw moon with phases
    const drawMoon = (moon: {altitude: number, azimuth: number, phase: number}, isDay: boolean) => {
      if (moon.altitude < 0) return // Don't draw if below horizon
      
      const x = canvas.width * (moon.azimuth / 360)
      const y = canvas.height * (0.5 - moon.altitude / 90)
      const moonRadius = 25
      
      ctx.save()
      
      // Moon glow
      const glowIntensity = isDay ? 0.2 : 0.5
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, moonRadius * 2)
      glowGradient.addColorStop(0, `hsla(220, 20%, 85%, ${glowIntensity})`)
      glowGradient.addColorStop(1, 'transparent')
      
      ctx.fillStyle = glowGradient
      ctx.beginPath()
      ctx.arc(x, y, moonRadius * 2, 0, Math.PI * 2)
      ctx.fill()
      
      // Moon body
      ctx.fillStyle = isDay ? 'hsla(220, 20%, 85%, 0.5)' : 'hsla(220, 20%, 85%, 0.9)'
      ctx.beginPath()
      ctx.arc(x, y, moonRadius, 0, Math.PI * 2)
      ctx.fill()
      
      // Moon phase shadow
      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, moonRadius, 0, Math.PI * 2)
      ctx.clip()
      
      if (moon.phase < 0.5) {
        // Waxing - shadow on left
        const shadowX = x - moonRadius + (moon.phase * 2 * moonRadius)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.fillRect(x - moonRadius, y - moonRadius, shadowX - (x - moonRadius), moonRadius * 2)
      } else {
        // Waning - shadow on right
        const shadowX = x - moonRadius + ((moon.phase - 0.5) * 2 * moonRadius)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.fillRect(shadowX, y - moonRadius, x + moonRadius - shadowX, moonRadius * 2)
      }
      
      ctx.restore()
      
      // Moon craters for detail
      ctx.fillStyle = 'hsla(220, 20%, 75%, 0.5)'
      ctx.beginPath()
      ctx.arc(x - moonRadius * 0.3, y - moonRadius * 0.2, moonRadius * 0.15, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(x + moonRadius * 0.2, y + moonRadius * 0.3, moonRadius * 0.1, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }

    // Draw realistic clouds
    const drawClouds = (isDay: boolean) => {
      type ExtendedCloud = Cloud & {puffs?: Array<{offsetX: number, offsetY: number, size: number}>, isNearMountains: boolean, type: string}
      (clouds as ExtendedCloud[]).forEach((cloud) => {
        // Mountain clouds move very slowly, others move normally
        const windEffect = cloud.isNearMountains ? windStrength * 0.02 : windStrength * 0.2
        cloud.x += cloud.speed + windEffect
        if (cloud.x > canvas.width + cloud.size * 2) {
          cloud.x = -cloud.size * 2
          cloud.y = cloud.isNearMountains ? 
            canvas.height * 0.4 + Math.random() * 100 : 
            50 + Math.random() * 150
        }
        
        ctx.save()
        
        // Special rendering for mountain fog/mist
        if (cloud.isNearMountains) {
          const brightness = isDay ? 98 : 85
          
          // Very subtle, stretched fog effect
          for (let layer = 0; layer < 3; layer++) {
            const stretch = 4 + layer * 1.5
            const yOffset = layer * cloud.size * 0.05
            const layerOpacity = cloud.opacity * (0.5 - layer * 0.15)
            
            const fogGradient = ctx.createLinearGradient(
              cloud.x - cloud.size * stretch, 
              cloud.y + yOffset,
              cloud.x + cloud.size * stretch, 
              cloud.y + yOffset
            )
            fogGradient.addColorStop(0, 'transparent')
            fogGradient.addColorStop(0.15, `hsla(200, 10%, ${brightness}%, ${layerOpacity * 0.5})`)
            fogGradient.addColorStop(0.5, `hsla(200, 10%, ${brightness - 2}%, ${layerOpacity})`)
            fogGradient.addColorStop(0.85, `hsla(200, 10%, ${brightness}%, ${layerOpacity * 0.5})`)
            fogGradient.addColorStop(1, 'transparent')
            
            ctx.fillStyle = fogGradient
            ctx.beginPath()
            ctx.ellipse(
              cloud.x, 
              cloud.y + yOffset, 
              cloud.size * stretch, 
              cloud.size * 0.08, 
              Math.sin(time * 0.0005 + layer) * 0.05, 
              0, 
              Math.PI * 2
            )
            ctx.fill()
          }
        } else if (cloud.type === 'cumulus') {
          // Fluffy cumulus clouds with multiple layers for depth
          const brightness = isDay ? 100 : 75
          
          // Shadow layer (bottom)
          cloud.puffs?.forEach((puff) => {
            const puffX = cloud.x + puff.offsetX
            const puffY = cloud.y + puff.offsetY + 5
            const puffSize = cloud.size * puff.size * 0.9
            
            const shadowGradient = ctx.createRadialGradient(puffX, puffY, 0, puffX, puffY, puffSize)
            shadowGradient.addColorStop(0, `hsla(220, 20%, ${brightness - 30}%, ${cloud.opacity * 0.3})`)
            shadowGradient.addColorStop(0.7, `hsla(220, 20%, ${brightness - 25}%, ${cloud.opacity * 0.2})`)
            shadowGradient.addColorStop(1, 'transparent')
            
            ctx.fillStyle = shadowGradient
            ctx.beginPath()
            ctx.arc(puffX, puffY, puffSize, 0, Math.PI * 2)
            ctx.fill()
          })
          
          // Main cloud body
          cloud.puffs?.forEach((puff) => {
            const puffX = cloud.x + puff.offsetX
            const puffY = cloud.y + puff.offsetY
            const puffSize = cloud.size * puff.size
            
            // Create gradient for each puff
            const puffGradient = ctx.createRadialGradient(
              puffX - puffSize * 0.3, 
              puffY - puffSize * 0.3, 
              0,
              puffX, 
              puffY, 
              puffSize
            )
            puffGradient.addColorStop(0, `hsla(0, 0%, ${brightness}%, ${cloud.opacity * 0.9})`)
            puffGradient.addColorStop(0.4, `hsla(0, 0%, ${brightness - 5}%, ${cloud.opacity * 0.7})`)
            puffGradient.addColorStop(0.8, `hsla(0, 0%, ${brightness - 10}%, ${cloud.opacity * 0.4})`)
            puffGradient.addColorStop(1, 'transparent')
            
            ctx.fillStyle = puffGradient
            ctx.beginPath()
            ctx.arc(puffX, puffY, puffSize, 0, Math.PI * 2)
            ctx.fill()
          })
          
          // Highlights (top layer)
          cloud.puffs?.forEach((puff) => {
            const puffX = cloud.x + puff.offsetX
            const puffY = cloud.y + puff.offsetY - 5
            const puffSize = cloud.size * puff.size * 0.6
            
            const highlightGradient = ctx.createRadialGradient(puffX, puffY, 0, puffX, puffY, puffSize)
            highlightGradient.addColorStop(0, `hsla(0, 0%, ${brightness + 5}%, ${cloud.opacity * 0.5})`)
            highlightGradient.addColorStop(0.5, `hsla(0, 0%, ${brightness}%, ${cloud.opacity * 0.2})`)
            highlightGradient.addColorStop(1, 'transparent')
            
            ctx.fillStyle = highlightGradient
            ctx.beginPath()
            ctx.arc(puffX, puffY, puffSize, 0, Math.PI * 2)
            ctx.fill()
          })
          
        } else {
          // Wispy stratus clouds
          const brightness = isDay ? 95 : 70
          
          // Draw multiple wispy layers
          for (let layer = 0; layer < 4; layer++) {
            const stretch = 3 + layer * 0.8
            const yOffset = layer * cloud.size * 0.08
            const layerOpacity = cloud.opacity * (0.3 - layer * 0.07)
            
            // Create gradient for wispy effect
            const wispGradient = ctx.createLinearGradient(
              cloud.x - cloud.size * stretch, 
              cloud.y + yOffset,
              cloud.x + cloud.size * stretch, 
              cloud.y + yOffset
            )
            wispGradient.addColorStop(0, 'transparent')
            wispGradient.addColorStop(0.2, `hsla(0, 0%, ${brightness}%, ${layerOpacity})`)
            wispGradient.addColorStop(0.5, `hsla(0, 0%, ${brightness - 5}%, ${layerOpacity * 0.8})`)
            wispGradient.addColorStop(0.8, `hsla(0, 0%, ${brightness}%, ${layerOpacity})`)
            wispGradient.addColorStop(1, 'transparent')
            
            ctx.fillStyle = wispGradient
            ctx.beginPath()
            ctx.ellipse(
              cloud.x, 
              cloud.y + yOffset, 
              cloud.size * stretch, 
              cloud.size * 0.15, 
              Math.sin(time * 0.001 + layer) * 0.1, 
              0, 
              Math.PI * 2
            )
            ctx.fill()
          }
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
          case 'butterfly': {
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
          }
            
          case 'bird': {
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
          }
            
          case 'dragonfly': {
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
          }
            
          case 'fairy': {
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
        }
        
        ctx.restore()
      })
    }

    // Draw ground animals
    const drawAnimals = () => {
      animals.forEach((animal) => {
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
    const drawGround = (isDay: boolean) => {
      const lightness = isDay ? 25 : 15
      // Ground gradient
      const groundGradient = ctx.createLinearGradient(0, canvas.height - 100, 0, canvas.height)
      groundGradient.addColorStop(0, `hsla(90, 40%, ${lightness + 5}%, 0.9)`)
      groundGradient.addColorStop(1, `hsla(30, 30%, ${lightness}%, 0.9)`)
      
      ctx.fillStyle = groundGradient
      ctx.fillRect(0, canvas.height - 100, canvas.width, 100)
      
      // Grass blades
      ctx.strokeStyle = `hsla(90, 50%, ${lightness + 10}%, 0.7)`
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
    
    // Draw sky based on sun position
    const drawSky = (isDay: boolean, twilight: boolean, sunAltitude: number) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      
      if (isDay) {
        // Day sky - varies with sun altitude
        const brightness = Math.max(0, Math.min(1, (sunAltitude + 10) / 70))
        gradient.addColorStop(0, `hsl(200, 70%, ${20 + brightness * 40}%)`)
        gradient.addColorStop(0.3, `hsl(190, 65%, ${30 + brightness * 40}%)`)
        gradient.addColorStop(1, `hsl(180, 60%, ${40 + brightness * 35}%)`)
      } else if (twilight) {
        // Twilight colors
        const twilightProgress = (sunAltitude + 18) / 18
        gradient.addColorStop(0, `hsl(240, 70%, ${5 + twilightProgress * 15}%)`)
        gradient.addColorStop(0.3, `hsl(20, 60%, ${10 + twilightProgress * 30}%)`)
        gradient.addColorStop(0.6, `hsl(30, 50%, ${15 + twilightProgress * 25}%)`)
        gradient.addColorStop(1, `hsl(200, 40%, ${20 + twilightProgress * 20}%)`)
      } else {
        // Night sky
        gradient.addColorStop(0, 'hsl(240, 80%, 2%)')
        gradient.addColorStop(0.5, 'hsl(240, 70%, 5%)')
        gradient.addColorStop(1, 'hsl(220, 60%, 10%)')
      }
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    let animationId: number

    const animate = () => {
      time++
      
      // Get current astronomical positions based on real time and location
      const now = new Date()
      const astro = getSunMoonPosition(now, userLatitude)
      
      // Determine if it's day, twilight, or night based on sun altitude
      const isDay = astro.sun.altitude > 0
      const twilight = astro.sun.altitude > -18 && astro.sun.altitude <= 0
      
      // Draw sky with proper coloring based on sun position
      drawSky(isDay, twilight, astro.sun.altitude)
      
      // Draw stars if it's night
      if (!isDay) {
        drawStars()
        // Update and draw comet at night
        updateComet()
        drawComet()
      }
      
      // Draw sun and moon based on their calculated positions
      drawSun(astro.sun)
      drawMoon(astro.moon, isDay)
      
      // Wind effect
      if (Math.random() > 0.98) {
        windTarget = (Math.random() - 0.5) * 1.5
      }
      windStrength += (windTarget - windStrength) * 0.02

      // Draw scene layers (back to front)
      drawClouds(isDay)
      drawMountains(isDay, astro.sun.altitude)
      
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
      drawGround(isDay)
      drawAnimals()

      animationId = requestAnimationFrame(animate)
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
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [canvasRef, intensity])

  return null
}