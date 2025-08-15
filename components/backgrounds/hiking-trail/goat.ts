import { Goat } from './types'

export class GoatManager {
  private goat: Goat | null = null
  private grassPatches: Array<{x: number, y: number, eaten: boolean, regrowTimer: number}> = []

  constructor(private ctx: CanvasRenderingContext2D, private canvas: HTMLCanvasElement) {
    this.generateGrassPatches()
    this.spawnGoat()
  }

  private generateGrassPatches() {
    // Create grass patches that the goat can eat
    for (let i = 0; i < 20; i++) {
      this.grassPatches.push({
        x: Math.random() * this.canvas.width,
        y: this.canvas.height * 0.65 + Math.random() * this.canvas.height * 0.15,
        eaten: false,
        regrowTimer: 0
      })
    }
  }

  private spawnGoat() {
    if (Math.random() > 0.3) { // 70% chance of goat appearing
      const fromLeft = Math.random() > 0.5
      this.goat = {
        x: fromLeft ? -30 : this.canvas.width + 30,
        y: this.canvas.height * 0.7,
        vx: 0,
        size: 0.8 + Math.random() * 0.3,
        direction: fromLeft ? 1 : -1, // Face inward from spawn side
        animPhase: 0,
        eatingTimer: 0,
        targetGrass: null
      }
    }
  }

  update() {
    // Update grass regrowth
    this.grassPatches.forEach(patch => {
      if (patch.eaten && patch.regrowTimer > 0) {
        patch.regrowTimer--
        if (patch.regrowTimer === 0) {
          patch.eaten = false
        }
      }
    })

    // Update goat
    if (this.goat) {
      this.goat.animPhase += 0.05

      // Find nearest uneaten grass if not eating
      if (this.goat.eatingTimer === 0 && !this.goat.targetGrass) {
        let nearestGrass = null
        let nearestDistance = Infinity

        this.grassPatches.forEach(patch => {
          if (!patch.eaten) {
            const dx = patch.x - this.goat!.x
            const dy = patch.y - this.goat!.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < nearestDistance && distance < 200) {
              nearestDistance = distance
              nearestGrass = patch
            }
          }
        })

        if (nearestGrass) {
          this.goat.targetGrass = nearestGrass
        }
      }

      // Move towards target grass
      if (this.goat.targetGrass && this.goat.eatingTimer === 0) {
        const dx = this.goat.targetGrass.x - this.goat.x
        const dy = this.goat.targetGrass.y - this.goat.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 10) {
          this.goat.vx = (dx / distance) * 1.5
          this.goat.x += this.goat.vx
          this.goat.y += (dy / distance) * 0.5
          this.goat.direction = this.goat.vx > 0 ? 1 : -1
        } else {
          // Start eating
          this.goat.eatingTimer = 120
          this.goat.vx = 0
        }
      }

      // Eating behavior
      if (this.goat.eatingTimer > 0) {
        this.goat.eatingTimer--
        
        if (this.goat.eatingTimer === 60 && this.goat.targetGrass) {
          // Mark grass as eaten
          const patch = this.grassPatches.find(p => 
            p.x === this.goat!.targetGrass!.x && 
            p.y === this.goat!.targetGrass!.y
          )
          if (patch) {
            patch.eaten = true
            patch.regrowTimer = 500 + Math.random() * 500 // Regrow after 8-16 seconds
          }
        }
        
        if (this.goat.eatingTimer === 0) {
          this.goat.targetGrass = null
        }
      }

      // Wander if no grass target
      if (!this.goat.targetGrass && this.goat.eatingTimer === 0) {
        if (Math.random() > 0.98) {
          this.goat.vx = (Math.random() - 0.5) * 2
          this.goat.direction = this.goat.vx > 0 ? 1 : -1
        }
        
        this.goat.x += this.goat.vx
        this.goat.vx *= 0.98 // Slow down gradually
      }

      // Remove goat if it wanders off screen
      if (this.goat.x < -100 || this.goat.x > this.canvas.width + 100) {
        this.goat = null
        // Chance to spawn new goat later
        setTimeout(() => {
          if (!this.goat && Math.random() > 0.5) {
            this.spawnGoat()
          }
        }, 10000)
      }
    } else {
      // Chance to spawn goat if none exists
      if (Math.random() > 0.9995) {
        this.spawnGoat()
      }
    }
  }

  draw() {
    // Draw grass patches
    this.grassPatches.forEach(patch => {
      if (!patch.eaten) {
        this.ctx.save()
        this.ctx.translate(patch.x, patch.y)
        
        // Draw grass tuft
        this.ctx.strokeStyle = 'hsla(100, 50%, 40%, 0.8)'
        this.ctx.lineWidth = 1.5
        
        for (let i = -3; i <= 3; i++) {
          const height = 8 + Math.abs(i) * 2
          const sway = Math.sin(Date.now() * 0.002 + patch.x + i) * 2
          
          this.ctx.beginPath()
          this.ctx.moveTo(i * 2, 0)
          this.ctx.quadraticCurveTo(
            i * 2 + sway, 
            -height / 2, 
            i * 2 + sway * 1.5, 
            -height
          )
          this.ctx.stroke()
        }
        
        this.ctx.restore()
      } else if (patch.regrowTimer > 400) {
        // Show tiny sprouts when starting to regrow
        this.ctx.save()
        this.ctx.translate(patch.x, patch.y)
        
        this.ctx.strokeStyle = 'hsla(110, 60%, 50%, 0.4)'
        this.ctx.lineWidth = 1
        
        for (let i = -1; i <= 1; i++) {
          this.ctx.beginPath()
          this.ctx.moveTo(i * 3, 0)
          this.ctx.lineTo(i * 3, -2)
          this.ctx.stroke()
        }
        
        this.ctx.restore()
      }
    })

    // Draw goat
    if (this.goat) {
      this.ctx.save()
      this.ctx.translate(this.goat.x, this.goat.y)
      this.ctx.scale(this.goat.direction, 1)
      
      // Legs (thinner and longer for goat proportions)
      const legOffset = Math.sin(this.goat.animPhase) * 2
      this.ctx.strokeStyle = 'hsla(30, 25%, 40%, 0.9)'
      this.ctx.lineWidth = 1.5 * this.goat.size
      
      // Back legs (near the rear of the body)
      this.ctx.beginPath()
      this.ctx.moveTo(-8 * this.goat.size, -6 * this.goat.size)
      this.ctx.lineTo(-8 * this.goat.size - legOffset, 6 * this.goat.size)
      this.ctx.moveTo(-6 * this.goat.size, -6 * this.goat.size)
      this.ctx.lineTo(-6 * this.goat.size + legOffset, 6 * this.goat.size)
      
      // Front legs (near the front of the body)
      this.ctx.moveTo(6 * this.goat.size, -6 * this.goat.size)
      this.ctx.lineTo(6 * this.goat.size + legOffset, 6 * this.goat.size)
      this.ctx.moveTo(8 * this.goat.size, -6 * this.goat.size)
      this.ctx.lineTo(8 * this.goat.size - legOffset, 6 * this.goat.size)
      this.ctx.stroke()
      
      // Body (more elongated and angular for goat shape)
      this.ctx.fillStyle = 'hsla(30, 30%, 85%, 0.95)'
      this.ctx.beginPath()
      // Draw a more rectangular body with slight taper
      this.ctx.moveTo(-10 * this.goat.size, -6 * this.goat.size)
      this.ctx.lineTo(8 * this.goat.size, -7 * this.goat.size)
      this.ctx.quadraticCurveTo(10 * this.goat.size, -8 * this.goat.size, 10 * this.goat.size, -10 * this.goat.size)
      this.ctx.lineTo(10 * this.goat.size, -12 * this.goat.size)
      this.ctx.quadraticCurveTo(8 * this.goat.size, -14 * this.goat.size, 4 * this.goat.size, -14 * this.goat.size)
      this.ctx.lineTo(-8 * this.goat.size, -13 * this.goat.size)
      this.ctx.quadraticCurveTo(-10 * this.goat.size, -12 * this.goat.size, -10 * this.goat.size, -10 * this.goat.size)
      this.ctx.closePath()
      this.ctx.fill()
      
      // Neck and Head (positioned at front, lower when eating)
      const headY = this.goat.eatingTimer > 0 ? -2 : -11
      this.ctx.save()
      this.ctx.translate(11 * this.goat.size, headY * this.goat.size)
      
      // Head (more triangular/angular goat shape)
      this.ctx.fillStyle = 'hsla(30, 30%, 85%, 0.95)'
      this.ctx.beginPath()
      this.ctx.moveTo(0, 0)
      this.ctx.lineTo(5 * this.goat.size, -2 * this.goat.size)
      this.ctx.lineTo(6 * this.goat.size, 0)
      this.ctx.lineTo(5 * this.goat.size, 3 * this.goat.size)
      this.ctx.lineTo(0, 2 * this.goat.size)
      this.ctx.closePath()
      this.ctx.fill()
      
      // Curved Horns (characteristic goat horns)
      this.ctx.strokeStyle = 'hsla(30, 20%, 40%, 0.9)'
      this.ctx.lineWidth = 1.2 * this.goat.size
      this.ctx.lineCap = 'round'
      
      this.ctx.beginPath()
      this.ctx.moveTo(2 * this.goat.size, -2 * this.goat.size)
      this.ctx.quadraticCurveTo(2 * this.goat.size, -4 * this.goat.size, 1 * this.goat.size, -5 * this.goat.size)
      this.ctx.moveTo(2 * this.goat.size, -2 * this.goat.size)
      this.ctx.quadraticCurveTo(3 * this.goat.size, -4 * this.goat.size, 3.5 * this.goat.size, -5 * this.goat.size)
      this.ctx.stroke()
      
      // Eye (horizontal pupil like real goats)
      this.ctx.fillStyle = 'hsla(40, 30%, 20%, 0.9)'
      this.ctx.beginPath()
      this.ctx.ellipse(3 * this.goat.size, 0, 1.5 * this.goat.size, 1.5 * this.goat.size, 0, 0, Math.PI * 2)
      this.ctx.fill()
      
      // Horizontal pupil
      this.ctx.fillStyle = 'black'
      this.ctx.beginPath()
      this.ctx.ellipse(3 * this.goat.size, 0, 1 * this.goat.size, 0.3 * this.goat.size, 0, 0, Math.PI * 2)
      this.ctx.fill()
      
      // Nostril
      this.ctx.fillStyle = 'hsla(30, 20%, 30%, 0.6)'
      this.ctx.beginPath()
      this.ctx.ellipse(5.5 * this.goat.size, 1 * this.goat.size, 0.3 * this.goat.size, 0.5 * this.goat.size, 0, 0, Math.PI * 2)
      this.ctx.fill()
      
      // Beard (characteristic goat beard)
      this.ctx.strokeStyle = 'hsla(30, 20%, 70%, 0.8)'
      this.ctx.lineWidth = 2 * this.goat.size
      this.ctx.beginPath()
      this.ctx.moveTo(4 * this.goat.size, 3 * this.goat.size)
      this.ctx.quadraticCurveTo(4 * this.goat.size, 5 * this.goat.size, 3 * this.goat.size, 6 * this.goat.size)
      this.ctx.stroke()
      
      // Ears
      this.ctx.fillStyle = 'hsla(30, 30%, 85%, 0.95)'
      this.ctx.beginPath()
      this.ctx.moveTo(1 * this.goat.size, -1 * this.goat.size)
      this.ctx.lineTo(0, -2 * this.goat.size)
      this.ctx.lineTo(1 * this.goat.size, -3 * this.goat.size)
      this.ctx.closePath()
      this.ctx.fill()
      
      this.ctx.restore()
      
      // Short upright tail (characteristic of goats)
      const tailWag = Math.sin(this.goat.animPhase * 2) * 5
      this.ctx.strokeStyle = 'hsla(30, 30%, 85%, 0.9)'
      this.ctx.lineWidth = 2.5 * this.goat.size
      this.ctx.beginPath()
      this.ctx.moveTo(-9 * this.goat.size, -12 * this.goat.size)
      this.ctx.quadraticCurveTo(
        -10 * this.goat.size, 
        -14 * this.goat.size + tailWag, 
        -9 * this.goat.size, 
        -16 * this.goat.size + tailWag
      )
      this.ctx.stroke()
      
      // Small tuft at tail end
      this.ctx.fillStyle = 'hsla(30, 25%, 70%, 0.9)'
      this.ctx.beginPath()
      this.ctx.arc(-9 * this.goat.size, -16 * this.goat.size + tailWag, 1.5 * this.goat.size, 0, Math.PI * 2)
      this.ctx.fill()
      
      this.ctx.restore()
    }
  }
}