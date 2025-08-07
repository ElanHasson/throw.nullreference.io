import { PondConfig, Vegetation, Fish, WaterSplash } from './types'

export class Pond {
  private config: PondConfig
  private vegetation: Vegetation[] = []
  private fish: Fish[] = []
  private splashes: WaterSplash[] = []

  constructor(private ctx: CanvasRenderingContext2D, private canvas: HTMLCanvasElement) {
    // Larger pond with organic shape
    const minWidth = 300
    const maxWidth = 450
    const minHeight = 150
    const maxHeight = 200
    
    const width = minWidth + Math.random() * (maxWidth - minWidth)
    const height = minHeight + Math.random() * (maxHeight - minHeight)
    
    // Position pond to stay within grass area (grass starts at 0.7 of canvas height)
    // Account for pond size to prevent it going off screen
    const halfWidth = width / 2
    const halfHeight = height / 2
    
    // Ensure pond stays within grass boundaries and away from horizon
    const xMin = halfWidth + 100 // Left margin increased
    const xMax = this.canvas.width - halfWidth - 100 // Right margin increased
    const yMin = this.canvas.height * 0.75 // Lower in grass area
    const yMax = this.canvas.height * 0.85 // Keep away from bottom
    
    this.config = {
      x: xMin + Math.random() * (xMax - xMin),
      y: yMin + Math.random() * (yMax - yMin),
      width: width,
      height: height,
      rotation: Math.PI * 0.1,
      shape: Array(16).fill(0).map((_, i) => {
        // Create more organic pond shape with varying thickness
        const angle = (i / 16) * Math.PI * 2
        // Make pond thicker in some areas, thinner in others
        const baseRadius = 0.9
        const variation = Math.sin(angle * 2) * 0.3 + Math.cos(angle * 3) * 0.2
        return baseRadius + variation + Math.random() * 0.15
      })
    }
    
    this.generatePondVegetation()
    this.initializeFish()
  }

  private generatePondVegetation() {
    // Calculate pond area to determine vegetation density
    const pondArea = (this.config.width * this.config.height * Math.PI) / 4
    const areaFactor = pondArea / 50000 // Normalize based on typical pond size
    
    // Lily pads - proportionate to pond size (0.02-0.04 per unit area)
    const minLilyPadRatio = 0.02
    const maxLilyPadRatio = 0.04
    const lilyPadRatio = minLilyPadRatio + Math.random() * (maxLilyPadRatio - minLilyPadRatio)
    const lilyPadCount = Math.floor(areaFactor * lilyPadRatio * 500)
    
    for (let i = 0; i < lilyPadCount; i++) {
      // Spread lily pads more evenly across the pond
      const angle = (Math.PI * 2 / lilyPadCount) * i + (Math.random() - 0.5) * 0.8
      // Use elliptical distribution for organic pond shape
      const radiusX = this.config.width * 0.4
      const radiusY = this.config.height * 0.35
      // Vary radius more to avoid clustering in center
      const distance = 0.2 + Math.random() * 0.7 // 20-90% of max radius
      
      this.vegetation.push({
        x: this.config.x + Math.cos(angle) * radiusX * distance,
        y: this.config.y + Math.sin(angle) * radiusY * distance,
        type: 'lilypad',
        size: 0.6 + Math.random() * 0.4,
        swayPhase: Math.random() * Math.PI * 2,
        hasFlower: false,
        flowerPhase: 0
      })
    }
    
    // Cattails - proportionate to pond perimeter (0.015-0.03 per unit perimeter)
    const pondPerimeter = Math.PI * Math.sqrt(2 * (this.config.width * this.config.width + this.config.height * this.config.height))
    const perimeterFactor = pondPerimeter / 800
    const minCattailRatio = 0.015
    const maxCattailRatio = 0.03
    const cattailRatio = minCattailRatio + Math.random() * (maxCattailRatio - minCattailRatio)
    const cattailCount = Math.floor(perimeterFactor * cattailRatio * 400)
    
    for (let i = 0; i < cattailCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const inWater = Math.random() > 0.6
      const edgeRadius = Math.max(this.config.width, this.config.height) * 0.5
      const radius = inWater ? 
        edgeRadius * (0.6 + Math.random() * 0.2) : 
        edgeRadius * (0.8 + Math.random() * 0.2)
      
      this.vegetation.push({
        x: this.config.x + Math.cos(angle) * radius,
        y: this.config.y + Math.sin(angle) * radius * 0.7,
        type: 'cattail',
        size: 0.5 + Math.random() * 0.7,
        swayPhase: Math.random() * Math.PI * 2,
        inWater
      })
    }
  }

  private initializeFish() {
    for (let i = 0; i < 3; i++) {
      this.fish.push({
        pondX: Math.random() * this.config.width - this.config.width/2,
        jumpTime: Math.random() * 1000,
        jumpHeight: 0,
        splashPhase: 0,
        active: false
      })
    }
  }

  update(simulateTime: boolean) {
    // Update lily pad flowers
    this.vegetation.forEach(veg => {
      if (veg.type === 'lilypad' && !veg.hasFlower && Math.random() > 0.999) {
        veg.hasFlower = true
        veg.flowerPhase = 0
      }
      
      if (veg.hasFlower && veg.flowerPhase !== undefined) {
        veg.flowerPhase = Math.min(veg.flowerPhase + 0.01, 1)
      }
    })
    
    // Update fish jumping
    const time = simulateTime ? Date.now() * 60 : Date.now()
    this.fish.forEach(fish => {
      if (!fish.active && Math.random() > 0.995) {
        fish.active = true
        fish.jumpTime = 0
        fish.pondX = (Math.random() - 0.5) * this.config.width * 0.8
        fish.splashPhase = 0
      }
      
      if (fish.active) {
        fish.jumpTime += 16
        const jumpProgress = fish.jumpTime / 1000
        
        if (jumpProgress < 1) {
          fish.jumpHeight = Math.sin(jumpProgress * Math.PI) * 30
          
          if (jumpProgress > 0.5 && fish.splashPhase === 0) {
            fish.splashPhase = 1
            this.createSplash(
              this.config.x + fish.pondX,
              this.config.y
            )
          }
        } else {
          fish.active = false
        }
      }
    })
    
    // Update splashes - smaller and faster dissipation
    this.splashes = this.splashes.filter(splash => {
      splash.radius += 1  // Slower expansion for smaller splash
      splash.opacity *= 0.92  // Faster fade
      
      splash.ripples.forEach(ripple => {
        ripple.radius += 1.5  // Slower ripple expansion
        ripple.opacity *= 0.90  // Faster ripple fade
      })
      
      return splash.opacity > 0.05
    })
  }

  private createSplash(x: number, y: number) {
    this.splashes.push({
      x,
      y,
      radius: 3,  // Smaller initial radius
      opacity: 0.7,  // Slightly less opacity
      ripples: [
        { radius: 5, opacity: 0.5 },  // Smaller ripples
        { radius: 8, opacity: 0.3 }
      ]
    })
  }

  draw() {
    this.ctx.save()
    
    // Draw pond with smooth organic shape
    const gradient = this.ctx.createRadialGradient(
      this.config.x, this.config.y, 0,
      this.config.x, this.config.y, Math.max(this.config.width, this.config.height) * 0.6
    )
    gradient.addColorStop(0, 'hsla(200, 60%, 20%, 0.9)')
    gradient.addColorStop(0.5, 'hsla(200, 55%, 25%, 0.85)')
    gradient.addColorStop(1, 'hsla(200, 50%, 30%, 0.8)')
    
    this.ctx.fillStyle = gradient
    this.ctx.beginPath()
    
    // Create organic pond shape with natural irregularity
    const points: Array<{x: number, y: number}> = []
    const numPoints = this.config.shape.length
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (Math.PI * 2 / numPoints) * i
      // Use different width/height ratios for more natural shape
      const radiusX = this.config.width * 0.5 * this.config.shape[i]
      const radiusY = this.config.height * 0.5 * this.config.shape[i]
      
      // Add more variation on horizontal axis for organic look
      const xVariation = Math.sin(angle * 4) * 0.1 + Math.cos(angle * 7) * 0.05
      const yVariation = Math.sin(angle * 3) * 0.08
      
      const x = this.config.x + Math.cos(angle) * radiusX * (1 + xVariation)
      const y = this.config.y + Math.sin(angle) * radiusY * (0.6 + yVariation)
      points.push({x, y})
    }
    
    // Draw smooth organic pond shape
    this.ctx.moveTo(points[0].x, points[0].y)
    
    for (let i = 0; i < points.length; i++) {
      const current = points[i]
      const next = points[(i + 1) % points.length]
      const next2 = points[(i + 2) % points.length]
      const prev = points[(i - 1 + points.length) % points.length]
      
      // Create smooth organic curves for natural pond shape
      const cp1x = current.x + (next.x - prev.x) * 0.25
      const cp1y = current.y + (next.y - prev.y) * 0.25
      const cp2x = next.x - (next2.x - current.x) * 0.25
      const cp2y = next.y - (next2.y - current.y) * 0.25
      
      this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y)
    }
    
    this.ctx.closePath()
    this.ctx.fill()
    
    // Water shimmer
    this.ctx.strokeStyle = 'hsla(200, 70%, 60%, 0.2)'
    this.ctx.lineWidth = 1
    for (let i = 0; i < 5; i++) {
      const shimmerAngle = Date.now() * 0.001 + i
      const shimmerX = this.config.x + Math.cos(shimmerAngle) * 30
      const shimmerY = this.config.y + Math.sin(shimmerAngle) * 20
      
      this.ctx.beginPath()
      this.ctx.moveTo(shimmerX - 10, shimmerY)
      this.ctx.lineTo(shimmerX + 10, shimmerY)
      this.ctx.stroke()
    }
    
    // Draw vegetation
    this.drawVegetation()
    
    // Draw fish
    this.drawFish()
    
    // Draw splashes
    this.drawSplashes()
    
    this.ctx.restore()
  }

  private drawVegetation() {
    this.vegetation.forEach(veg => {
      const sway = Math.sin(Date.now() * 0.001 + veg.swayPhase) * 2
      
      this.ctx.save()
      this.ctx.translate(veg.x + sway, veg.y)
      
      if (veg.type === 'lilypad') {
        // Lily pad with texture
        const padGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 15 * veg.size)
        padGradient.addColorStop(0, 'hsla(120, 40%, 30%, 0.9)')
        padGradient.addColorStop(0.7, 'hsla(120, 45%, 25%, 0.9)')
        padGradient.addColorStop(1, 'hsla(120, 35%, 20%, 0.9)')
        
        this.ctx.fillStyle = padGradient
        this.ctx.beginPath()
        
        // Create lily pad shape with notch
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
          const notch = angle > Math.PI * 0.9 && angle < Math.PI * 1.1
          const radius = notch ? 8 * veg.size : 15 * veg.size
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          
          if (angle === 0) {
            this.ctx.moveTo(x, y)
          } else {
            this.ctx.lineTo(x, y)
          }
        }
        
        this.ctx.closePath()
        this.ctx.fill()
        
        // Pad texture - veins
        this.ctx.strokeStyle = 'hsla(120, 30%, 20%, 0.3)'
        this.ctx.lineWidth = 0.5
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI * 2 / 6) * i
          this.ctx.beginPath()
          this.ctx.moveTo(0, 0)
          this.ctx.lineTo(Math.cos(angle) * 12 * veg.size, Math.sin(angle) * 12 * veg.size)
          this.ctx.stroke()
        }
        
        // Flower
        if (veg.hasFlower && veg.flowerPhase) {
          const flowerSize = 5 * veg.size * veg.flowerPhase
          
          // Petals
          this.ctx.fillStyle = 'hsla(320, 60%, 85%, 0.9)'
          for (let i = 0; i < 6; i++) {
            const petalAngle = (Math.PI * 2 / 6) * i
            const petalX = Math.cos(petalAngle) * flowerSize
            const petalY = Math.sin(petalAngle) * flowerSize
            
            this.ctx.beginPath()
            this.ctx.arc(petalX, petalY, flowerSize * 0.6, 0, Math.PI * 2)
            this.ctx.fill()
          }
          
          // Center
          this.ctx.fillStyle = 'hsla(50, 70%, 60%, 0.9)'
          this.ctx.beginPath()
          this.ctx.arc(0, 0, flowerSize * 0.4, 0, Math.PI * 2)
          this.ctx.fill()
        }
      } else if (veg.type === 'cattail') {
        // Cattail stem
        const height = 40 * veg.size
        this.ctx.strokeStyle = 'hsla(110, 30%, 30%, 0.9)'
        this.ctx.lineWidth = 2 * veg.size
        this.ctx.beginPath()
        this.ctx.moveTo(0, 0)
        this.ctx.quadraticCurveTo(sway * 2, -height/2, sway * 3, -height)
        this.ctx.stroke()
        
        // Cattail head
        this.ctx.fillStyle = 'hsla(30, 50%, 30%, 0.9)'
        this.ctx.save()
        this.ctx.translate(sway * 3, -height)
        this.ctx.beginPath()
        this.ctx.ellipse(0, 0, 3 * veg.size, 8 * veg.size, 0, 0, Math.PI * 2)
        this.ctx.fill()
        this.ctx.restore()
        
        // If in water, add ripples
        if (veg.inWater) {
          this.ctx.strokeStyle = 'hsla(200, 60%, 40%, 0.2)'
          this.ctx.lineWidth = 1
          this.ctx.beginPath()
          this.ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2)
          this.ctx.stroke()
        }
      }
      
      this.ctx.restore()
    })
  }

  private drawFish() {
    this.fish.forEach(fish => {
      if (fish.active) {
        this.ctx.save()
        this.ctx.translate(this.config.x + fish.pondX, this.config.y - fish.jumpHeight)
        
        // Fish body
        this.ctx.fillStyle = 'hsla(200, 50%, 50%, 0.9)'
        this.ctx.beginPath()
        this.ctx.ellipse(0, 0, 8, 4, Math.PI * 0.2, 0, Math.PI * 2)
        this.ctx.fill()
        
        // Tail
        this.ctx.beginPath()
        this.ctx.moveTo(5, 0)
        this.ctx.lineTo(10, -3)
        this.ctx.lineTo(10, 3)
        this.ctx.closePath()
        this.ctx.fill()
        
        this.ctx.restore()
      }
    })
  }

  private drawSplashes() {
    this.splashes.forEach(splash => {
      // Main splash circle - thinner line for smaller effect
      this.ctx.strokeStyle = `hsla(200, 70%, 70%, ${splash.opacity})`
      this.ctx.lineWidth = 1.2
      
      this.ctx.beginPath()
      this.ctx.arc(splash.x, splash.y, splash.radius, 0, Math.PI * 2)
      this.ctx.stroke()
      
      // Ripples - very thin lines
      splash.ripples.forEach(ripple => {
        this.ctx.strokeStyle = `hsla(200, 60%, 60%, ${ripple.opacity})`
        this.ctx.lineWidth = 0.6
        this.ctx.beginPath()
        this.ctx.arc(splash.x, splash.y, ripple.radius, 0, Math.PI * 2)
        this.ctx.stroke()
      })
    })
  }

  getPondConfig(): PondConfig {
    return this.config
  }

  createSplashAt(x: number, y: number) {
    this.createSplash(x, y)
  }
}