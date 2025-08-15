// World import will be handled via function parameter
import { 
  Transform, TimeOfDay, Sky, PixiSprite, Layer, SimulationControl,
  Sun, Mountain, Ground, Trail, Pond, Tree, GrassCluster, Cloud, Location
} from '../components'

export function createTimeController(world: any) {
  // Create time controller entity
  world.buildEntity()
    .with(TimeOfDay, new TimeOfDay(12)) // Start at 12 PM (noon)
    .with(SimulationControl, new SimulationControl())
    .build()
  // Default location; will be updated asynchronously by a setup hook
  world.buildEntity()
    .with(Location, new Location())
    .build()
}

export function createSky(world: any) {
  world.buildEntity()
    .with(Sky, new Sky())
    .with(Transform, new Transform(0, 0))
    .with(PixiSprite, new PixiSprite(null, null, null, Layer.SKY))
    .build()
}

export function createSun(world: any) {
  world.buildEntity()
    .with(Sun, new Sun())
    .with(Transform, new Transform(window.innerWidth * 0.1, window.innerHeight * 0.3))
    .with(PixiSprite, new PixiSprite(null, null, null, Layer.CELESTIAL))
    .build()
}

export function createClouds(world: any) {
  // Create clouds for a brighter, more dynamic sky
  const cloudCount = 5 + Math.floor(Math.random() * 3)
  for (let i = 0; i < cloudCount; i++) {
    const x = Math.random() * window.innerWidth * 1.5 // Some clouds start off-screen
    const y = (window.innerHeight * 0.1) + Math.random() * (window.innerHeight * 0.3)
    world.buildEntity()
      .with(Cloud, new Cloud(2 + Math.floor(Math.random() * 2), 0.2 + Math.random() * 0.3, 0.6 + Math.random() * 0.3))
      .with(Transform, new Transform(x, y))
      .with(PixiSprite, new PixiSprite(null, null, null, Layer.SKY))
      .build()
  }
}

export function createMountains(world: any) {
  // Create mountains: positioned for 1080p widescreen with visible ground
  const mountainLayers = [
    { idx: 0, color: 0x2f405c, baseY: 0.5, peak: [100, 140], jitter: 40, count: 8 }, // far, visible peaks
    { idx: 1, color: 0x3a5273, baseY: 0.55, peak: [80, 110], jitter: 50, count: 10 }, // mid, layered ridges
    { idx: 2, color: 0x4a678a, baseY: 0.6, peak: [60, 90], jitter: 60, count: 12 }, // near, foreground hills
  ]
  
  for (const layer of mountainLayers) {
    const peaks: Array<{ x: number, height: number }> = []
    for (let i = 0; i < layer.count; i++) {
      const t = i / (layer.count - 1)
      const x = t * window.innerWidth + (i === 0 || i === layer.count - 1 ? 0 : (Math.random() - 0.5) * layer.jitter)
      const height = layer.peak[0] + Math.random() * (layer.peak[1] - layer.peak[0])
      peaks.push({ x, height })
    }
    const baseY = window.innerHeight * layer.baseY
    world.buildEntity()
      .with(Mountain, new Mountain(peaks, layer.idx, layer.color))
      .with(Transform, new Transform(0, baseY))
      .with(PixiSprite, new PixiSprite(null, null, null, Layer.MOUNTAINS))
      .build()
  }
}

export function createGround(world: any) {
  // Create ground positioned for 1080p widescreen with clear visibility
  const groundY = window.innerHeight * (0.54 + Math.random() * 0.005)
  world.buildEntity()
    .with(Ground, new Ground(groundY, 0x4A6B4A, true))
    .with(Transform, new Transform(0, groundY))
    .with(PixiSprite, new PixiSprite(null, null, null, Layer.GROUND))
    .build()
  
  return groundY
}

export function createGrass(world: any, groundY: number) {
  const width = window.innerWidth
  
  // Dynamic grass generation optimized for 1080p viewport
  const bands = [
    { count: 40, y: groundY - 80, jitterY: 35, layer: Layer.FAR_TREES },      // far band (on mountain slopes)
    { count: 50, y: groundY - 30, jitterY: 20, layer: Layer.FAR_TREES },      // mid band
    { count: 35, y: groundY - 8, jitterY: 12, layer: Layer.NEAR_TREES },   // near band
  ]
  
  for (const band of bands) {
    for (let i = 0; i < band.count; i++) {
      const x = Math.random() * width
      const y = band.y + (Math.random() - 0.5) * band.jitterY * 2
      const cl = new GrassCluster()
      world.buildEntity()
        .with(GrassCluster, cl)
        .with(Transform, new Transform(x, y))
        .with(PixiSprite, new PixiSprite(null, null, null, band.layer))
        .build()
    }
  }
  
  // Foreground accent clumps (much more to fill the space)
  for (let i = 0; i < 60; i++) {
    const gx = Math.random() * width
    const gy = groundY + (Math.random() - 0.5) * 40 // Spread more around ground level
    const cl = new GrassCluster()
    world.buildEntity()
      .with(GrassCluster, cl)
      .with(Transform, new Transform(gx, gy))
      .with(PixiSprite, new PixiSprite(null, null, null, Layer.NEAR_TREES))
      .build()
  }
  
  // Additional ground-level grass
  for (let i = 0; i < 40; i++) {
    const gx2 = Math.random() * width
    const gy2 = groundY - 20 + Math.random() * 10 // Just below ground level
    const cl = new GrassCluster()
    world.buildEntity()
      .with(GrassCluster, cl)
      .with(Transform, new Transform(gx2, gy2))
      .with(PixiSprite, new PixiSprite(null, null, null, Layer.FAR_TREES))
      .build()
  }
}

export function createPonds(world: any, groundY: number) {
  const width = window.innerWidth
  const height = window.innerHeight
  const groundH = Math.max(100, height - groundY)
  const groundArea = width * groundH
  const baseCount = Math.max(1, Math.round(groundArea / 700_000))
  const count = Math.min(3, Math.max(1, baseCount + (Math.random() < 0.5 ? 0 : 1)))

  const placed: Array<{ x: number; y: number; w: number; h: number }> = []

  for (let i = 0; i < count; i++) {
    let tries = 0
    while (tries++ < 12) {
      const pondW = 420 + Math.random() * 180
      const pondH = 200 + Math.random() * 120
      const marginX = pondW * 0.6
      const pondX = marginX + Math.random() * (width - marginX * 2)
      const topY = groundY + 120
      const maxY = Math.min(height - 120, groundY + 220 + Math.random() * 100)
      const pondY = Math.max(topY, maxY)

      // Avoid overlap using Minkowski metric for axis-aligned ellipses
      const rxA = pondW * 0.5
      const ryA = pondH * 0.5 * 0.65
      let overlaps = false
      for (const p of placed) {
        const dx = pondX - p.x
        const dy = pondY - p.y
        const rxB = p.w * 0.5
        const ryB = p.h * 0.5 * 0.65
        const m = Math.sqrt(
          Math.pow(dx / (rxA + rxB + 20), 2) +
          Math.pow(dy / (ryA + ryB + 20), 2)
        )
        if (m < 1) { overlaps = true; break }
      }
      if (overlaps) continue

      const pond = new Pond([], pondW, pondH)
  world.buildEntity()
        .with(Pond, pond)
        .with(Transform, new Transform(pondX, pondY))
        .with(PixiSprite, new PixiSprite(null, null, null, Layer.POND))
        .build()
      placed.push({ x: pondX, y: pondY, w: pondW, h: pondH })
      break
    }
  }
}

export function createTrail(world: any, groundY: number, pondX: number, pondY: number, pondW: number, pondH: number) {
  const width = window.innerWidth
  const height = window.innerHeight
  
  // Trail: winds through foreground, between trees, to pond
  const treePositions: Array<{x:number,y:number,r:number}> = []
  // Collect approximate tree bases for avoidance (distributed across scene)
  for (let i = 0; i < 20; i++) {
    treePositions.push({ 
      x: Math.random() * width, 
      y: groundY + Math.random() * (height - groundY) * 0.6, // Include foreground trees
      r: 35 + Math.random() * 30 
    })
  }
  
  // Generate sophisticated trail path matching original quality
  const pathPoints = 40 // More points for smoother curves
  const controlPoints: Array<{x: number, y: number}> = []
  
  for (let i = 0; i <= pathPoints; i++) {
    const t = i / pathPoints
    const x = -50 + (width + 100) * t
    
    // Base Y position optimized for 1080p viewport
    let baseY
    if (t < 0.2) {
      baseY = groundY - 20 // Start closer to ground
    } else if (t < 0.4) {
      const localT = (t - 0.2) / 0.2
      baseY = groundY - 20 + 30 * localT // Gentler rise
    } else if (t < 0.7) {
      const localT = (t - 0.4) / 0.3
      baseY = groundY + 10 + 20 * localT // Stay closer to ground
    } else {
      baseY = groundY + 30 // Don't go too far down
    }
    
    // Add sophisticated meandering using multiple sine waves
    const meander1 = Math.sin(t * Math.PI * 3) * 20
    const meander2 = Math.sin(t * Math.PI * 5 + 1) * 10
    const meander3 = Math.cos(t * Math.PI * 2) * 15
    let y = baseY + (meander1 + meander2 + meander3) * 0.5
    
    // Avoid pond with smooth curves
    const pondCenterX = pondX
    const pondCenterY = pondY
    const pondRadius = Math.max(pondW, pondH) / 2 + 60
    const distToPond = Math.sqrt(Math.pow(x - pondCenterX, 2) + Math.pow(y - pondCenterY, 2))
    
    if (distToPond < pondRadius) {
      // Smoothly curve around pond
      y = pondCenterY + Math.sign(y - pondCenterY) * (pondRadius + 10)
    }
    
    // Avoid trees with smooth avoidance
    for (const tp of treePositions) {
      const treeRadius = tp.r
      const distToTree = Math.sqrt(Math.pow(x - tp.x, 2) + Math.pow(y - tp.y, 2))
      
      if (distToTree < treeRadius + 20) {
        // Smoothly curve around tree
        const avoidanceStrength = 1 - (distToTree / (treeRadius + 20))
        const angleFromTree = Math.atan2(y - tp.y, x - tp.x)
        const treeAvoidance = Math.sin(angleFromTree) * (treeRadius + 20) * avoidanceStrength
        y += treeAvoidance
      }
    }
    
    controlPoints.push({ x, y })
  }
  
  // Smooth the path using moving average like the original
  const trailPts: Array<{x:number,y:number}> = []
  for (let i = 1; i < controlPoints.length - 1; i++) {
    const prev = controlPoints[i - 1]
    const curr = controlPoints[i]
    const next = controlPoints[i + 1]
    
    const smoothX = (prev.x * 0.25 + curr.x * 0.5 + next.x * 0.25)
    const smoothY = (prev.y * 0.25 + curr.y * 0.5 + next.y * 0.25)
    
    trailPts.push({ x: smoothX, y: smoothY })
  }
  
  // Add first and last points
  if (controlPoints.length > 0) {
    trailPts.unshift(controlPoints[0])
    trailPts.push(controlPoints[controlPoints.length - 1])
  }

  world.buildEntity()
    .with(Trail, new Trail(trailPts, 12, 0xB8860B)) // Wider, more golden trail
    .with(Transform, new Transform(0, 0))
    .with(PixiSprite, new PixiSprite(null, null, null, Layer.TRAIL))
    .build()
}

// Deprecated: shrubs are now spawned by ShrubSpawnerSystem
export function createShrubs(): void {
  // Deprecated: handled by ShrubSpawnerSystem
}

export function createTrees(world: any, groundY: number, pondX: number, pondY: number, pondW: number) {
  const width = window.innerWidth
  const treeColors = [0x2d5a2a, 0x3b6b39, 0x1f4a1a, 0x4a7c4e]
  const trunkPalette = [0x4a3c28, 0x5c4b36, 0x3c2d1e, 0x6b533a]
  
  // Far trees: optimized positioning for 1080p viewport
  const farTreeCount = 12 + Math.floor(Math.random() * 6)
  for (let i = 0; i < farTreeCount; i++) {
    const x = Math.random() * width
    const y = groundY - 15 + Math.sin(x * 0.003) * 8
    
    // Reduce density directly behind pond to keep it visible as focal point
    const pondBehindArea = Math.abs(x - pondX) < pondW * 0.7 && y < pondY - 15
    if (pondBehindArea && Math.random() < 0.6) continue // Skip some trees behind pond
    
    const size = 0.5 + Math.random() * 0.4
    const foliageColor = treeColors[(Math.random() * treeColors.length) | 0]
    world.buildEntity()
      .with(Tree, new Tree(
        8 * size + Math.random() * 5,
        40 * size + Math.random() * 20,
        20 * size + Math.random() * 10,
        trunkPalette[(Math.random() * trunkPalette.length) | 0],
        foliageColor,
        Math.random() < 0.7
      ))
      .with(Transform, new Transform(x, y))
      .with(PixiSprite, new PixiSprite(null, null, null, Layer.FAR_TREES))
      .build()
  }

  // Near trees: larger and in front
  const nearTreeCount = 10 + Math.floor(Math.random() * 6)
  for (let i = 0; i < nearTreeCount; i++) {
    const x = Math.random() * width
    const size = 0.9 + Math.random() * 0.8
    const foliageColor = treeColors[(Math.random() * treeColors.length) | 0]
    const y = groundY + Math.sin(x * 0.0025) * 14
    world.buildEntity()
      .with(Tree, new Tree(
        14 * size + Math.random() * 8,
        70 * size + Math.random() * 40,
        34 * size + Math.random() * 16,
        trunkPalette[(Math.random() * trunkPalette.length) | 0],
        foliageColor,
        Math.random() < 0.6
      ))
      .with(Transform, new Transform(x, y))
      .with(PixiSprite, new PixiSprite(null, null, null, Layer.NEAR_TREES))
      .build()
  }
  
  // Foreground accent trees (very near, using lower screen space)
  const foregroundCount = 8 + Math.floor(Math.random() * 6)
  for (let i = 0; i < foregroundCount; i++) {
    const x = Math.random() * width
    const size = 1.2 + Math.random() * 0.8
    const foliageColor = treeColors[(Math.random() * treeColors.length) | 0]
    // Position in the actual foreground (bottom third of screen)
    const y = groundY + 40 + Math.random() * (window.innerHeight - groundY - 80)
  world.buildEntity()
      .with(Tree, new Tree(
        20 * size + Math.random() * 12,
        100 * size + Math.random() * 50,
        45 * size + Math.random() * 20,
        trunkPalette[(Math.random() * trunkPalette.length) | 0],
        foliageColor,
        Math.random() < 0.5
      ))
      .with(Transform, new Transform(x, y))
      .with(PixiSprite, new PixiSprite(null, null, null, Layer.NEAR_TREES))
      .build()
  }
}

// Deprecated: pads are now spawned by VegetationSpawnerSystem
export function createLilyPads(): void {}

// Create grass texture like the original - scattered across ground
// Note: Pond avoidance will be handled by spawner systems at runtime
export function createGrassTexture(world: any, groundY: number) {
  const width = window.innerWidth
  
  // Create grass clusters like original
  for (let x = 0; x < width; x += 8) { // Denser grass spacing like original
    const y = groundY + Math.sin(x * 0.005) * 10
    
    // Create grass cluster entity
    const grassHeight = 8 + ((x * 0.1234) % 12) // Deterministic height
    const clusterSize = 3 + Math.floor((x * 0.0567) % 3) // Deterministic cluster size
    
    const blades = []
    // Create blades matching expected structure
    for (let i = 0; i < clusterSize; i++) {
      const offsetX = (Math.sin(x + i) * 3) // Deterministic offset 
      blades.push({
        x: offsetX,
        y: 0,
        height: grassHeight + (i * 2),
        sway: x + i // For sway animation
      })
    }
    const grassCluster = new GrassCluster(blades)
    
    world.buildEntity()
      .with(GrassCluster, grassCluster)
      .with(Transform, new Transform(x, y))
      .with(PixiSprite, new PixiSprite(null, null, null, Layer.GROUND))
      .build()
  }
}

// Deprecated: cattails are now spawned by VegetationSpawnerSystem
export function createCattails(): void {}

export function spawnAllEntities(world: any) {
  // Enhanced scene: time, sky, textured ground, and pond with vegetation
  createTimeController(world)
  createSky(world)
  const groundY = createGround(world)
  // Add larger pond as focal point with vegetation
  createPonds(world, groundY)
  createGrassTexture(world, groundY) // Original-style grass texture
  // Vegetation now spawned by systems based on discovered ponds
}