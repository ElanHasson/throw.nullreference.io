// Canvas background worker for offscreen rendering
let canvas: OffscreenCanvas | null = null
let ctx: OffscreenCanvasRenderingContext2D | null = null
let animationId: number | null = null
let backgroundType: string = ''
let intensity: 'low' | 'medium' | 'high' = 'medium'

// Animation state
const state: any = {
  time: 0,
  windStrength: 0,
  windTarget: 0,
  dayNightCycle: 0,
  colorShift: 0,
  scrollOffset: 0,
  rotation: 0,
  pulsePhase: 0,
  trees: [] as any[],
  creatures: [] as any[],
  animals: [] as any[],
  clouds: [] as any[],
  nodes: [] as any[],
  dataStreams: [] as any[],
  drops: [] as any[],
  particles: [] as any[],
  signalWaves: [] as any[],
  mouseX: 0,
  mouseY: 0
}

// Message handler
self.addEventListener('message', (event) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'init':
      initCanvas(data.canvas, data.backgroundType, data.intensity)
      break
    case 'resize':
      resizeCanvas(data.width, data.height)
      break
    case 'mouse':
      state.mouseX = data.x
      state.mouseY = data.y
      break
    case 'stop':
      stopAnimation()
      break
    case 'updateIntensity':
      intensity = data.intensity
      reinitializeBackground()
      break
  }
})

function initCanvas(offscreenCanvas: OffscreenCanvas, bgType: string, bgIntensity: 'low' | 'medium' | 'high') {
  canvas = offscreenCanvas
  ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
  backgroundType = bgType
  intensity = bgIntensity
  
  if (!ctx) {
    self.postMessage({ type: 'error', message: 'Failed to get 2D context' })
    return
  }
  
  initializeBackground()
  startAnimation()
}

function resizeCanvas(width: number, height: number) {
  if (!canvas) return
  
  canvas!.width = width
  canvas!.height = height
  
  // Reinitialize positions based on new dimensions
  reinitializeBackground()
}

function stopAnimation() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

function startAnimation() {
  if (!ctx || !canvas) return
  
  const animate = () => {
    if (!ctx || !canvas) return
    
    // Call the appropriate animation function based on type
    switch (backgroundType) {
      case 'ecosystem':
        animateEcosystem()
        break
      case 'fractal-tree':
        animateFractalTrees()
        break
      case 'neural-network':
        animateNeuralNetwork()
        break
      case 'cyber-grid':
        animateCyberGrid()
        break
      case 'geometric-grid':
        animateGeometricGrid()
        break
      case 'code-rain':
        animateCodeRain()
        break
      case 'matrix-rain':
        animateMatrixRain()
        break
      case 'wave-motion':
        animateWaveMotion()
        break
      case 'particles':
        animateParticles()
        break
    }
    
    animationId = requestAnimationFrame(animate)
  }
  
  animate()
}

function initializeBackground() {
  if (!canvas) return
  
  switch (backgroundType) {
    case 'ecosystem':
      initializeEcosystem()
      break
    case 'fractal-tree':
      initializeFractalTrees()
      break
    case 'neural-network':
      initializeNeuralNetwork()
      break
    case 'cyber-grid':
      initializeCyberGrid()
      break
    case 'code-rain':
      initializeCodeRain()
      break
    case 'matrix-rain':
      initializeMatrixRain()
      break
    case 'particles':
      initializeParticles()
      break
  }
}

function reinitializeBackground() {
  // Adjust existing elements to new canvas dimensions
  if (!canvas) return
  
  switch (backgroundType) {
    case 'ecosystem':
      // Recalculate tree positions
      const treeCount = state.trees.length
      state.trees.forEach((tree: any, i: number) => {
        tree.x = (canvas!.width / (treeCount + 1)) * (i + 1)
      })
      // Redistribute animals
      state.animals.forEach((animal: any) => {
        animal.x = Math.random() * canvas!.width
      })
      break
    case 'fractal-tree':
      const count = state.trees.length
      state.trees.forEach((tree: any, i: number) => {
        tree.x = (canvas!.width / (count + 1)) * (i + 1)
      })
      break
    case 'code-rain':
    case 'matrix-rain':
      const fontSize = backgroundType === 'code-rain' 
        ? (intensity === 'low' ? 20 : intensity === 'high' ? 12 : 14)
        : (intensity === 'low' ? 20 : intensity === 'high' ? 12 : 16)
      const columns = Math.floor(canvas!.width / fontSize)
      
      // Adjust drops array
      if (columns > state.drops.length) {
        for (let i = state.drops.length; i < columns; i++) {
          state.drops[i] = Math.random() * -100
        }
      } else {
        state.drops.length = columns
      }
      break
  }
}

// Initialize functions for each background type
function initializeEcosystem() {
  if (!canvas) return
  
  const treeCount = intensity === 'low' ? 2 : intensity === 'high' ? 4 : 3
  const creatureCount = intensity === 'low' ? 5 : intensity === 'high' ? 15 : 10
  const animalCount = intensity === 'low' ? 3 : intensity === 'high' ? 8 : 5
  
  // Initialize trees
  state.trees = Array(treeCount).fill(0).map((_, i) => ({
    x: (canvas!.width / (treeCount + 1)) * (i + 1),
    baseAngle: -Math.PI / 2 + (Math.random() - 0.5) * 0.1,
    growthRate: 0.3 + Math.random() * 0.2,
    phase: Math.random() * Math.PI * 2,
    size: 0.7 + Math.random() * 0.3,
    branches: []
  }))
  
  // Initialize creatures
  state.creatures = Array(creatureCount).fill(0).map(() => ({
    branchIndex: Math.floor(Math.random() * state.trees.length),
    position: Math.random(),
    size: 0.5 + Math.random() * 0.5,
    color: Math.random() * 360,
    wingPhase: Math.random() * Math.PI * 2,
    type: ['butterfly', 'bird', 'dragonfly', 'fairy'][Math.floor(Math.random() * 4)]
  }))
  
  // Initialize animals
  state.animals = Array(animalCount).fill(0).map(() => ({
    x: Math.random() * canvas!.width,
    y: canvas!.height - 20 - Math.random() * 50,
    vx: (Math.random() - 0.5) * 2,
    size: 0.7 + Math.random() * 0.5,
    type: ['rabbit', 'fox', 'deer', 'squirrel'][Math.floor(Math.random() * 4)],
    animPhase: Math.random() * Math.PI * 2,
    color: 20 + Math.random() * 40,
    jumpHeight: 0
  }))
  
  // Initialize clouds
  state.clouds = Array(5).fill(0).map(() => ({
    x: Math.random() * canvas!.width,
    y: 50 + Math.random() * 150,
    size: 50 + Math.random() * 100,
    opacity: 0.3 + Math.random() * 0.3,
    speed: 0.1 + Math.random() * 0.3
  }))
}

function initializeFractalTrees() {
  if (!canvas) return
  
  const treeCount = intensity === 'low' ? 3 : intensity === 'high' ? 7 : 5
  
  state.trees = Array(treeCount).fill(0).map((_, i) => ({
    x: (canvas!.width / (treeCount + 1)) * (i + 1),
    baseAngle: -Math.PI / 2 + (Math.random() - 0.5) * 0.2,
    growthRate: 0.3 + Math.random() * 0.3,
    phase: Math.random() * Math.PI * 2,
    size: 0.8 + Math.random() * 0.4
  }))
}

function initializeNeuralNetwork() {
  if (!canvas) return
  
  const nodeCount = intensity === 'low' ? 20 : intensity === 'high' ? 50 : 35
  
  state.nodes = []
  for (let i = 0; i < nodeCount; i++) {
    const layer = Math.floor(i / (nodeCount / 5))
    state.nodes.push({
      x: Math.random() * canvas!.width,
      y: Math.random() * canvas!.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      connections: [],
      layer,
      activity: Math.random(),
      hue: 200 + Math.random() * 160
    })
  }
  
  // Create connections
  state.nodes.forEach((node: any, i: number) => {
    const connectionCount = Math.floor(Math.random() * 3) + 1
    for (let j = 0; j < connectionCount; j++) {
      const layerBias = Math.random() > 0.3 ? 1 : Math.floor(Math.random() * 3)
      const targetLayer = Math.min(4, node.layer + layerBias)
      const layerNodes = state.nodes.filter((n: any, idx: number) => n.layer === targetLayer && idx !== i)
      
      if (layerNodes.length > 0) {
        const target = state.nodes.indexOf(layerNodes[Math.floor(Math.random() * layerNodes.length)])
        if (target !== -1 && !node.connections.includes(target)) {
          node.connections.push(target)
        }
      }
    }
  })
  
  state.signalWaves = []
}

function initializeCyberGrid() {
  if (!canvas) return
  
  state.dataStreams = []
  for (let i = 0; i < (intensity === 'low' ? 3 : intensity === 'high' ? 8 : 5); i++) {
    state.dataStreams.push({
      lane: Math.floor(Math.random() * 10) - 5,
      position: Math.random() * 100,
      speed: 0.5 + Math.random() * 1.5,
      length: 10 + Math.random() * 20,
      hue: Math.random() * 60 + 160
    })
  }
}

function initializeCodeRain() {
  if (!canvas) return
  
  const fontSize = intensity === 'low' ? 20 : intensity === 'high' ? 12 : 14
  const columns = Math.floor(canvas!.width / fontSize)
  
  state.drops = []
  for (let i = 0; i < columns; i++) {
    state.drops[i] = Math.random() * -100
  }
}

function initializeMatrixRain() {
  if (!canvas) return
  
  const fontSize = intensity === 'low' ? 20 : intensity === 'high' ? 12 : 16
  const columns = Math.floor(canvas!.width / fontSize)
  
  state.drops = []
  for (let i = 0; i < columns; i++) {
    state.drops[i] = 1
  }
}

function initializeParticles() {
  if (!canvas) return
  
  const particleCount = intensity === 'low' ? 50 : intensity === 'high' ? 150 : 100
  
  state.particles = []
  for (let i = 0; i < particleCount; i++) {
    state.particles.push({
      x: Math.random() * canvas!.width,
      y: Math.random() * canvas!.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1
    })
  }
}

// Simplified animation functions (focusing on ecosystem as example)
function animateEcosystem() {
  if (!ctx || !canvas) return
  
  // Update state
  state.time++
  state.dayNightCycle = (Math.sin(state.time * 0.0005) + 1) / 2
  
  // Wind effect
  if (Math.random() > 0.98) {
    state.windTarget = (Math.random() - 0.5) * 1.5
  }
  state.windStrength += (state.windTarget - state.windStrength) * 0.02
  
  // Clear and draw sky
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas!.height)
  if (state.dayNightCycle > 0.5) {
    skyGradient.addColorStop(0, `hsl(200, 70%, ${50 + state.dayNightCycle * 30}%)`)
    skyGradient.addColorStop(1, `hsl(180, 50%, ${70 + state.dayNightCycle * 15}%)`)
  } else {
    skyGradient.addColorStop(0, `hsl(240, 80%, ${5 + state.dayNightCycle * 10}%)`)
    skyGradient.addColorStop(1, `hsl(220, 60%, ${15 + state.dayNightCycle * 20}%)`)
  }
  
  ctx!.fillStyle = skyGradient
  ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
  
  // Draw sun/moon
  const sunX = canvas!.width * 0.8
  const sunY = 100 + Math.sin(state.dayNightCycle * Math.PI) * 50
  const isDay = Math.cos(state.dayNightCycle * Math.PI * 2) > 0
  
  if (isDay) {
    ctx!.fillStyle = 'hsl(45, 100%, 65%)'
    ctx!.beginPath()
    ctx!.arc(sunX, sunY, 40, 0, Math.PI * 2)
    ctx!.fill()
  } else {
    ctx!.fillStyle = 'hsla(220, 20%, 85%, 0.9)'
    ctx!.beginPath()
    ctx!.arc(sunX, sunY, 35, 0, Math.PI * 2)
    ctx!.fill()
  }
  
  // Update and draw clouds
  state.clouds.forEach((cloud: any) => {
    cloud.x += cloud.speed
    if (cloud.x > canvas!.width + cloud.size) {
      cloud.x = -cloud.size
    }
    
    ctx!.fillStyle = `hsla(0, 0%, 85%, ${cloud.opacity})`
    ctx!.beginPath()
    ctx!.arc(cloud.x, cloud.y, cloud.size * 0.5, 0, Math.PI * 2)
    ctx!.fill()
  })
  
  // Draw mountains (simplified)
  for (let i = 0; i < 5; i++) {
    const x = (canvas!.width / 5) * i
    const width = canvas!.width / 5 + 50
    const height = 200 + Math.sin(i * 0.5) * 100
    
    ctx!.fillStyle = `hsla(220, 25%, 35%, 0.6)`
    ctx!.beginPath()
    ctx!.moveTo(x, canvas!.height * 0.7)
    ctx!.lineTo(x + width / 2, canvas!.height * 0.7 - height)
    ctx!.lineTo(x + width, canvas!.height * 0.7)
    ctx!.closePath()
    ctx!.fill()
  }
  
  // Draw trees (simplified)
  state.trees.forEach((tree: any) => {
    const growthCycle = Math.sin(state.time * tree.growthRate * 0.01 + tree.phase)
    const growthFactor = 0.7 + (growthCycle + 1) * 0.15
    
    // Simple tree trunk
    ctx!.strokeStyle = 'hsla(25, 40%, 20%, 0.9)'
    ctx!.lineWidth = 5
    ctx!.beginPath()
    ctx!.moveTo(tree.x, canvas!.height - 80)
    ctx!.lineTo(tree.x, canvas!.height - 80 - 100 * growthFactor)
    ctx!.stroke()
    
    // Simple leaves
    ctx!.fillStyle = `hsla(90, 60%, 40%, 0.7)`
    ctx!.beginPath()
    ctx!.arc(tree.x, canvas!.height - 80 - 100 * growthFactor, 30 * growthFactor, 0, Math.PI * 2)
    ctx!.fill()
  })
  
  // Update animals
  state.animals.forEach((animal: any) => {
    animal.animPhase += 0.1
    animal.x += animal.vx
    
    if (animal.x < 0 || animal.x > canvas!.width) {
      animal.vx *= -1
      animal.x = Math.max(0, Math.min(canvas!.width, animal.x))
    }
    
    // Simple animal shape
    ctx!.fillStyle = `hsl(${animal.color}, 40%, 35%)`
    ctx!.beginPath()
    ctx!.ellipse(animal.x, animal.y, 10 * animal.size, 6 * animal.size, 0, 0, Math.PI * 2)
    ctx!.fill()
  })
  
  // Draw ground
  ctx!.fillStyle = `hsla(90, 40%, 25%, 0.9)`
  ctx!.fillRect(0, canvas!.height - 100, canvas!.width, 100)
}

// Add other animation functions in simplified form...
function animateFractalTrees() {
  if (!ctx || !canvas) return
  
  ctx!.fillStyle = 'rgba(255, 255, 255, 0.03)'
  ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
  
  state.time++
  
  // Simplified fractal tree animation
  state.trees.forEach((tree: any) => {
    const growthCycle = Math.sin(state.time * tree.growthRate * 0.01 + tree.phase)
    const growthFactor = 0.3 + (growthCycle + 1) * 0.35
    
    drawSimpleBranch(tree.x, canvas!.height, tree.baseAngle, 8, canvas!.height / 5 * tree.size, growthFactor)
  })
}

function drawSimpleBranch(x: number, y: number, angle: number, depth: number, length: number, growthFactor: number) {
  if (!ctx || depth === 0 || growthFactor <= 0) return
  
  const endX = x + Math.cos(angle) * length * growthFactor
  const endY = y + Math.sin(angle) * length * growthFactor
  
  ctx!.strokeStyle = `hsla(25, 40%, ${20 + depth * 3}%, 0.9)`
  ctx!.lineWidth = Math.max(depth * 0.5, 0.5)
  ctx!.beginPath()
  ctx!.moveTo(x, y)
  ctx!.lineTo(endX, endY)
  ctx!.stroke()
  
  const angleVariation = Math.PI / 6
  drawSimpleBranch(endX, endY, angle - angleVariation, depth - 1, length * 0.75, growthFactor)
  drawSimpleBranch(endX, endY, angle + angleVariation, depth - 1, length * 0.75, growthFactor)
}

function animateNeuralNetwork() {
  if (!ctx || !canvas) return
  
  ctx!.fillStyle = 'rgba(255, 255, 255, 0.02)'
  ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
  
  state.pulsePhase = (state.pulsePhase || 0) + 0.02
  state.time++
  
  // Update nodes
  state.nodes.forEach((node: any) => {
    node.x += node.vx
    node.y += node.vy
    
    if (node.x < 0 || node.x > canvas!.width) node.vx *= -1
    if (node.y < 0 || node.y > canvas!.height) node.vy *= -1
    
    node.activity *= 0.98
    node.hue = (node.hue + 0.1) % 360
  })
  
  // Draw connections
  state.nodes.forEach((node: any, i: number) => {
    node.connections.forEach((targetIndex: number) => {
      const target = state.nodes[targetIndex]
      if (!target) return
      
      const dx = target.x - node.x
      const dy = target.y - node.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 300) {
        const pulse = Math.sin(state.pulsePhase + i * 0.5) * 0.5 + 0.5
        ctx!.strokeStyle = `hsla(${node.hue}, 70%, 50%, ${0.1 + pulse * 0.2})`
        ctx!.lineWidth = 0.5 + pulse * 0.5
        ctx!.beginPath()
        ctx!.moveTo(node.x, node.y)
        ctx!.lineTo(target.x, target.y)
        ctx!.stroke()
      }
    })
  })
  
  // Draw nodes
  state.nodes.forEach((node: any, i: number) => {
    const pulse = Math.sin(state.pulsePhase + i * 0.5) * 0.5 + 0.5
    const size = 3 + pulse * 2
    
    ctx!.fillStyle = `hsla(${node.hue}, 70%, 50%, ${0.6 + pulse * 0.4})`
    ctx!.beginPath()
    ctx!.arc(node.x, node.y, size, 0, Math.PI * 2)
    ctx!.fill()
  })
}

function animateCyberGrid() {
  if (!ctx || !canvas) return
  
  ctx!.fillStyle = 'rgba(0, 0, 10, 0.1)'
  ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
  
  state.time = (state.time || 0) + 0.01
  state.scrollOffset = (state.scrollOffset || 0) + 0.5
  state.colorShift = Math.sin(state.time) * 30
  
  const gridSpacing = intensity === 'low' ? 50 : intensity === 'high' ? 25 : 35
  const horizon = canvas!.height * 0.5
  const vanishingPoint = { x: canvas!.width / 2, y: horizon }
  
  // Draw grid lines
  const lineOffset = state.scrollOffset % gridSpacing
  for (let y = horizon; y < canvas!.height + gridSpacing; y += gridSpacing) {
    const adjustedY = y + lineOffset
    if (adjustedY < horizon) continue
    
    const progress = (adjustedY - horizon) / (canvas!.height - horizon)
    const hue = 180 + state.colorShift + progress * 40
    
    ctx!.strokeStyle = `hsla(${hue}, 100%, 50%, ${0.4 - progress * 0.3})`
    ctx!.lineWidth = 1 + progress * 2
    ctx!.beginPath()
    ctx!.moveTo(0, adjustedY)
    ctx!.lineTo(canvas!.width, adjustedY)
    ctx!.stroke()
  }
  
  // Update data streams
  state.dataStreams.forEach((stream: any) => {
    stream.position += stream.speed
    if (stream.position > 100) {
      stream.position = -stream.length
      stream.lane = Math.floor(Math.random() * 10) - 5
    }
  })
}

function animateGeometricGrid() {
  if (!ctx || !canvas) return
  
  ctx!.fillStyle = 'rgba(255, 255, 255, 0.02)'
  ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
  
  state.rotation = (state.rotation || 0) + 0.005
  state.time = (state.time || 0) + 1
  state.colorShift = Math.sin(state.time * 0.001) * 360
  
  const gridSize = intensity === 'low' ? 80 : intensity === 'high' ? 40 : 60
  
  ctx!.save()
  ctx!.translate(canvas!.width / 2, canvas!.height / 2)
  ctx!.rotate(state.rotation)
  ctx!.translate(-canvas.width / 2, -canvas.height / 2)
  
  for (let x = -gridSize; x < canvas!.width + gridSize * 2; x += gridSize) {
    for (let y = -gridSize; y < canvas!.height + gridSize * 2; y += gridSize) {
      const distanceFromCenter = Math.sqrt(
        Math.pow(x - canvas!.width / 2, 2) + 
        Math.pow(y - canvas!.height / 2, 2)
      )
      
      const scale = Math.sin(distanceFromCenter * 0.005 - state.rotation * 5) * 0.5 + 0.5
      const hue = (distanceFromCenter * 0.5 + state.colorShift) % 360
      
      ctx!.strokeStyle = `hsla(${hue}, 60%, 50%, ${0.1 + scale * 0.2})`
      ctx!.lineWidth = 0.5 + scale
      ctx!.beginPath()
      ctx!.rect(
        x - gridSize / 2 * scale,
        y - gridSize / 2 * scale,
        gridSize * scale,
        gridSize * scale
      )
      ctx!.stroke()
    }
  }
  
  ctx!.restore()
}

function animateCodeRain() {
  if (!ctx || !canvas) return
  
  ctx!.fillStyle = 'rgba(255, 255, 255, 0.05)'
  ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
  
  const fontSize = intensity === 'low' ? 20 : intensity === 'high' ? 12 : 14
  const codeChars = 'const function return async await class extends import export default => {} [] () ; : , . < > / = + - * & | ! ?'.split(' ')
  
  ctx!.fillStyle = 'rgba(16, 185, 129, 0.8)'
  ctx!.font = `${fontSize}px monospace`
  
  state.drops.forEach((drop: number, i: number) => {
    const char = codeChars[Math.floor(Math.random() * codeChars.length)]
    const x = i * fontSize
    const y = drop * fontSize
    
    ctx!.fillText(char, x, y)
    
    if (y > canvas!.height && Math.random() > 0.975) {
      state.drops[i] = 0
    }
    
    state.drops[i]++
  })
}

function animateMatrixRain() {
  if (!ctx || !canvas) return
  
  ctx!.fillStyle = 'rgba(0, 0, 0, 0.05)'
  ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
  
  const fontSize = intensity === 'low' ? 20 : intensity === 'high' ? 12 : 16
  const matrix = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  
  ctx!.fillStyle = '#0F0'
  ctx!.font = `${fontSize}px monospace`
  
  state.drops.forEach((drop: number, i: number) => {
    const char = matrix[Math.floor(Math.random() * matrix.length)]
    ctx!.fillText(char, i * fontSize, drop * fontSize)
    
    if (drop * fontSize > canvas!.height && Math.random() > 0.975) {
      state.drops[i] = 1
    }
    
    state.drops[i]++
  })
}

function animateWaveMotion() {
  if (!ctx || !canvas) return
  
  ctx!.fillStyle = 'rgba(255, 255, 255, 0.02)'
  ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
  
  state.time = (state.time || 0) + 0.01
  
  const waveCount = intensity === 'low' ? 3 : intensity === 'high' ? 8 : 5
  
  for (let w = 0; w < waveCount; w++) {
    ctx!.strokeStyle = `hsla(${200 + w * 30}, 70%, 50%, 0.3)`
    ctx!.lineWidth = 2
    ctx!.beginPath()
    
    for (let x = 0; x <= canvas!.width; x += 10) {
      const y = canvas!.height / 2 + 
        Math.sin(x * 0.01 + state.time + w * 0.5) * 50 +
        Math.sin(x * 0.02 - state.time * 1.5 + w) * 30
      
      if (x === 0) {
        ctx!.moveTo(x, y)
      } else {
        ctx!.lineTo(x, y)
      }
    }
    
    ctx!.stroke()
  }
}

function animateParticles() {
  if (!ctx || !canvas) return
  
  ctx!.fillStyle = 'rgba(255, 255, 255, 0.05)'
  ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
  
  // Update particles
  state.particles.forEach((particle: any) => {
    // Move towards mouse
    const dx = state.mouseX - particle.x
    const dy = state.mouseY - particle.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < 100) {
      particle.vx += dx * 0.0001
      particle.vy += dy * 0.0001
    }
    
    particle.x += particle.vx
    particle.y += particle.vy
    
    // Bounce off walls
    if (particle.x < 0 || particle.x > canvas!.width) {
      particle.vx *= -0.9
      particle.x = Math.max(0, Math.min(canvas!.width, particle.x))
    }
    if (particle.y < 0 || particle.y > canvas!.height) {
      particle.vy *= -0.9
      particle.y = Math.max(0, Math.min(canvas!.height, particle.y))
    }
    
    // Damping
    particle.vx *= 0.99
    particle.vy *= 0.99
  })
  
  // Draw connections
  state.particles.forEach((p1: any, i: number) => {
    state.particles.slice(i + 1).forEach((p2: any) => {
      const dx = p2.x - p1.x
      const dy = p2.y - p1.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 100) {
        ctx!.strokeStyle = `rgba(147, 51, 234, ${0.2 * (1 - distance / 100)})`
        ctx!.lineWidth = 0.5
        ctx!.beginPath()
        ctx!.moveTo(p1.x, p1.y)
        ctx!.lineTo(p2.x, p2.y)
        ctx!.stroke()
      }
    })
  })
  
  // Draw particles
  state.particles.forEach((particle: any) => {
    ctx!.fillStyle = 'rgba(147, 51, 234, 0.6)'
    ctx!.beginPath()
    ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx!.fill()
  })
}

// Export for TypeScript
export {}