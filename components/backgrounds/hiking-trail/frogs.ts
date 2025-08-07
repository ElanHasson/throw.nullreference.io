import { Frog, Fly, WaterSplash, PondConfig } from './types'

export class Frogs {
  private frogs: Frog[] = []
  private flies: Fly[] = []

  constructor(
    private ctx: CanvasRenderingContext2D, 
    private canvas: HTMLCanvasElement,
    private pondConfig: PondConfig,
    private createSplash: (x: number, y: number) => void
  ) {
    this.initializeFrogs()
    this.initializeFlies()
  }

  private initializeFrogs() {
    const frogCount = 3 + Math.floor(Math.random() * 2)
    
    for (let i = 0; i < frogCount; i++) {
      // Spread frogs around the pond edge, but keep them inside
      const angle = (Math.PI * 2 / frogCount) * i + (Math.random() - 0.5) * 0.8
      // Position frogs inside pond boundaries
      const maxRadiusX = this.pondConfig.width * 0.35 // Stay well within pond
      const maxRadiusY = this.pondConfig.height * 0.3
      const distance = 0.5 + Math.random() * 0.3 // 50-80% of max radius
      const rockX = this.pondConfig.x + Math.cos(angle) * maxRadiusX * distance
      const rockY = this.pondConfig.y + Math.sin(angle) * maxRadiusY * distance
      
      this.frogs.push({
        x: rockX,
        y: rockY,
        rockX,
        rockY,
        size: 0.8 + Math.random() * 0.4,
        direction: Math.random() > 0.5 ? 1 : -1,
        tongueOut: false,
        tongueTarget: null,
        tongueLength: 0,
        catchCooldown: 0,
        animPhase: Math.random() * Math.PI * 2,
        isJumping: false,
        jumpVx: 0,
        jumpVy: 0,
        inWater: false,
        climbingBack: false,
        climbProgress: 0
      })
    }
  }

  private initializeFlies() {
    const flyCount = 15 + Math.floor(Math.random() * 10)
    
    for (let i = 0; i < flyCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = 30 + Math.random() * 100
      
      this.flies.push({
        x: this.pondConfig.x + Math.cos(angle) * distance,
        y: this.pondConfig.y + Math.sin(angle) * distance - 20 - Math.random() * 40,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 1.5,
        size: 2 + Math.random() * 2,
        alive: true,
        buzzPhase: Math.random() * Math.PI * 2,
        tauntTimer: 0,
        escapedFrom: null
      })
    }
  }

  update() {
    // Update flies
    this.flies.forEach(fly => {
      if (fly.alive) {
        // Buzz around pond area
        fly.x += fly.vx + Math.sin(Date.now() * 0.01 + fly.buzzPhase) * 0.5
        fly.y += fly.vy + Math.cos(Date.now() * 0.008 + fly.buzzPhase) * 0.3
        
        // Keep flies near pond
        const dx = fly.x - this.pondConfig.x
        const dy = fly.y - this.pondConfig.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance > 120) {
          fly.vx -= dx * 0.001
          fly.vy -= dy * 0.001
        }
        
        // Random direction changes
        if (Math.random() > 0.98) {
          fly.vx = (Math.random() - 0.5) * 2
          fly.vy = (Math.random() - 0.5) * 1.5
        }
        
        // Taunting behavior
        if (fly.escapedFrom && fly.tauntTimer > 0) {
          fly.tauntTimer--
          const tauntX = fly.escapedFrom.x + Math.cos(Date.now() * 0.1) * 20
          const tauntY = fly.escapedFrom.y - 30 + Math.sin(Date.now() * 0.1) * 10
          fly.vx += (tauntX - fly.x) * 0.01
          fly.vy += (tauntY - fly.y) * 0.01
          
          if (fly.tauntTimer === 0) {
            fly.escapedFrom = null
          }
        }
        
        fly.buzzPhase += 0.1
      }
    })
    
    // Update frogs
    this.frogs.forEach(frog => {
      if (frog.catchCooldown > 0) {
        frog.catchCooldown--
      }
      
      // Frog jumping behavior with limited height
      if (!frog.isJumping && !frog.inWater && !frog.climbingBack && Math.random() > 0.995) {
        frog.isJumping = true
        frog.jumpVx = (Math.random() - 0.5) * 3
        // Min jump height: -3, Max jump height: -5
        frog.jumpVy = -3 - Math.random() * 2
      }
      
      if (frog.isJumping) {
        frog.x += frog.jumpVx
        frog.y += frog.jumpVy
        frog.jumpVy += 0.3 // gravity
        
        // Check if landed back on rock or in water
        const onRock = Math.abs(frog.x - frog.rockX) < 20 && Math.abs(frog.y - frog.rockY) < 10
        const pondDx = frog.x - this.pondConfig.x
        const pondDy = frog.y - this.pondConfig.y
        // Account for elliptical shape with proper boundary check
        const normalizedDx = pondDx / (this.pondConfig.width * 0.45)
        const normalizedDy = pondDy / (this.pondConfig.height * 0.4)
        const inPondArea = (normalizedDx * normalizedDx + normalizedDy * normalizedDy) < 1
        
        if (frog.y >= frog.rockY) {
          if (onRock) {
            frog.isJumping = false
            frog.x = frog.rockX
            frog.y = frog.rockY
            frog.jumpVx = 0
            frog.jumpVy = 0
          } else if (inPondArea) {
            frog.isJumping = false
            frog.inWater = true
            frog.jumpVx = 0
            frog.jumpVy = 0
            this.createSplash(frog.x, frog.y)
          }
        }
      }
      
      // Climbing back to rock from water
      if (frog.inWater && !frog.climbingBack && Math.random() > 0.98) {
        frog.climbingBack = true
        frog.climbProgress = 0
      }
      
      if (frog.climbingBack) {
        frog.climbProgress += 0.02
        if (frog.climbProgress >= 1) {
          frog.x = frog.rockX
          frog.y = frog.rockY
          frog.inWater = false
          frog.climbingBack = false
          frog.climbProgress = 0
        } else {
          frog.x = frog.x + (frog.rockX - frog.x) * 0.05
          frog.y = frog.y + (frog.rockY - frog.y) * 0.05
        }
      }
      
      // Tongue mechanics
      if (!frog.tongueOut && frog.catchCooldown === 0 && !frog.isJumping && !frog.inWater) {
        // Find nearest fly
        let nearestFly: Fly | null = null
        let nearestDistance = 60 // max tongue reach
        
        this.flies.forEach(fly => {
          if (fly.alive && !fly.escapedFrom) {
            const dx = fly.x - frog.x
            const dy = fly.y - frog.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < nearestDistance) {
              nearestDistance = distance
              nearestFly = fly
            }
          }
        })
        
        if (nearestFly) {
          frog.tongueOut = true
          frog.tongueTarget = nearestFly
          frog.tongueLength = 0
        }
      }
      
      if (frog.tongueOut && frog.tongueTarget) {
        const maxLength = 50
        frog.tongueLength = Math.min(frog.tongueLength + 8, maxLength)
        
        const dx = frog.tongueTarget.x - frog.x
        const dy = frog.tongueTarget.y - frog.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (frog.tongueLength >= distance && frog.tongueTarget.alive) {
          // Successful catch
          frog.tongueTarget.alive = false
          frog.tongueOut = false
          frog.catchCooldown = 60
          
          // Respawn fly
          setTimeout(() => {
            const fly = frog.tongueTarget
            if (fly) {
              fly.alive = true
              fly.x = this.pondConfig.x + (Math.random() - 0.5) * 150
              fly.y = this.pondConfig.y - 40 + (Math.random() - 0.5) * 60
            }
          }, 3000)
        } else if (frog.tongueLength >= maxLength) {
          // Missed - fly escapes
          if (Math.random() > 0.5) {
            frog.tongueTarget.escapedFrom = frog
            frog.tongueTarget.tauntTimer = 120
          }
          frog.tongueOut = false
          frog.catchCooldown = 30
        }
      } else if (frog.tongueOut) {
        frog.tongueOut = false
      }
      
      frog.animPhase += 0.05
    })
  }

  draw() {
    // Draw flies
    this.flies.forEach(fly => {
      if (fly.alive) {
        this.ctx.save()
        this.ctx.translate(fly.x, fly.y)
        
        // Wings
        const wingSpread = Math.sin(fly.buzzPhase * 5) * 3
        this.ctx.fillStyle = 'hsla(0, 0%, 80%, 0.4)'
        this.ctx.beginPath()
        this.ctx.ellipse(-wingSpread, 0, 3, 1, -0.2, 0, Math.PI * 2)
        this.ctx.ellipse(wingSpread, 0, 3, 1, 0.2, 0, Math.PI * 2)
        this.ctx.fill()
        
        // Body
        this.ctx.fillStyle = 'hsla(0, 0%, 20%, 0.9)'
        this.ctx.beginPath()
        this.ctx.ellipse(0, 0, fly.size * 0.8, fly.size, 0, 0, Math.PI * 2)
        this.ctx.fill()
        
        // Taunt animation
        if (fly.tauntTimer > 0) {
          this.ctx.strokeStyle = 'hsla(60, 100%, 50%, 0.5)'
          this.ctx.lineWidth = 1
          this.ctx.beginPath()
          this.ctx.arc(0, 0, 8, 0, Math.PI * 2)
          this.ctx.stroke()
        }
        
        this.ctx.restore()
      }
    })
    
    // Draw frogs
    this.frogs.forEach(frog => {
      this.ctx.save()
      this.ctx.translate(frog.x, frog.y)
      
      // Frog body
      const squash = frog.isJumping ? 1.2 : 1 + Math.sin(frog.animPhase) * 0.05
      const stretch = frog.isJumping ? 0.8 : 1 - Math.sin(frog.animPhase) * 0.03
      
      this.ctx.fillStyle = frog.inWater ? 'hsla(140, 50%, 25%, 0.7)' : 'hsla(140, 50%, 30%, 0.9)'
      this.ctx.beginPath()
      this.ctx.ellipse(0, 0, 12 * frog.size * squash, 10 * frog.size * stretch, 0, 0, Math.PI * 2)
      this.ctx.fill()
      
      // Eyes
      const eyeY = frog.inWater ? -3 : -5
      this.ctx.fillStyle = 'hsla(60, 80%, 70%, 0.9)'
      this.ctx.beginPath()
      this.ctx.arc(-4 * frog.size, eyeY * frog.size, 3 * frog.size, 0, Math.PI * 2)
      this.ctx.arc(4 * frog.size, eyeY * frog.size, 3 * frog.size, 0, Math.PI * 2)
      this.ctx.fill()
      
      // Pupils
      this.ctx.fillStyle = 'black'
      this.ctx.beginPath()
      this.ctx.arc(-4 * frog.size, eyeY * frog.size, 1.5 * frog.size, 0, Math.PI * 2)
      this.ctx.arc(4 * frog.size, eyeY * frog.size, 1.5 * frog.size, 0, Math.PI * 2)
      this.ctx.fill()
      
      // Spots
      this.ctx.fillStyle = 'hsla(140, 40%, 20%, 0.5)'
      for (let i = 0; i < 3; i++) {
        const spotX = (i - 1) * 6 * frog.size
        const spotY = Math.sin(i) * 3 * frog.size
        this.ctx.beginPath()
        this.ctx.arc(spotX, spotY, 2 * frog.size, 0, Math.PI * 2)
        this.ctx.fill()
      }
      
      // Tongue
      if (frog.tongueOut && frog.tongueTarget) {
        const dx = frog.tongueTarget.x - frog.x
        const dy = frog.tongueTarget.y - frog.y
        const angle = Math.atan2(dy, dx)
        
        this.ctx.strokeStyle = 'hsla(350, 60%, 50%, 0.9)'
        this.ctx.lineWidth = 3
        this.ctx.lineCap = 'round'
        
        this.ctx.beginPath()
        this.ctx.moveTo(0, 0)
        this.ctx.lineTo(
          Math.cos(angle) * frog.tongueLength,
          Math.sin(angle) * frog.tongueLength
        )
        this.ctx.stroke()
      }
      
      // Water ripples if in water
      if (frog.inWater) {
        this.ctx.strokeStyle = 'hsla(200, 60%, 50%, 0.3)'
        this.ctx.lineWidth = 1
        this.ctx.beginPath()
        this.ctx.ellipse(0, 5, 15, 7, 0, 0, Math.PI * 2)
        this.ctx.stroke()
      }
      
      this.ctx.restore()
    })
  }
}