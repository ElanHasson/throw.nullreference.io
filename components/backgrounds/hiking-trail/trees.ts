import { TreePosition, Bird } from './types'

export class Trees {
  private trees: TreePosition[] = []
  private birdPeekTimer = 0
  private peekingBird: {tree: TreePosition, angle: number} | null = null

  constructor(private ctx: CanvasRenderingContext2D, private canvas: HTMLCanvasElement) {
    this.generateTrees()
  }

  private generateTrees() {
    const treeCount = 12 + Math.floor(Math.random() * 8)
    for (let i = 0; i < treeCount; i++) {
      const x = Math.random() * this.canvas.width
      // Position trees on the ground with natural variation
      // Trees behind mountains (0.6-0.65), on mid-ground (0.65-0.7), and foreground (0.7-0.8)
      let y
      const zone = Math.random()
      if (zone < 0.3) {
        // Behind mountains
        y = this.canvas.height * (0.6 + Math.random() * 0.05)
      } else if (zone < 0.7) {
        // Mid-ground
        y = this.canvas.height * (0.65 + Math.random() * 0.05)
      } else {
        // Foreground
        y = this.canvas.height * (0.7 + Math.random() * 0.1)
      }
      
      this.trees.push({
        x,
        y,
        size: 0.8 + Math.random() * 0.5,
        type: Math.random() > 0.4 ? 'pine' : 'deciduous',
        layers: 3 + Math.floor(Math.random() * 3),
        groundDetail: Math.random(),
        canopyVariation: Array(5).fill(0).map(() => 0.8 + Math.random() * 0.4),
        hasBird: Math.random() > 0.7,
        hasOwl: false,
        leafRustleTimer: 0
      })
    }
    this.trees.sort((a, b) => a.y - b.y)
  }

  update() {
    // Update leaf rustle timers for owl interactions
    this.trees.forEach(tree => {
      if (tree.leafRustleTimer && tree.leafRustleTimer > 0) {
        tree.leafRustleTimer--
      }
    })
    
    // Bird peeking animation
    this.birdPeekTimer++
    if (this.birdPeekTimer > 300 && !this.peekingBird) {
      const deciduousTrees = this.trees.filter(t => t.type === 'deciduous' && t.hasBird)
      if (deciduousTrees.length > 0 && Math.random() > 0.7) {
        const tree = deciduousTrees[Math.floor(Math.random() * deciduousTrees.length)]
        this.peekingBird = {
          tree,
          angle: Math.random() * Math.PI * 2
        }
        this.birdPeekTimer = 0
      }
    }
    
    if (this.peekingBird && this.birdPeekTimer > 120) {
      this.peekingBird = null
      this.birdPeekTimer = 0
    }
  }

  draw() {
    this.trees.forEach(tree => {
      this.ctx.save()
      this.ctx.translate(tree.x, tree.y)
      
      if (tree.type === 'pine') {
        this.drawPineTree(tree)
      } else {
        this.drawDeciduousTree(tree)
      }
      
      // Draw ground details around trunk
      this.drawGroundDetails(tree)
      
      this.ctx.restore()
    })
  }

  private drawPineTree(tree: TreePosition) {
    // Trunk
    const trunkWidth = 8 * tree.size
    const trunkHeight = 60 * tree.size
    
    const trunkGradient = this.ctx.createLinearGradient(-trunkWidth/2, 0, trunkWidth/2, 0)
    trunkGradient.addColorStop(0, 'hsla(25, 40%, 25%, 0.95)')
    trunkGradient.addColorStop(0.5, 'hsla(25, 45%, 30%, 0.95)')
    trunkGradient.addColorStop(1, 'hsla(25, 35%, 20%, 0.95)')
    
    this.ctx.fillStyle = trunkGradient
    this.ctx.fillRect(-trunkWidth/2, -trunkHeight, trunkWidth, trunkHeight)
    
    // Pine needle layers
    for (let layer = 0; layer < tree.layers; layer++) {
      const layerY = -trunkHeight - layer * 15 * tree.size
      const layerWidth = (40 - layer * 8) * tree.size
      
      this.ctx.fillStyle = `hsla(${120 + layer * 5}, ${40 - layer * 5}%, ${20 + layer * 3}%, 0.9)`
      
      this.ctx.beginPath()
      this.ctx.moveTo(0, layerY - 20 * tree.size)
      this.ctx.lineTo(-layerWidth, layerY)
      this.ctx.lineTo(layerWidth, layerY)
      this.ctx.closePath()
      this.ctx.fill()
    }
  }

  private drawDeciduousTree(tree: TreePosition) {
    // Trunk with texture
    const trunkWidth = 12 * tree.size
    const trunkHeight = 50 * tree.size
    
    const trunkGradient = this.ctx.createLinearGradient(-trunkWidth/2, 0, trunkWidth/2, 0)
    trunkGradient.addColorStop(0, 'hsla(25, 35%, 28%, 0.95)')
    trunkGradient.addColorStop(0.3, 'hsla(25, 40%, 35%, 0.95)')
    trunkGradient.addColorStop(0.7, 'hsla(25, 38%, 32%, 0.95)')
    trunkGradient.addColorStop(1, 'hsla(25, 33%, 25%, 0.95)')
    
    this.ctx.fillStyle = trunkGradient
    this.ctx.fillRect(-trunkWidth/2, -trunkHeight, trunkWidth, trunkHeight)
    
    // Add bark texture
    this.ctx.strokeStyle = 'hsla(25, 30%, 20%, 0.3)'
    this.ctx.lineWidth = 1
    for (let i = 0; i < 5; i++) {
      const x = -trunkWidth/2 + i * (trunkWidth/4)
      this.ctx.beginPath()
      this.ctx.moveTo(x, -trunkHeight)
      this.ctx.lineTo(x + Math.sin(i) * 2, 0)
      this.ctx.stroke()
    }
    
    // Varied canopy shape
    const canopyRadius = 35 * tree.size
    const canopyY = -trunkHeight - canopyRadius/2
    
    // Add rustling effect if owl is entering/exiting
    let rustleOffset = 0
    if (tree.leafRustleTimer && tree.leafRustleTimer > 0) {
      rustleOffset = Math.sin(tree.leafRustleTimer * 0.5) * 2
    }
    
    this.ctx.fillStyle = `hsla(${100 + Math.sin(tree.x) * 10}, 45%, 25%, 0.9)`
    
    // Draw smooth canopy using quadratic curves
    this.ctx.beginPath()
    const points: Array<{x: number, y: number}> = []
    
    // Generate points around the canopy
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      const variationIndex = Math.floor((angle / (Math.PI * 2)) * tree.canopyVariation.length)
      const radius = canopyRadius * tree.canopyVariation[variationIndex]
      const x = Math.cos(angle) * radius + rustleOffset * Math.cos(angle * 3)
      const y = canopyY + Math.sin(angle) * radius * 0.8 + rustleOffset * Math.sin(angle * 3)
      points.push({x, y})
    }
    
    // Draw smooth curves through the points
    this.ctx.moveTo(points[0].x, points[0].y)
    for (let i = 0; i < points.length; i++) {
      const current = points[i]
      const next = points[(i + 1) % points.length]
      const afterNext = points[(i + 2) % points.length]
      
      // Calculate control point
      const cpX = (current.x + next.x) / 2
      const cpY = (current.y + next.y) / 2
      
      // Draw quadratic curve
      this.ctx.quadraticCurveTo(current.x, current.y, cpX, cpY)
    }
    this.ctx.closePath()
    this.ctx.fill()
    
    // Bird peeking out
    if (this.peekingBird && this.peekingBird.tree === tree) {
      const birdX = Math.cos(this.peekingBird.angle) * canopyRadius * 0.7
      const birdY = canopyY + Math.sin(this.peekingBird.angle) * canopyRadius * 0.5
      
      // Bird head
      this.ctx.fillStyle = 'hsla(30, 60%, 40%, 1)'
      this.ctx.beginPath()
      this.ctx.arc(birdX, birdY, 4, 0, Math.PI * 2)
      this.ctx.fill()
      
      // Eye
      this.ctx.fillStyle = 'black'
      this.ctx.beginPath()
      this.ctx.arc(birdX + 1, birdY - 1, 1, 0, Math.PI * 2)
      this.ctx.fill()
      
      // Beak
      this.ctx.fillStyle = 'hsla(40, 70%, 50%, 1)'
      this.ctx.beginPath()
      this.ctx.moveTo(birdX + 3, birdY)
      this.ctx.lineTo(birdX + 6, birdY)
      this.ctx.lineTo(birdX + 3, birdY + 2)
      this.ctx.closePath()
      this.ctx.fill()
    }
  }

  private drawGroundDetails(tree: TreePosition) {
    if (tree.groundDetail > 0.3) {
      const detailAmount = tree.groundDetail
      
      // Draw dirt/shrubs around trunk base
      this.ctx.fillStyle = `hsla(30, 35%, 35%, ${0.3 + detailAmount * 0.3})`
      
      // Dirt mound
      this.ctx.beginPath()
      this.ctx.ellipse(0, 0, 15 * tree.size * detailAmount, 5 * tree.size * detailAmount, 0, 0, Math.PI * 2)
      this.ctx.fill()
      
      // Small shrubs
      if (detailAmount > 0.5) {
        const shrubCount = Math.floor(2 + detailAmount * 3)
        for (let i = 0; i < shrubCount; i++) {
          const angle = (Math.PI * 2 / shrubCount) * i
          const dist = 10 + detailAmount * 10
          const shrubX = Math.cos(angle) * dist * tree.size
          const shrubY = Math.sin(angle) * 3 * tree.size
          
          this.ctx.fillStyle = `hsla(${90 + Math.random() * 20}, 35%, 30%, 0.7)`
          this.ctx.beginPath()
          this.ctx.arc(shrubX, shrubY, 3 + detailAmount * 3, 0, Math.PI * 2)
          this.ctx.fill()
        }
      }
    }
  }

  getTrees(): TreePosition[] {
    return this.trees
  }
}