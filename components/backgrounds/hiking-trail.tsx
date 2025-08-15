'use client'

import { useEffect } from 'react'
import { getSunMoonPosition } from './hiking-trail/astronomy'
import { Landscape } from './hiking-trail/landscape'
import { Trees } from './hiking-trail/trees'
import { Pond } from './hiking-trail/pond'
import { Frogs } from './hiking-trail/frogs'
import { Creatures } from './hiking-trail/creatures'
import { GoatManager } from './hiking-trail/goat'

// Control panel state
let SIMULATE_TIME = true
let switchHovered = false
let mouseX = 0
let mouseY = 0

interface HikingTrailBackgroundProps {
  className?: string
}

export default function HikingTrailBackground({ className = '' }: HikingTrailBackgroundProps) {
  useEffect(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.className = className
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.zIndex = '-1'
    canvas.style.pointerEvents = 'auto' // Ensure canvas receives mouse events
    document.body.appendChild(canvas)

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize modules
    const landscape = new Landscape(ctx, canvas)
    const trees = new Trees(ctx, canvas)
    const pond = new Pond(ctx, canvas)
    const frogs = new Frogs(ctx, canvas, pond.getPondConfig(), (x, y) => pond.createSplashAt(x, y))
    const creatures = new Creatures(ctx, canvas, landscape.getMountainPath())
    const goatManager = new GoatManager(ctx, canvas)

    // Animation state
    let animationId: number
    let currentDate = new Date()
    let simulatedDate = new Date() // Keep track of simulated time separately
    const timeSpeed = 60000

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      
      mouseX = (e.clientX - rect.left) * scaleX
      mouseY = (e.clientY - rect.top) * scaleY
      
      const switchX = canvas.width - 60
      const switchY = canvas.height - 40
      switchHovered = mouseX >= switchX - 25 && mouseX <= switchX + 25 && 
                      mouseY >= switchY - 15 && mouseY <= switchY + 15
      
      // Change cursor when hovering over switch
      canvas.style.cursor = switchHovered ? 'pointer' : 'default'
    }

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      
      const clickX = (e.clientX - rect.left) * scaleX
      const clickY = (e.clientY - rect.top) * scaleY
      
      const switchX = canvas.width - 60
      const switchY = canvas.height - 40
      
      // Increase click area slightly for better usability
      if (clickX >= switchX - 25 && clickX <= switchX + 25 && 
          clickY >= switchY - 15 && clickY <= switchY + 15) {
        SIMULATE_TIME = !SIMULATE_TIME
        // When switching to real time, sync the simulated date
        if (!SIMULATE_TIME) {
          simulatedDate = new Date()
        }
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('click', handleClick)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update time
      if (SIMULATE_TIME) {
        simulatedDate = new Date(simulatedDate.getTime() + timeSpeed)
        currentDate = simulatedDate
      } else {
        currentDate = new Date()
      }

      // Calculate sun and moon positions
      const { sun, moon } = getSunMoonPosition(currentDate, 40)
      const isDaytime = sun.altitude > -6
      const skyBrightness = Math.max(0, Math.min(1, (sun.altitude + 6) / 30))

      // Draw sky gradient
      drawSky(ctx, canvas, skyBrightness, isDaytime)

      // Draw celestial bodies
      drawCelestialBodies(ctx, canvas, sun, moon, landscape.getMountainPath())

      // Update and draw all components
      landscape.drawMountains()
      landscape.drawGround()
      
      // Pass pond config and trees to landscape before drawing trail
      landscape.setPondConfig(pond.getPondConfig())
      landscape.setTrees(trees.getTrees())
      landscape.drawTrail()
      
      // Pass trail path to creatures for hikers to follow
      creatures.setTrailPath(landscape.getTrailPath())

      trees.update()
      trees.draw()

      pond.update()
      pond.draw()

      frogs.update()
      frogs.draw()

      goatManager.update()
      goatManager.draw()

      creatures.update(SIMULATE_TIME, currentDate, skyBrightness, isDaytime, trees.getTrees())
      
      if (isDaytime) {
        creatures.drawDaytime()
      }
      
      // Draw hikers after grass layer (they walk on the trail)
      creatures.drawHikers()
      
      // Draw nighttime creatures last so they appear on top
      if (!isDaytime) {
        creatures.drawNighttime(skyBrightness)
      }

      // Draw time display
      drawTimeDisplay(ctx, canvas, currentDate, isDaytime)

      // Draw rocker switch
      drawRockerSwitch(ctx, canvas)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('click', handleClick)
      window.removeEventListener('resize', resize)
      document.body.removeChild(canvas)
    }
  }, [className])

  return null
}

function drawSky(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, skyBrightness: number, isDaytime: boolean) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  
  if (isDaytime) {
    const intensity = skyBrightness
    gradient.addColorStop(0, `hsla(200, 70%, ${50 * intensity}%, 1)`)
    gradient.addColorStop(0.6, `hsla(190, 60%, ${60 * intensity}%, 1)`)
    gradient.addColorStop(1, `hsla(30, 50%, ${70 * intensity + 20}%, 1)`)
  } else {
    gradient.addColorStop(0, `hsla(230, 60%, ${5 + skyBrightness * 10}%, 1)`)
    gradient.addColorStop(0.5, `hsla(240, 50%, ${10 + skyBrightness * 15}%, 1)`)
    gradient.addColorStop(1, `hsla(250, 40%, ${15 + skyBrightness * 20}%, 1)`)
  }
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawCelestialBodies(
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  sun: {altitude: number, azimuth: number}, 
  moon: {altitude: number, azimuth: number, phase: number, illumination: number},
  mountainPath: Path2D
) {
  // Sun
  if (sun.altitude > -10) {
    const sunX = canvas.width * (sun.azimuth / 360)
    const sunY = canvas.height * (1 - (sun.altitude + 10) / 100) * 0.8
    
    ctx.save()
    ctx.clip(mountainPath)
    
    const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 40)
    const intensity = Math.max(0, Math.min(1, (sun.altitude + 10) / 30))
    sunGradient.addColorStop(0, `hsla(50, 100%, ${70 * intensity}%, ${intensity})`)
    sunGradient.addColorStop(0.5, `hsla(40, 100%, ${60 * intensity}%, ${intensity * 0.8})`)
    sunGradient.addColorStop(1, `hsla(30, 100%, ${50 * intensity}%, 0)`)
    
    ctx.fillStyle = sunGradient
    ctx.beginPath()
    ctx.arc(sunX, sunY, 40, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }

  // Moon
  if (moon.altitude > 0) {
    const moonX = canvas.width * (moon.azimuth / 360)
    const moonY = canvas.height * (1 - moon.altitude / 90) * 0.5
    
    ctx.save()
    ctx.clip(mountainPath)
    
    ctx.fillStyle = `hsla(60, 20%, ${90 - moon.illumination * 20}%, ${0.8 - sun.altitude / 100})`
    ctx.beginPath()
    ctx.arc(moonX, moonY, 25, 0, Math.PI * 2)
    ctx.fill()
    
    // Moon phase shadow
    if (moon.phase !== 0.5) {
      ctx.fillStyle = `hsla(230, 30%, 10%, ${0.8 - sun.altitude / 100})`
      ctx.beginPath()
      
      const phaseAngle = moon.phase * Math.PI * 2
      const shadowOffset = Math.cos(phaseAngle) * 25
      
      if (moon.phase < 0.5) {
        ctx.arc(moonX - shadowOffset/2, moonY, 25, -Math.PI/2, Math.PI/2)
      } else {
        ctx.arc(moonX + shadowOffset/2, moonY, 25, Math.PI/2, -Math.PI/2)
      }
      ctx.fill()
    }
    
    // Moon craters
    ctx.fillStyle = `hsla(60, 10%, 70%, ${0.3 - sun.altitude / 200})`
    ctx.beginPath()
    ctx.arc(moonX - 8, moonY - 5, 3, 0, Math.PI * 2)
    ctx.arc(moonX + 7, moonY + 8, 2, 0, Math.PI * 2)
    ctx.arc(moonX - 3, moonY + 6, 4, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }
}

function drawTimeDisplay(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, date: Date, isDaytime: boolean) {
  const timeString = date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
  const dateString = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })

  ctx.fillStyle = `hsla(0, 0%, ${isDaytime ? 20 : 80}%, 0.8)`
  ctx.font = '14px monospace'
  ctx.textAlign = 'right'
  ctx.fillText(timeString, canvas.width - 20, 30)
  ctx.fillText(dateString, canvas.width - 20, 48)
  ctx.fillText(SIMULATE_TIME ? '⏩ 60x' : '🕐 Real', canvas.width - 20, 66)
}

function drawRockerSwitch(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const switchX = canvas.width - 60
  const switchY = canvas.height - 40
  
  // Switch background
  ctx.fillStyle = switchHovered ? 'hsla(0, 0%, 30%, 0.9)' : 'hsla(0, 0%, 20%, 0.8)'
  ctx.strokeStyle = 'hsla(0, 0%, 50%, 0.8)'
  ctx.lineWidth = 2
  
  // Draw rounded rectangle manually for better compatibility
  ctx.beginPath()
  const x = switchX - 20
  const y = switchY - 10
  const width = 40
  const height = 20
  const radius = 10
  
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
  
  ctx.fill()
  ctx.stroke()
  
  // Switch position indicator
  const indicatorX = SIMULATE_TIME ? switchX + 10 : switchX - 10
  
  ctx.fillStyle = SIMULATE_TIME ? 'hsla(120, 60%, 50%, 0.9)' : 'hsla(200, 60%, 50%, 0.9)'
  ctx.beginPath()
  ctx.arc(indicatorX, switchY, 6, 0, Math.PI * 2)
  ctx.fill()
  
  // Labels
  ctx.fillStyle = 'hsla(0, 0%, 80%, 0.8)'
  ctx.font = '10px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('SIM', switchX - 10, switchY + 4)
  ctx.fillText('REAL', switchX + 10, switchY + 4)
  
  // Hover effect
  if (switchHovered) {
    ctx.strokeStyle = 'hsla(0, 0%, 70%, 0.5)'
    ctx.lineWidth = 1
    ctx.beginPath()
    
    const hx = switchX - 22
    const hy = switchY - 12
    const hw = 44
    const hh = 24
    const hr = 12
    
    ctx.moveTo(hx + hr, hy)
    ctx.lineTo(hx + hw - hr, hy)
    ctx.quadraticCurveTo(hx + hw, hy, hx + hw, hy + hr)
    ctx.lineTo(hx + hw, hy + hh - hr)
    ctx.quadraticCurveTo(hx + hw, hy + hh, hx + hw - hr, hy + hh)
    ctx.lineTo(hx + hr, hy + hh)
    ctx.quadraticCurveTo(hx, hy + hh, hx, hy + hh - hr)
    ctx.lineTo(hx, hy + hr)
    ctx.quadraticCurveTo(hx, hy, hx + hr, hy)
    ctx.closePath()
    
    ctx.stroke()
  }
}