import { Mountain, Vegetation, PondConfig, TreePosition } from './types'

export class Landscape {
  private mountains: Mountain[]
  private mountainPath: Path2D
  private mountainVegetation: Vegetation[] = []
  private trailPath: Array<{x: number, y: number}> = []
  private pondConfig: PondConfig | null = null
  private trees: TreePosition[] = []

  constructor(private ctx: CanvasRenderingContext2D, private canvas: HTMLCanvasElement) {
    this.mountains = this.generateMountains()
    this.mountainPath = this.createMountainPath()
    this.generateMountainVegetation()
  }

  setPondConfig(config: PondConfig) {
    this.pondConfig = config
  }

  setTrees(trees: TreePosition[]) {
    this.trees = trees
  }

  private generateMountains(): Mountain[] {
    const mountainCount = 4 + Math.floor(Math.random() * 2)
    const spacing = this.canvas.width / (mountainCount + 1)
    return Array(mountainCount).fill(0).map((_, i) => ({
      x: spacing * (i + 1) + (Math.random() - 0.5) * spacing * 0.3,
      height: 80 + Math.random() * 80 + Math.sin(i * 0.5) * 30
    }))
  }

  private generateMountainVegetation() {
    // Add sporadic vegetation to lower mountain slopes only
    this.mountains.forEach((mountain, i) => {
      const vegCount = Math.floor(Math.random() * 3) // 0-2 vegetation per mountain
      for (let j = 0; j < vegCount; j++) {
        // Position vegetation on lower slopes only (bottom 30% of mountain)
        const heightPos = Math.random() * 0.3
        const sideOffset = (Math.random() - 0.5) * mountain.height * 0.8
        this.mountainVegetation.push({
          x: mountain.x + sideOffset,
          y: this.canvas.height * 0.6 - mountain.height * heightPos,
          type: 'mountain-shrub',
          size: 0.4 + Math.random() * 0.3,
          swayPhase: Math.random() * Math.PI * 2,
          color: `hsla(${100 + Math.random() * 20}, ${30 + Math.random() * 20}%, ${25 + Math.random() * 15}%, 0.9)`
        })
      }
    })
  }

  private createMountainPath(): Path2D {
    const path = new Path2D()
    const baseY = this.canvas.height * 0.6
    
    path.moveTo(0, this.canvas.height)
    path.lineTo(0, baseY)
    
    this.mountains.forEach((mountain) => {
      const peakX = mountain.x
      const peakY = baseY - mountain.height
      const width = mountain.height * 1.5
      
      // Left slope
      path.quadraticCurveTo(
        peakX - width * 0.7,
        peakY + mountain.height * 0.6,
        peakX - width * 0.2,
        peakY + mountain.height * 0.2
      )
      
      // Rounded peak
      path.quadraticCurveTo(
        peakX,
        peakY - 5,
        peakX + width * 0.2,
        peakY + mountain.height * 0.2
      )
      
      // Right slope
      path.quadraticCurveTo(
        peakX + width * 0.7,
        peakY + mountain.height * 0.6,
        peakX + width,
        baseY
      )
    })
    
    path.lineTo(this.canvas.width, baseY)
    path.lineTo(this.canvas.width, this.canvas.height)
    path.closePath()
    
    return path
  }

  drawMountains() {
    const baseY = this.canvas.height * 0.6
    
    // Draw mountain layers for depth
    for (let layer = 2; layer >= 0; layer--) {
      const layerOffset = layer * 10
      const opacity = 0.6 - layer * 0.15
      
      this.ctx.fillStyle = `hsla(220, 20%, ${30 - layer * 8}%, ${opacity})`
      this.ctx.beginPath()
      this.ctx.moveTo(0, this.canvas.height)
      this.ctx.lineTo(0, baseY)
      
      this.mountains.forEach((mountain, i) => {
        const peakX = mountain.x + layerOffset
        const peakY = baseY - mountain.height + layerOffset * 2
        const width = mountain.height * 0.8
        
        // Approach from previous point or edge
        if (i === 0) {
          this.ctx.lineTo(peakX - width, baseY)
        }
        
        // Left slope - more angular
        this.ctx.lineTo(peakX - width * 0.3, peakY + mountain.height * 0.5)
        this.ctx.lineTo(peakX - width * 0.1, peakY + mountain.height * 0.2)
        
        // Peak with slight rounding
        this.ctx.quadraticCurveTo(peakX, peakY, peakX + width * 0.1, peakY + mountain.height * 0.2)
        
        // Right slope - more angular
        this.ctx.lineTo(peakX + width * 0.3, peakY + mountain.height * 0.5)
        this.ctx.lineTo(peakX + width, baseY)
      })
      
      this.ctx.lineTo(this.canvas.width, baseY)
      this.ctx.lineTo(this.canvas.width, this.canvas.height)
      this.ctx.closePath()
      this.ctx.fill()
    }

    // Draw mountain vegetation
    this.drawMountainVegetation()
  }

  private drawMountainVegetation() {
    // Only draw vegetation that's below the screen top and within reasonable bounds
    const baseY = this.canvas.height * 0.6
    
    this.mountainVegetation.forEach(veg => {
      // Skip vegetation that's positioned too high or outside screen
      if (veg.y < baseY * 0.3 || veg.y > baseY || 
          veg.x < -50 || veg.x > this.canvas.width + 50) {
        return
      }
      
      const sway = Math.sin(Date.now() * 0.001 + veg.swayPhase) * 1
      
      this.ctx.save()
      this.ctx.translate(veg.x + sway, veg.y)
      
      // Draw small mountain shrub with darker colors for mountain environment
      this.ctx.fillStyle = veg.color || 'hsla(110, 25%, 25%, 0.8)'
      
      // Simple shrub shape - smaller for mountain environment
      for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 / 3) * i
        const offsetX = Math.cos(angle) * 5 * veg.size
        const offsetY = Math.sin(angle) * 4 * veg.size
        this.ctx.beginPath()
        this.ctx.arc(offsetX, offsetY, 4 * veg.size, 0, Math.PI * 2)
        this.ctx.fill()
      }
      
      // Center
      this.ctx.beginPath()
      this.ctx.arc(0, 0, 5 * veg.size, 0, Math.PI * 2)
      this.ctx.fill()
      
      this.ctx.restore()
    })
  }

  drawGround() {
    // Main ground
    const groundGradient = this.ctx.createLinearGradient(0, this.canvas.height * 0.7, 0, this.canvas.height)
    groundGradient.addColorStop(0, 'hsla(90, 35%, 35%, 0.95)')
    groundGradient.addColorStop(0.5, 'hsla(85, 30%, 30%, 0.95)')
    groundGradient.addColorStop(1, 'hsla(80, 25%, 25%, 0.95)')
    
    this.ctx.fillStyle = groundGradient
    this.ctx.beginPath()
    this.ctx.moveTo(-10, this.canvas.height * 0.7)
    
    // Create natural undulating ground line
    for (let x = -10; x <= this.canvas.width + 20; x += 20) {
      const y = this.canvas.height * 0.7 + Math.sin(x * 0.005) * 10 + Math.cos(x * 0.008) * 5
      this.ctx.lineTo(x, y)
    }
    
    this.ctx.lineTo(this.canvas.width + 10, this.canvas.height)
    this.ctx.lineTo(-10, this.canvas.height)
    this.ctx.closePath()
    this.ctx.fill()
    
    // Add grass texture on top - avoid pond area and make grass fuller
    for (let x = 0; x < this.canvas.width; x += 8) { // Denser grass spacing
      const y = this.canvas.height * 0.7 + Math.sin(x * 0.005) * 10
      
      // Check if this position would be inside the pond
      if (this.pondConfig) {
        const dx = x - this.pondConfig.x
        const dy = y - this.pondConfig.y
        const distToPond = Math.sqrt(dx * dx + (dy / 0.7) * (dy / 0.7))
        
        // Skip grass if inside pond area
        if (distToPond < this.pondConfig.width * 0.48) {
          continue
        }
      }
      
      // Draw fuller grass clusters
      const grassHeight = 8 + Math.random() * 12
      const clusterSize = 3 + Math.floor(Math.random() * 3)
      
      for (let i = 0; i < clusterSize; i++) {
        this.ctx.strokeStyle = `hsla(90, ${35 + Math.random() * 10}%, ${35 + Math.random() * 10}%, 0.4)`
        this.ctx.lineWidth = 1.5
        this.ctx.beginPath()
        const offsetX = x + (Math.random() - 0.5) * 6
        this.ctx.moveTo(offsetX, y)
        const sway = Math.sin(Date.now() * 0.001 + x + i) * 3
        this.ctx.quadraticCurveTo(
          offsetX + sway/2, y - grassHeight/2,
          offsetX + sway, y - grassHeight
        )
        this.ctx.stroke()
      }
    }
  }

  drawTrail() {
    // Draw trail that meanders smoothly through the scene
    this.ctx.strokeStyle = 'hsla(30, 40%, 50%, 0.8)'
    this.ctx.lineWidth = 8
    this.ctx.lineCap = 'round'
    this.ctx.setLineDash([15, 10])
    
    // Generate smoother meandering path points
    const pathPoints = 40 // More points for smoother curves
    this.trailPath = []
    
    // Create control points for a smoother path
    const controlPoints: Array<{x: number, y: number}> = []
    
    for (let i = 0; i <= pathPoints; i++) {
      const t = i / pathPoints
      const x = -50 + (this.canvas.width + 100) * t
      
      // Base Y position with smooth transitions
      let baseY
      if (t < 0.2) {
        baseY = this.canvas.height * 0.62
      } else if (t < 0.4) {
        const localT = (t - 0.2) / 0.2
        baseY = this.canvas.height * (0.62 + 0.08 * localT)
      } else if (t < 0.7) {
        const localT = (t - 0.4) / 0.3
        baseY = this.canvas.height * (0.7 + 0.05 * localT)
      } else {
        baseY = this.canvas.height * 0.75
      }
      
      // Add smooth meandering using multiple sine waves
      const meander1 = Math.sin(t * Math.PI * 3) * 20
      const meander2 = Math.sin(t * Math.PI * 5 + 1) * 10
      const meander3 = Math.cos(t * Math.PI * 2) * 15
      let y = baseY + (meander1 + meander2 + meander3) * 0.5
      
      // Avoid obstacles (pond and trees)
      let avoidanceY = 0
      
      // Avoid pond
      if (this.pondConfig) {
        const pondCenterX = this.pondConfig.x
        const pondCenterY = this.pondConfig.y
        const pondRadius = Math.max(this.pondConfig.width, this.pondConfig.height) / 2 + 60 // Increased clearance for larger pond
        
        const distToPond = Math.sqrt(Math.pow(x - pondCenterX, 2) + Math.pow(y - pondCenterY, 2))
        
        if (distToPond < pondRadius) {
          // Smoothly curve around pond
          const avoidanceStrength = 1 - (distToPond / pondRadius)
          const angleFromPond = Math.atan2(y - pondCenterY, x - pondCenterX)
          avoidanceY = Math.sin(angleFromPond) * pondRadius * avoidanceStrength
          y = pondCenterY + Math.sign(y - pondCenterY) * (pondRadius + 10)
        }
      }
      
      // Avoid trees
      for (const tree of this.trees) {
        const treeRadius = 30 * tree.size
        const distToTree = Math.sqrt(Math.pow(x - tree.x, 2) + Math.pow(y - tree.y, 2))
        
        if (distToTree < treeRadius + 20) {
          // Smoothly curve around tree
          const avoidanceStrength = 1 - (distToTree / (treeRadius + 20))
          const angleFromTree = Math.atan2(y - tree.y, x - tree.x)
          const treeAvoidance = Math.sin(angleFromTree) * (treeRadius + 20) * avoidanceStrength
          y += treeAvoidance
        }
      }
      
      controlPoints.push({ x, y })
    }
    
    // Smooth the path using moving average
    for (let i = 1; i < controlPoints.length - 1; i++) {
      const prev = controlPoints[i - 1]
      const curr = controlPoints[i]
      const next = controlPoints[i + 1]
      
      const smoothX = (prev.x * 0.25 + curr.x * 0.5 + next.x * 0.25)
      const smoothY = (prev.y * 0.25 + curr.y * 0.5 + next.y * 0.25)
      
      this.trailPath.push({ x: smoothX, y: smoothY })
    }
    
    // Add first and last points
    if (controlPoints.length > 0) {
      this.trailPath.unshift(controlPoints[0])
      this.trailPath.push(controlPoints[controlPoints.length - 1])
    }
    
    // Draw the smooth path using bezier curves
    this.ctx.beginPath()
    if (this.trailPath.length > 0) {
      this.ctx.moveTo(this.trailPath[0].x, this.trailPath[0].y)
      
      for (let i = 1; i < this.trailPath.length - 1; i++) {
        const xc = (this.trailPath[i].x + this.trailPath[i + 1].x) / 2
        const yc = (this.trailPath[i].y + this.trailPath[i + 1].y) / 2
        this.ctx.quadraticCurveTo(this.trailPath[i].x, this.trailPath[i].y, xc, yc)
      }
      
      // Last point
      const last = this.trailPath[this.trailPath.length - 1]
      this.ctx.lineTo(last.x, last.y)
    }
    
    this.ctx.stroke()
    this.ctx.setLineDash([])
    
    // Trail markers/signs along the path
    const markerIndices = [8, 16, 24, 32]
    for (const idx of markerIndices) {
      if (idx < this.trailPath.length) {
        const point = this.trailPath[idx]
        const x = point.x
        const y = point.y
        
        // Sign post
        this.ctx.fillStyle = 'hsla(30, 40%, 35%, 0.9)'
        this.ctx.fillRect(x - 2, y - 30, 4, 30)
        
        // Sign
        this.ctx.fillStyle = 'hsla(40, 60%, 70%, 0.9)'
        this.ctx.fillRect(x - 15, y - 35, 30, 15)
        
        // Arrow
        this.ctx.strokeStyle = 'hsla(30, 40%, 30%, 0.9)'
        this.ctx.lineWidth = 2
        this.ctx.beginPath()
        this.ctx.moveTo(x - 8, y - 27)
        this.ctx.lineTo(x + 8, y - 27)
        this.ctx.lineTo(x + 2, y - 30)
        this.ctx.moveTo(x + 8, y - 27)
        this.ctx.lineTo(x + 2, y - 24)
        this.ctx.stroke()
      }
    }
  }

  getMountainPath(): Path2D {
    return this.mountainPath
  }

  getTrailPath(): Array<{x: number, y: number}> {
    return this.trailPath
  }
}