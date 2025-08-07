import { Bird, Hiker, Owl, Bat, Firefly, Comet, ISS, Cloud, TreePosition } from './types'
import { getSunMoonPosition } from './astronomy'

export class Creatures {
  private birds: Bird[] = []
  private hikers: Hiker[] = []
  private owls: Owl[] = []
  private bats: Bat[] = []
  private fireflies: Firefly[] = []
  private comets: Comet[] = []
  private iss: ISS
  private clouds: Cloud[] = []
  private stars: Array<{x: number, y: number, brightness: number, twinkle: number}> = []

  private trailPath: Array<{x: number, y: number}> = []

  constructor(
    private ctx: CanvasRenderingContext2D,
    private canvas: HTMLCanvasElement,
    private mountainPath: Path2D
  ) {
    this.initializeCreatures()
    this.generateStars()
    this.iss = {
      orbitalPeriod: 90 * 60 * 1000,
      currentAngle: Math.random() * Math.PI * 2,
      altitude: 0,
      azimuth: 0,
      visible: false,
      solarPanelAngle: 0
    }
  }

  setTrailPath(path: Array<{x: number, y: number}>) {
    this.trailPath = path
  }

  private initializeCreatures() {
    // Birds (daytime)
    for (let i = 0; i < 5; i++) {
      this.birds.push({
        x: Math.random() * this.canvas.width,
        y: 50 + Math.random() * 150,
        vx: 1 + Math.random() * 2,
        vy: Math.sin(Math.random() * Math.PI) * 0.5,
        size: 0.8 + Math.random() * 0.4,
        wingPhase: Math.random() * Math.PI * 2,
        type: ['eagle', 'hawk', 'swallow'][Math.floor(Math.random() * 3)] as 'eagle' | 'hawk' | 'swallow'
      })
    }

    // Hikers start at random points on trail
    for (let i = 0; i < 2; i++) {
      const startPoint = Math.random()
      this.hikers.push({
        x: startPoint * this.canvas.width,
        y: this.canvas.height * 0.65,
        speed: 0.3 + Math.random() * 0.5,
        direction: Math.random() > 0.5 ? 1 : -1,
        size: 0.8 + Math.random() * 0.3,
        animPhase: Math.random() * Math.PI * 2,
        color: Math.floor(Math.random() * 3),
        pathPosition: startPoint // Track position along path
      })
    }

    // Clouds
    for (let i = 0; i < 6; i++) {
      this.clouds.push({
        x: Math.random() * (this.canvas.width + 200) - 100,
        y: 30 + Math.random() * 150,
        size: 50 + Math.random() * 100,
        opacity: 0.3 + Math.random() * 0.4,
        speed: 0.1 + Math.random() * 0.3,
        layers: 2 + Math.floor(Math.random() * 3)
      })
    }

    // Nocturnal creatures - owls start hidden
    for (let i = 0; i < 2; i++) {
      this.owls.push({
        x: -100, // Start off-screen
        y: -100,
        targetX: Math.random() * this.canvas.width,
        targetY: this.canvas.height * 0.35,
        vx: 0,
        vy: 0,
        size: 1 + Math.random() * 0.3,
        wingPhase: Math.random() * Math.PI * 2,
        huntingPhase: Math.random() * Math.PI * 2,
        hidingTree: null,
        state: 'hiding',
        stateTimer: 0
      })
    }

    for (let i = 0; i < 8; i++) {
      this.bats.push({
        x: Math.random() * this.canvas.width,
        y: 100 + Math.random() * 200,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 2,
        wingPhase: Math.random() * Math.PI * 2,
        size: 0.5 + Math.random() * 0.3,
        swoopPhase: Math.random() * Math.PI * 2,
        state: 'gone', // Start gone until night
        targetExit: 'mountain'
      })
    }

    for (let i = 0; i < 20; i++) {
      this.fireflies.push({
        x: Math.random() * this.canvas.width,
        y: this.canvas.height * 0.5 + Math.random() * this.canvas.height * 0.3,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.3,
        brightness: 0,
        pulsePhase: Math.random() * Math.PI * 2,
        size: 2 + Math.random()
      })
    }
  }

  private generateStars() {
    for (let i = 0; i < 100; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * (this.canvas.height * 0.5),
        brightness: 0.3 + Math.random() * 0.7,
        twinkle: Math.random() * Math.PI * 2
      })
    }
  }

  update(simulateTime: boolean, currentDate: Date, skyBrightness: number, isDaytime: boolean, trees: TreePosition[]) {
    // Check time of day for nocturnal creatures
    const { sun } = getSunMoonPosition(currentDate, 40)
    const isFullNight = sun.altitude < -12 // Full night when sun is well below horizon
    const isDawn = sun.altitude >= -12 && sun.altitude < -6 // Dawn transition
    const isDusk = sun.altitude >= -6 && sun.altitude < 0 && !isDaytime // Dusk transition
    // Update birds (daytime)
    if (isDaytime) {
      this.birds.forEach(bird => {
        bird.x += bird.vx
        bird.y += bird.vy + Math.sin(Date.now() * 0.001 + bird.wingPhase) * 0.3
        bird.wingPhase += 0.15
        
        if (bird.x > this.canvas.width + 50) {
          bird.x = -50
          bird.y = 50 + Math.random() * 150
        }
        
        if (Math.random() > 0.99) {
          bird.vy = Math.sin(Math.random() * Math.PI) * 0.5
        }
      })
    }

    // Update hikers to follow trail smoothly
    this.hikers.forEach(hiker => {
      // Move along path more slowly and smoothly
      hiker.pathPosition += (hiker.speed * hiker.direction * 0.0003) // Reduced speed
      hiker.animPhase += 0.05
      
      // Wrap around path
      if (hiker.pathPosition > 1) {
        hiker.pathPosition = 0
      } else if (hiker.pathPosition < 0) {
        hiker.pathPosition = 1
      }
      
      // Get position on trail with interpolation for smooth movement
      if (this.trailPath.length > 1) {
        const pathLength = this.trailPath.length - 1
        const exactIndex = hiker.pathPosition * pathLength
        const index = Math.floor(exactIndex)
        const nextIndex = Math.min(index + 1, pathLength)
        const t = exactIndex - index // Interpolation factor
        
        const point = this.trailPath[index]
        const nextPoint = this.trailPath[nextIndex]
        
        if (point && nextPoint) {
          // Interpolate between points for smooth movement
          hiker.x = point.x + (nextPoint.x - point.x) * t
          hiker.y = point.y + (nextPoint.y - point.y) * t - 10 // Slightly above path
        } else if (point) {
          hiker.x = point.x
          hiker.y = point.y - 10
        }
      }
      
      // Occasionally change direction
      if (Math.random() > 0.998) {
        hiker.direction *= -1
      }
    })

    // Update clouds
    this.clouds.forEach(cloud => {
      cloud.x += cloud.speed
      if (cloud.x > this.canvas.width + cloud.size) {
        cloud.x = -cloud.size
        cloud.y = 30 + Math.random() * 150
      }
    })

    // Update nocturnal creatures based on time of day
    // Update owls with hiding/emerging behavior
    this.owls.forEach((owl, index) => {
      // Find deciduous trees for owls to hide in
      const deciduousTrees = trees.filter(t => t.type === 'deciduous')
      
      if (isDawn && owl.state === 'flying') {
        // Dawn: owls need to find a tree to hide in
        if (deciduousTrees.length > 0 && !owl.hidingTree) {
          const tree = deciduousTrees[index % deciduousTrees.length]
          owl.hidingTree = tree
          owl.state = 'entering'
          owl.targetX = tree.x
          owl.targetY = tree.y - 30 * tree.size
          tree.hasOwl = true
        }
      } else if (isDusk && owl.state === 'hiding') {
        // Dusk: owls peek out
        owl.state = 'peeking'
        owl.stateTimer = 60 // Peek for 1 second
      } else if (isFullNight && owl.state === 'peeking') {
        // Full night: owls emerge
        owl.state = 'exiting'
        if (owl.hidingTree) {
          owl.hidingTree.leafRustleTimer = 30
        }
      } else if (isFullNight && owl.state === 'hiding' && !isDusk) {
        // If it's already full night and owl is still hiding, make it emerge
        owl.state = 'exiting'
      }
      
      // Handle state transitions
      if (owl.state === 'entering') {
        // Fly towards tree
        const dx = owl.targetX - owl.x
        const dy = owl.targetY - owl.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist > 5) {
          owl.vx = dx * 0.05
          owl.vy = dy * 0.05
          owl.x += owl.vx
          owl.y += owl.vy
          owl.wingPhase += 0.15
        } else {
          // Reached tree, hide
          owl.state = 'hiding'
          owl.x = -200 // Move off-screen
          owl.y = -200
          if (owl.hidingTree) {
            owl.hidingTree.leafRustleTimer = 20 // Rustle leaves when entering
          }
        }
      } else if (owl.state === 'peeking') {
        // Show owl head at tree position
        if (owl.hidingTree) {
          owl.x = owl.hidingTree.x
          owl.y = owl.hidingTree.y - 25 * owl.hidingTree.size
        }
        owl.stateTimer--
        if (owl.stateTimer <= 0) {
          // If still not full night, go back to hiding
          if (!isFullNight) {
            owl.state = 'hiding'
            owl.x = -200
            owl.y = -200
          }
        }
      } else if (owl.state === 'exiting') {
        // Emerge from tree
        if (owl.hidingTree) {
          owl.x = owl.hidingTree.x
          owl.y = owl.hidingTree.y - 30 * owl.hidingTree.size
          owl.hidingTree.hasOwl = false
          owl.hidingTree.leafRustleTimer = 30 // Rustle leaves when exiting
        }
        owl.state = 'flying'
        owl.hidingTree = null
      } else if (owl.state === 'flying' && isFullNight) {
        // Normal flying behavior during full night
        owl.huntingPhase += 0.02
        owl.huntingPhase += 0.02
        
          if (Math.random() > 0.98) {
            // Fly to a new position in the middle area
            owl.targetX = Math.random() * this.canvas.width
            // Keep owls in middle portion of screen (25-45%)
            owl.targetY = this.canvas.height * (0.25 + Math.random() * 0.2)
          }
          
          const dx = owl.targetX - owl.x
          const dy = owl.targetY - owl.y
          owl.vx += dx * 0.001
          owl.vy += dy * 0.001
          owl.vx *= 0.98
          owl.vy *= 0.98
          
          owl.x += owl.vx
          owl.y += owl.vy
          
          // Ensure owls don't go too low or too high
          if (owl.y > this.canvas.height * 0.5) {
            owl.y = this.canvas.height * 0.5
            owl.vy = -Math.abs(owl.vy)
          }
          if (owl.y < this.canvas.height * 0.2) {
            owl.y = this.canvas.height * 0.2
            owl.vy = Math.abs(owl.vy)
          }
          
          owl.wingPhase += 0.1
        }
      })

      // Update bats with leaving behavior at dawn
      this.bats.forEach(bat => {
        if (isDawn && bat.state === 'active') {
          // Dawn: bats need to leave
          bat.state = 'leaving'
          // Choose exit direction
          const rand = Math.random()
          if (rand < 0.3) {
            bat.targetExit = 'left'
            bat.vx = -5
          } else if (rand < 0.6) {
            bat.targetExit = 'right'
            bat.vx = 5
          } else {
            bat.targetExit = 'mountain'
            bat.vy = -3
          }
        } else if (isFullNight && bat.state === 'gone') {
          // Full night: bats return
          bat.state = 'active'
          // Enter from random edge
          if (Math.random() < 0.5) {
            bat.x = -50
            bat.vx = 3
          } else {
            bat.x = this.canvas.width + 50
            bat.vx = -3
          }
          bat.y = 100 + Math.random() * 200
        }
        
        if (bat.state === 'leaving') {
          // Accelerate towards exit
          if (bat.targetExit === 'mountain') {
            bat.vy -= 0.2
            bat.y += bat.vy
            if (bat.y < -50) {
              bat.state = 'gone'
            }
          } else {
            bat.x += bat.vx
            if (bat.x < -100 || bat.x > this.canvas.width + 100) {
              bat.state = 'gone'
            }
          }
          bat.wingPhase += 0.4 // Faster wing flapping when leaving
        } else if (bat.state === 'active') {
          // Normal bat behavior during full night

          bat.swoopPhase += 0.05
          bat.x += bat.vx + Math.sin(bat.swoopPhase) * 2
          bat.y += bat.vy + Math.cos(bat.swoopPhase * 1.5) * 1
          bat.wingPhase += 0.3
          
          if (bat.x < 0 || bat.x > this.canvas.width) bat.vx *= -1
          if (bat.y < 50 || bat.y > this.canvas.height * 0.6) bat.vy *= -1
          
          if (Math.random() > 0.98) {
            bat.vx = (Math.random() - 0.5) * 3
            bat.vy = (Math.random() - 0.5) * 2
          }
        }
      })

    // Update fireflies during night
    if (isFullNight) {
      this.fireflies.forEach(firefly => {
        firefly.x += firefly.vx + Math.sin(Date.now() * 0.001) * 0.2
        firefly.y += firefly.vy + Math.cos(Date.now() * 0.002) * 0.1
        firefly.pulsePhase += 0.05
        firefly.brightness = 0.5 + Math.sin(firefly.pulsePhase) * 0.5
        
        if (firefly.x < 0 || firefly.x > this.canvas.width) {
          firefly.vx *= -1
        }
        if (firefly.y < this.canvas.height * 0.5 || firefly.y > this.canvas.height * 0.9) {
          firefly.vy *= -1
        }
        
        if (Math.random() > 0.99) {
          firefly.vx = (Math.random() - 0.5) * 0.5
          firefly.vy = (Math.random() - 0.5) * 0.3
        }
      })

      // Update comets - flying across the sky
      if (Math.random() > 0.999 && this.comets.length < 2) {
        // Start from left or right edge
        const fromLeft = Math.random() > 0.5
        const comet: Comet = {
          x: fromLeft ? -50 : this.canvas.width + 50,
          y: Math.random() * this.canvas.height * 0.4, // Upper portion of sky
          vx: fromLeft ? (2 + Math.random() * 3) : -(2 + Math.random() * 3), // Horizontal speed
          vy: (Math.random() - 0.5) * 0.5, // Slight vertical drift
          tail: [],
          active: true,
          size: 2 + Math.random() * 2
        }
        this.comets.push(comet)
      }

      this.comets = this.comets.filter(comet => {
        if (comet.active) {
          comet.x += comet.vx
          comet.y += comet.vy
          
          comet.tail.push({x: comet.x, y: comet.y})
          if (comet.tail.length > 20) {
            comet.tail.shift()
          }
          
          // Deactivate when off screen
          if (comet.x < -100 || comet.x > this.canvas.width + 100 || 
              comet.y > this.canvas.height * 0.6) {
            comet.active = false
          }
        }
        return comet.active
      })

      // Update ISS
      const { sun: sunPos, moon } = getSunMoonPosition(currentDate, 40)
      this.iss.currentAngle += (Math.PI * 2) / (this.iss.orbitalPeriod / 16)
      this.iss.altitude = 60 + Math.sin(this.iss.currentAngle) * 30
      this.iss.azimuth = (this.iss.currentAngle * 180 / Math.PI) % 360
      this.iss.visible = !isDaytime && this.iss.altitude > 20 && Math.abs(sunPos.altitude) < 18
      this.iss.solarPanelAngle += 0.01
    }
  }

  drawDaytime() {
    // Draw clouds
    this.clouds.forEach(cloud => {
      this.ctx.save()
      this.ctx.translate(cloud.x, cloud.y)
      
      for (let layer = 0; layer < cloud.layers; layer++) {
        const layerOffset = layer * 10
        const layerOpacity = cloud.opacity * (1 - layer * 0.2)
        
        this.ctx.fillStyle = `hsla(0, 0%, 100%, ${layerOpacity})`
        
        for (let i = 0; i < 5; i++) {
          const puffX = (i - 2) * 20 + layerOffset
          const puffY = Math.sin(i * 0.5) * 10
          const puffSize = cloud.size * 0.3 * (1 + Math.sin(i) * 0.2)
          
          this.ctx.beginPath()
          this.ctx.arc(puffX, puffY, puffSize, 0, Math.PI * 2)
          this.ctx.fill()
        }
      }
      
      this.ctx.restore()
    })

    // Draw birds
    this.birds.forEach(bird => {
      this.ctx.save()
      this.ctx.translate(bird.x, bird.y)
      
      const wingSpread = Math.sin(bird.wingPhase) * 10 * bird.size
      
      this.ctx.strokeStyle = 'hsla(30, 20%, 20%, 0.8)'
      this.ctx.lineWidth = 2 * bird.size
      this.ctx.lineCap = 'round'
      
      // Body
      this.ctx.beginPath()
      this.ctx.moveTo(0, 0)
      this.ctx.lineTo(3 * bird.size, 0)
      this.ctx.stroke()
      
      // Wings
      this.ctx.beginPath()
      this.ctx.moveTo(0, 0)
      this.ctx.lineTo(-8 * bird.size, -wingSpread)
      this.ctx.moveTo(0, 0)
      this.ctx.lineTo(-8 * bird.size, wingSpread)
      this.ctx.stroke()
      
      this.ctx.restore()
    })
  }

  // Separate method for drawing hikers - called after grass layer
  drawHikers() {
    this.hikers.forEach(hiker => {
      this.ctx.save()
      this.ctx.translate(hiker.x, hiker.y)
      
      const walkBob = Math.sin(hiker.animPhase) * 2
      
      // Backpack
      const packColors = ['hsla(210, 50%, 40%, 0.9)', 'hsla(30, 60%, 50%, 0.9)', 'hsla(120, 40%, 40%, 0.9)']
      this.ctx.fillStyle = packColors[hiker.color]
      this.ctx.fillRect(-4 * hiker.size, -15 * hiker.size + walkBob, 8 * hiker.size, 12 * hiker.size)
      
      // Body
      this.ctx.fillStyle = 'hsla(0, 40%, 30%, 0.9)'
      this.ctx.fillRect(-3 * hiker.size, -10 * hiker.size + walkBob, 6 * hiker.size, 10 * hiker.size)
      
      // Head
      this.ctx.fillStyle = 'hsla(30, 60%, 70%, 0.9)'
      this.ctx.beginPath()
      this.ctx.arc(0, -15 * hiker.size + walkBob, 3 * hiker.size, 0, Math.PI * 2)
      this.ctx.fill()
      
      // Hat
      this.ctx.fillStyle = 'hsla(30, 50%, 40%, 0.9)'
      this.ctx.beginPath()
      this.ctx.ellipse(0, -18 * hiker.size + walkBob, 5 * hiker.size, 2 * hiker.size, 0, 0, Math.PI * 2)
      this.ctx.fill()
      
      // Walking stick
      this.ctx.strokeStyle = 'hsla(30, 40%, 35%, 0.9)'
      this.ctx.lineWidth = 1.5 * hiker.size
      this.ctx.beginPath()
      this.ctx.moveTo(5 * hiker.size * hiker.direction, -8 * hiker.size + walkBob)
      this.ctx.lineTo(7 * hiker.size * hiker.direction, 0)
      this.ctx.stroke()
      
      // Legs animation
      const leg1Angle = Math.sin(hiker.animPhase) * 0.3
      const leg2Angle = Math.sin(hiker.animPhase + Math.PI) * 0.3
      
      this.ctx.strokeStyle = 'hsla(210, 30%, 30%, 0.9)'
      this.ctx.lineWidth = 2 * hiker.size
      
      this.ctx.beginPath()
      this.ctx.moveTo(-1 * hiker.size, 0)
      this.ctx.lineTo(-1 * hiker.size + Math.sin(leg1Angle) * 3, 8 * hiker.size)
      this.ctx.moveTo(1 * hiker.size, 0)
      this.ctx.lineTo(1 * hiker.size + Math.sin(leg2Angle) * 3, 8 * hiker.size)
      this.ctx.stroke()
      
      this.ctx.restore()
    })
  }

  drawNighttime(skyBrightness: number) {
    // Draw stars
    if (skyBrightness < 0.3) {
      this.stars.forEach(star => {
        const twinkle = Math.sin(Date.now() * 0.001 + star.twinkle) * 0.3 + 0.7
        const brightness = star.brightness * twinkle * (1 - skyBrightness * 3)
        
        this.ctx.fillStyle = `hsla(60, 20%, 100%, ${brightness})`
        this.ctx.beginPath()
        this.ctx.arc(star.x, star.y, 1, 0, Math.PI * 2)
        this.ctx.fill()
      })
    }

    // Draw comets
    this.comets.forEach(comet => {
      // Tail
      comet.tail.forEach((pos, i) => {
        const opacity = (i / comet.tail.length) * 0.5
        this.ctx.fillStyle = `hsla(200, 70%, 80%, ${opacity})`
        this.ctx.beginPath()
        this.ctx.arc(pos.x, pos.y, comet.size * (1 - i / comet.tail.length), 0, Math.PI * 2)
        this.ctx.fill()
      })
      
      // Head
      this.ctx.fillStyle = 'hsla(60, 80%, 90%, 0.9)'
      this.ctx.beginPath()
      this.ctx.arc(comet.x, comet.y, comet.size, 0, Math.PI * 2)
      this.ctx.fill()
    })

    // Draw ISS
    if (this.iss.visible) {
      const issX = this.canvas.width * (this.iss.azimuth / 360)
      const issY = this.canvas.height * 0.3 * (1 - this.iss.altitude / 90)
      
      this.ctx.save()
      this.ctx.translate(issX, issY)
      
      // Solar panels
      this.ctx.fillStyle = 'hsla(210, 60%, 40%, 0.8)'
      this.ctx.save()
      this.ctx.rotate(this.iss.solarPanelAngle)
      this.ctx.fillRect(-20, -2, 15, 4)
      this.ctx.fillRect(5, -2, 15, 4)
      this.ctx.restore()
      
      // Main body
      this.ctx.fillStyle = 'hsla(0, 0%, 80%, 0.9)'
      this.ctx.fillRect(-5, -3, 10, 6)
      
      // Blinking light
      if (Math.sin(Date.now() * 0.01) > 0) {
        this.ctx.fillStyle = 'hsla(0, 100%, 50%, 0.9)'
        this.ctx.beginPath()
        this.ctx.arc(0, 0, 2, 0, Math.PI * 2)
        this.ctx.fill()
      }
      
      this.ctx.restore()
    }

    // Draw owls (only when visible)
    this.owls.forEach(owl => {
      // Only draw if owl is visible (flying, peeking, entering, or exiting)
      if (owl.state === 'hiding') return
      
      if (owl.state === 'peeking') {
        // Draw just the owl head peeking from tree
        this.ctx.save()
        this.ctx.translate(owl.x, owl.y)
        
        // Just the head when peeking
        this.ctx.fillStyle = 'hsla(30, 35%, 40%, 0.95)'
        this.ctx.beginPath()
        this.ctx.arc(0, 0, 8 * owl.size, 0, Math.PI * 2)
        this.ctx.fill()
        
        // Eyes (looking cautiously)
        this.ctx.fillStyle = 'hsla(50, 80%, 70%, 0.9)'
        this.ctx.beginPath()
        this.ctx.arc(-3 * owl.size, -2 * owl.size, 3 * owl.size, 0, Math.PI * 2)
        this.ctx.arc(3 * owl.size, -2 * owl.size, 3 * owl.size, 0, Math.PI * 2)
        this.ctx.fill()
        
        // Half-closed pupils (cautious look)
        this.ctx.fillStyle = 'black'
        this.ctx.beginPath()
        this.ctx.ellipse(-3 * owl.size, -2 * owl.size, 1.5 * owl.size, 1 * owl.size, 0, 0, Math.PI * 2)
        this.ctx.ellipse(3 * owl.size, -2 * owl.size, 1.5 * owl.size, 1 * owl.size, 0, 0, Math.PI * 2)
        this.ctx.fill()
        
        this.ctx.restore()
      } else {
        // Full owl body when flying, entering, or exiting
        this.ctx.save()
        this.ctx.translate(owl.x, owl.y)
        
        // Wings (only when flying)
        if (owl.state === 'flying' || owl.state === 'entering' || owl.state === 'exiting') {
          const wingSpread = Math.sin(owl.wingPhase) * 15
          this.ctx.fillStyle = 'hsla(30, 30%, 35%, 0.9)'
          this.ctx.beginPath()
          this.ctx.ellipse(-wingSpread, 0, 20 * owl.size, 8 * owl.size, -0.2, 0, Math.PI * 2)
          this.ctx.ellipse(wingSpread, 0, 20 * owl.size, 8 * owl.size, 0.2, 0, Math.PI * 2)
          this.ctx.fill()
        }
        
        // Body
        this.ctx.fillStyle = 'hsla(30, 35%, 40%, 0.95)'
        this.ctx.beginPath()
        this.ctx.ellipse(0, 0, 10 * owl.size, 15 * owl.size, 0, 0, Math.PI * 2)
        this.ctx.fill()
        
        // Eyes
        this.ctx.fillStyle = 'hsla(50, 80%, 70%, 0.9)'
        this.ctx.beginPath()
        this.ctx.arc(-4 * owl.size, -5 * owl.size, 4 * owl.size, 0, Math.PI * 2)
        this.ctx.arc(4 * owl.size, -5 * owl.size, 4 * owl.size, 0, Math.PI * 2)
        this.ctx.fill()
        
        // Pupils
        this.ctx.fillStyle = 'black'
        this.ctx.beginPath()
        this.ctx.arc(-4 * owl.size, -5 * owl.size, 2 * owl.size, 0, Math.PI * 2)
        this.ctx.arc(4 * owl.size, -5 * owl.size, 2 * owl.size, 0, Math.PI * 2)
        this.ctx.fill()
        
        // Beak
        this.ctx.fillStyle = 'hsla(40, 60%, 50%, 0.9)'
        this.ctx.beginPath()
        this.ctx.moveTo(0, -2 * owl.size)
        this.ctx.lineTo(-2 * owl.size, 2 * owl.size)
        this.ctx.lineTo(2 * owl.size, 2 * owl.size)
        this.ctx.closePath()
        this.ctx.fill()
        
        this.ctx.restore()
      }
    })

    // Draw bats (only when active or leaving)
    this.bats.forEach(bat => {
      if (bat.state === 'gone') return // Don't draw bats that have left
      this.ctx.save()
      this.ctx.translate(bat.x, bat.y)
      
      // Wings
      const wingFlap = Math.sin(bat.wingPhase) * 0.5 + 0.5
      this.ctx.fillStyle = 'hsla(280, 20%, 20%, 0.8)'
      
      this.ctx.beginPath()
      // Left wing
      this.ctx.moveTo(0, 0)
      this.ctx.quadraticCurveTo(-10 * bat.size, -5 * wingFlap * bat.size, -15 * bat.size, 0)
      this.ctx.quadraticCurveTo(-10 * bat.size, 5 * wingFlap * bat.size, -5 * bat.size, 3 * bat.size)
      // Right wing
      this.ctx.moveTo(0, 0)
      this.ctx.quadraticCurveTo(10 * bat.size, -5 * wingFlap * bat.size, 15 * bat.size, 0)
      this.ctx.quadraticCurveTo(10 * bat.size, 5 * wingFlap * bat.size, 5 * bat.size, 3 * bat.size)
      this.ctx.fill()
      
      // Body
      this.ctx.fillStyle = 'hsla(280, 25%, 15%, 0.9)'
      this.ctx.beginPath()
      this.ctx.ellipse(0, 0, 3 * bat.size, 5 * bat.size, 0, 0, Math.PI * 2)
      this.ctx.fill()
      
      // Eyes
      this.ctx.fillStyle = 'hsla(0, 80%, 50%, 0.8)'
      this.ctx.beginPath()
      this.ctx.arc(-1 * bat.size, -1 * bat.size, 0.5 * bat.size, 0, Math.PI * 2)
      this.ctx.arc(1 * bat.size, -1 * bat.size, 0.5 * bat.size, 0, Math.PI * 2)
      this.ctx.fill()
      
      this.ctx.restore()
    })

    // Draw fireflies
    this.fireflies.forEach(firefly => {
      if (firefly.brightness > 0.1) {
        // Glow
        const gradient = this.ctx.createRadialGradient(
          firefly.x, firefly.y, 0,
          firefly.x, firefly.y, firefly.size * 4
        )
        gradient.addColorStop(0, `hsla(60, 100%, 70%, ${firefly.brightness})`)
        gradient.addColorStop(1, 'hsla(60, 100%, 50%, 0)')
        
        this.ctx.fillStyle = gradient
        this.ctx.beginPath()
        this.ctx.arc(firefly.x, firefly.y, firefly.size * 4, 0, Math.PI * 2)
        this.ctx.fill()
        
        // Body
        this.ctx.fillStyle = `hsla(60, 100%, 80%, ${firefly.brightness})`
        this.ctx.beginPath()
        this.ctx.arc(firefly.x, firefly.y, firefly.size, 0, Math.PI * 2)
        this.ctx.fill()
      }
    })
  }
}