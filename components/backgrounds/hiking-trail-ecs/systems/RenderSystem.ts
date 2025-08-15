import * as PIXI from 'pixi.js'
import { createSystem, queryComponents, Write, Read, ReadResource, WriteResource } from 'sim-ecs'
import { 
  Transform, Sky, Mountain, Ground, Pond, Trail, Sun, Moon, Star,
  TimeOfDay, PixiSprite, Layer, Tree, Firefly, Frog, Hiker, Owl, 
  Signpost, GrassCluster, LilyPad, Cloud, Shrub, Cattail
} from '../components'

// Helper function for color interpolation
function lerpColor(colorA: number, colorB: number, t: number): number {
  const ar = (colorA >> 16) & 0xff, ag = (colorA >> 8) & 0xff, ab = colorA & 0xff
  const br = (colorB >> 16) & 0xff, bg = (colorB >> 8) & 0xff, bb = colorB & 0xff
  const r = Math.round(ar + (br - ar) * t) & 0xff
  const g = Math.round(ag + (bg - ag) * t) & 0xff
  const bl = Math.round(ab + (bb - ab) * t) & 0xff
  return (r << 16) | (g << 8) | bl
}

function hslToRgbHex(h: number, s: number, l: number): number {
  // h 0..360, s 0..1, l 0..1
  const c = (1 - Math.abs(2 * l - 1)) * s
  const hp = (h % 360) / 60
  const x = c * (1 - Math.abs((hp % 2) - 1))
  let r1 = 0, g1 = 0, b1 = 0
  if (0 <= hp && hp < 1) { r1 = c; g1 = x; b1 = 0 }
  else if (1 <= hp && hp < 2) { r1 = x; g1 = c; b1 = 0 }
  else if (2 <= hp && hp < 3) { r1 = 0; g1 = c; b1 = x }
  else if (3 <= hp && hp < 4) { r1 = 0; g1 = x; b1 = c }
  else if (4 <= hp && hp < 5) { r1 = x; g1 = 0; b1 = c }
  else if (5 <= hp && hp < 6) { r1 = c; g1 = 0; b1 = x }
  const m = l - c / 2
  const r = Math.round((r1 + m) * 255)
  const g = Math.round((g1 + m) * 255)
  const b = Math.round((b1 + m) * 255)
  return (r << 16) | (g << 8) | b
}

export const RenderSystem = createSystem({})
  .withRunFunction(() => {
    // TODO: Convert this large system to sim-ecs
  })
  .build()

export class RenderSystemLegacy {
  constructor(private app: PIXI.Application) {
    // Dedicated scene container so UI elements on stage are not cleared
    this.sceneContainer = new PIXI.Container()
    this.app.stage.addChild(this.sceneContainer)
  }

  private sceneContainer: PIXI.Container
  private waterStripeTexture: PIXI.Texture | null = null
  private waterNoiseRT: PIXI.RenderTexture | null = null
  private waterNoiseSprite: PIXI.Sprite | null = null
  // Displacement-based water
  private waterDisplacementFilter: PIXI.DisplacementFilter | null = null
  private static drawOrder: Record<number, number> = {
    [Layer.SKY]: 0,
    [Layer.CELESTIAL]: 1,
    [Layer.MOUNTAINS]: 2,
    [Layer.GROUND]: 3,     // draw ground before trail/pond
    [Layer.FAR_TREES]: 4,
    [Layer.TRAIL]: 5,
    [Layer.POND]: 6,
    [Layer.CREATURES]: 7,
    [Layer.NEAR_TREES]: 8,
    [Layer.EFFECTS]: 9,
    [Layer.UI]: 10,
  }
  
  update(world: World): void {
    // Clear only scene container children, keep UI on stage
    this.sceneContainer.removeChildren()
    
    // Get time for sky color
    const timeEntities = world.getEntitiesWithComponents(TimeOfDay)
    const currentHour = timeEntities.length > 0 ? timeEntities[0].getComponent(TimeOfDay)!.currentTime : 12
    
    // Gather pond containers for masking/attachments
    const pondEntities = world.getEntitiesWithComponents(Transform, PixiSprite, Pond)
    const pondRefs: Array<{ x: number; y: number; container: PIXI.Container | null; w: number; h: number }> = []
    for (const pe of pondEntities) {
      const t = pe.getComponent(Transform)!
      const ps = pe.getComponent(PixiSprite)!
      const pond = pe.getComponent(Pond)!
      pondRefs.push({ x: t.x, y: t.y, container: (ps.sprite as PIXI.Container) || null, w: pond.width, h: pond.height })
    }

    // Get all renderable entities
    const renderableEntities = world.getEntitiesWithComponents(Transform, PixiSprite)
    
    // Debug: Log number of entities being rendered
    if (renderableEntities.length === 0) {
      console.warn('No renderable entities found')
      return
    }
    
    // Sort by intended draw order (ground before trail/pond)
    renderableEntities.sort((a, b) => {
      const la = a.getComponent(PixiSprite)?.layer ?? 0
      const lb = b.getComponent(PixiSprite)?.layer ?? 0
      const oa = RenderSystem.drawOrder[la] ?? la
      const ob = RenderSystem.drawOrder[lb] ?? lb
      return oa - ob
    })
    
    for (const entity of renderableEntities) {
      const transform = entity.getComponent(Transform)!
      const pixiSprite = entity.getComponent(PixiSprite)!
      
      // Create graphics if needed
      if (!pixiSprite.graphics) {
        pixiSprite.graphics = new PIXI.Graphics()
      }
      const graphics = pixiSprite.graphics as PIXI.Graphics
      graphics.clear()
      
      // Draw based on component type
      if (entity.hasComponent(Sky)) {
        this.renderSky(graphics, currentHour)
      }
      
      if (entity.hasComponent(Sun)) {
        this.renderSun(graphics, entity.getComponent(Sun)!)
      }
      
      // Moon and stars intentionally omitted for the current step
      
      if (entity.hasComponent(Mountain)) {
        this.renderMountain(graphics, entity.getComponent(Mountain)!)
      }
      
      if (entity.hasComponent(Ground)) {
        this.renderGround(graphics, entity.getComponent(Ground)!)
      }
      
      if (entity.hasComponent(Pond)) {
        const pond = entity.getComponent(Pond)!
        // Prefer a container-based pond with mask and tiling sprite for more realistic water
        if (!pixiSprite.sprite) {
          pixiSprite.sprite = this.buildPondContainer(pond)
        }
        // Animate liquid distortion (multi-axis organic flow inspired by Codrops)
        const container = pixiSprite.sprite as PIXI.Container
        const liquidLayer = container.children.find(child => child.name === 'liquidLayer') as PIXI.Container | null
        const waterCaustics = liquidLayer?.getChildByName('waterCaustics') as PIXI.TilingSprite | null
        
        if (waterCaustics && waterCaustics.tilePosition) {
          // Organic caustic flow with varying speeds
          const time = Date.now() * 0.001
          waterCaustics.tilePosition.x += Math.sin(time * 0.3) * 0.8 + 0.4
          waterCaustics.tilePosition.y += Math.cos(time * 0.2) * 0.6 + 0.3
        }
        
        // Complex liquid motion with multiple frequencies for displacement sprite
        if (this.waterNoiseSprite) {
          const time = Date.now() * 0.0008
          
          // Primary flow (slow, large displacement)
          const primaryX = Math.sin(time * 0.7) * 8
          const primaryY = Math.cos(time * 0.5) * 6
          
          // Secondary turbulence (medium speed)
          const secondaryX = Math.sin(time * 1.8 + Math.PI * 0.3) * 4
          const secondaryY = Math.cos(time * 1.4 + Math.PI * 0.7) * 3
          
          // Fine detail motion (fast, small displacement)
          const detailX = Math.sin(time * 3.2) * 1.5
          const detailY = Math.cos(time * 2.9) * 1.2
          
          // Combine all motion layers
          this.waterNoiseSprite.x = primaryX + secondaryX + detailX
          this.waterNoiseSprite.y = primaryY + secondaryY + detailY
          
          // Slow rotation for organic feel
          this.waterNoiseSprite.rotation += 0.0015
          
          // Subtle scale pulsing for breathing effect
          const breathe = 1 + Math.sin(time * 0.4) * 0.05
          this.waterNoiseSprite.scale.set(0.3 * breathe)
        }
        const refl = container.getChildByName('reflectionsLayer') as PIXI.Container | null
        if (refl) {
          // gentle shimmer
          refl.alpha = 0.25 + 0.1 * Math.sin(performance.now() * 0.0015)
        }
        // Skip graphics-based pond when container exists
      } else {
        // Only draw non-pond entities with graphics
      }
      
      if (entity.hasComponent(Trail)) {
        this.renderTrail(graphics, entity.getComponent(Trail)!)
      }
      
      if (entity.hasComponent(Tree)) {
        this.renderTree(graphics, entity.getComponent(Tree)!)
      }
      
      if (entity.hasComponent(Firefly)) {
        this.renderFirefly(graphics, entity.getComponent(Firefly)!)
      }
      
      if (entity.hasComponent(Frog)) {
        this.renderFrog(graphics, entity.getComponent(Frog)!)
      }
      
      if (entity.hasComponent(Hiker)) {
        this.renderHiker(graphics, entity.getComponent(Hiker)!)
      }
      
      if (entity.hasComponent(Owl)) {
        this.renderOwl(graphics, entity.getComponent(Owl)!, world)
      }
      
      if (entity.hasComponent(Signpost)) {
        this.renderSignpost(graphics, entity.getComponent(Signpost)!)
      }
      
      if (entity.hasComponent(Cloud)) {
        this.renderCloud(graphics, entity.getComponent(Cloud)!)
      }
      
      if (entity.hasComponent(GrassCluster)) {
        this.renderGrassCluster(graphics, entity.getComponent(GrassCluster)!)
      }
      
      if (entity.hasComponent(Shrub)) {
        this.renderShrub(graphics, entity.getComponent(Shrub)!)
      }
      
      if (entity.hasComponent(LilyPad)) {
        this.renderLilyPad(graphics, entity.getComponent(LilyPad)!)
      }
      let attachedToPondParent = false

      // Render cattails only when the entity actually has the Cattail component
      if (entity.hasComponent(Cattail)) {
        this.renderCattail(graphics, entity.getComponent(Cattail)!)
      }
      
      // Position and add either sprite container or graphics
      if (pixiSprite.sprite) {
        const node = pixiSprite.sprite as PIXI.Container
        node.x = transform.x
        node.y = transform.y
        node.rotation = transform.rotation || 0
        this.sceneContainer.addChild(node)
      } else {
        // Special handling: Lily pads should be clipped inside the pond mask
        if (entity.hasComponent(LilyPad) && pondRefs.length > 0) {
          // Find nearest pond
          let best: { x: number; y: number; container: PIXI.Container | null; w: number; h: number } | null = null
          let bestDist = Infinity
          for (const pr of pondRefs) {
            const dx = transform.x - pr.x
            const dy = transform.y - pr.y
            const d2 = dx * dx + dy * dy
            if (d2 < bestDist) { bestDist = d2; best = pr }
          }
          const target = best
          // Use a dedicated, unfiltered plants layer to avoid blur/distortion
          const plantsLayer = target?.container?.children.find(c => c.name === 'plantsLayer') as PIXI.Container | undefined
          if (plantsLayer && target) {
            // Convert to pond-local coordinates
            let lx = transform.x - target.x
            let ly = transform.y - target.y
            // Clamp to inside ellipse margin so pads never cross the rim
            const rx = target.w * 0.5 * 0.96
            const ry = target.h * 0.5 * 0.96 * 0.65
            if (rx > 0 && ry > 0) {
              const ex = lx / rx
              const ey = ly / ry
              const e = ex * ex + ey * ey
              if (e > 1) {
                const s = 1 / Math.sqrt(e)
                lx = lx * s
                ly = ly * s
              }
            }
            graphics.x = lx
            graphics.y = ly
            graphics.rotation = transform.rotation || 0
            plantsLayer.addChild(graphics)
            attachedToPondParent = true
          }
        }

        if (!attachedToPondParent) {
          graphics.x = transform.x
          graphics.y = transform.y
          graphics.rotation = transform.rotation || 0
          this.sceneContainer.addChild(graphics)
        }
      }
    }
  }
  
  private renderSky(graphics: PIXI.Graphics, currentHour: number): void {
    // Smoother sky with more subtle day/dusk/night palettes
    // Define palettes
    const palettes = {
      day: { top: 0x5fb8ff, bottom: 0xbfe6ff },
      dusk: { top: 0x5070b8, bottom: 0x8fb3e0 },
      night: { top: 0x0b1238, bottom: 0x182a6a },
      dawn: { top: 0x5e8fd6, bottom: 0xaad4ff }
    }

    let topColor = palettes.day.top
    let bottomColor = palettes.day.bottom
    if (currentHour < 5 || currentHour >= 21) {
      topColor = palettes.night.top
      bottomColor = palettes.night.bottom
    } else if (currentHour < 7) {
      topColor = palettes.dawn.top
      bottomColor = palettes.dawn.bottom
    } else if (currentHour >= 19) {
      topColor = palettes.dusk.top
      bottomColor = palettes.dusk.bottom
    }

    const width = window.innerWidth
    const height = window.innerHeight
    const steps = 128

    const r1 = (topColor >> 16) & 0xff
    const g1 = (topColor >> 8) & 0xff
    const b1 = topColor & 0xff
    const r2 = (bottomColor >> 16) & 0xff
    const g2 = (bottomColor >> 8) & 0xff
    const b2 = bottomColor & 0xff

    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1)
      const r = Math.round(r1 + (r2 - r1) * t)
      const g = Math.round(g1 + (g2 - g1) * t)
      const b = Math.round(b1 + (b2 - b1) * t)
      const color = (r << 16) | (g << 8) | b
      const y = Math.floor((i * height) / steps)
      const h = Math.ceil(((i + 1) * height) / steps) - y
      graphics.rect(0, y, width, h)
      graphics.fill({ color })
    }
  }
  
  private renderSun(graphics: PIXI.Graphics, sun: Sun): void {
    if (sun.visible) {
      // Soft, layered sun for better look
      graphics.circle(0, 0, 26)
      graphics.fill({ color: 0xffdf6e, alpha: 1 })
      graphics.circle(0, 0, 36)
      graphics.fill({ color: 0xffe89a, alpha: 0.35 })
      graphics.circle(0, 0, 48)
      graphics.fill({ color: 0xfff1c2, alpha: 0.18 })
    }
  }
  
  private renderMoon(graphics: PIXI.Graphics, moon: Moon): void {
    if (moon.visible) {
      graphics.circle(0, 0, 25)
      graphics.fill({ color: 0xF0F0F0 })
    }
  }
  
  private renderStar(graphics: PIXI.Graphics, star: Star): void {
    if (star.visible) {
      graphics.circle(0, 0, star.size)
      graphics.fill({ color: 0xFFFFFF, alpha: star.brightness })
    }
  }
  
  private renderMountain(graphics: PIXI.Graphics, mountain: Mountain): void {
    // Build a smoother ridge using quadratic segments between peaks
    const base = 220
    const peaks = mountain.peaks
    if (peaks.length < 2) return

    graphics.moveTo(0, base)
    // leading slope to first peak
    const first = peaks[0]
    graphics.quadraticCurveTo(first.x * 0.5, base - first.height * 0.4, first.x, base - first.height)

    for (let i = 1; i < peaks.length; i++) {
      const prev = peaks[i - 1]
      const curr = peaks[i]
      const midX = (prev.x + curr.x) / 2
      const midY = base - (prev.height + curr.height) / 2
      // curve through midpoint to current peak for a soft ridge
      graphics.quadraticCurveTo(midX, midY, curr.x, base - curr.height)
    }

    // trailing slope to right edge
    const last = peaks[peaks.length - 1]
    graphics.quadraticCurveTo(last.x + (window.innerWidth - last.x) * 0.5, base - last.height * 0.4, window.innerWidth, base)

    // close shape downwards
    graphics.lineTo(window.innerWidth, base + 200)
    graphics.lineTo(0, base + 200)
    graphics.closePath()

    const alpha = mountain.layerIndex === 0 ? 0.85 : 0.75
    graphics.fill({ color: mountain.color, alpha })

    // add a subtle top highlight
    graphics.moveTo(0, base)
    graphics.stroke({ width: 2, color: 0xffffff, alpha: 0.06 })
  }
  
  private renderGround(graphics: PIXI.Graphics, ground: Ground): void {
    const width = window.innerWidth
    const bottom = Math.max(0, window.innerHeight - ground.y)

    // Undulating ground edge
    const groundPoints: Array<{ x: number; y: number }> = []
    for (let x = -10; x <= width + 20; x += 20) {
      const y = Math.sin(x * 0.005) * 10 + Math.cos(x * 0.008) * 5
      groundPoints.push({ x, y })
    }

    // Main ground shape
    graphics.beginPath()
    graphics.moveTo(-10, 0)
    for (let i = 0; i < groundPoints.length; i++) {
      graphics.lineTo(groundPoints[i].x, groundPoints[i].y)
    }
    graphics.lineTo(width + 10, bottom)
    graphics.lineTo(-10, bottom)
    graphics.closePath()
    graphics.fill({ color: 0x5a7042, alpha: 1 })

    // Horizon accent line
    graphics.moveTo(-10, 0)
    graphics.lineTo(width + 10, 0)
    graphics.stroke({ width: 2, color: 0x2f3a21, alpha: 0.15 })

    // Scatter subtle darker earth patches (deterministic)
    for (let ix = 0; ix < width; ix += 80) {
      const n = Math.sin(ix * 0.017) * Math.cos(ix * 0.013)
      const cx = ix + 30
      const cy = bottom * (0.2 + ((n + 1) / 2) * 0.6)
      const rw = 60 + ((ix * 31) % 25)
      const rh = 18 + ((ix * 17) % 14)
      graphics.ellipse(cx, cy, rw, rh)
      graphics.fill({ color: 0x4b5f37, alpha: 0.28 })
    }

    // Scatter lighter grass patches
    for (let ix = 40; ix < width; ix += 100) {
      const n = Math.sin(ix * 0.021 + 1) * Math.cos(ix * 0.015 - 0.5)
      const cx = ix + 20
      const cy = bottom * (0.35 + ((n + 1) / 2) * 0.5)
      const rw = 50 + ((ix * 23) % 20)
      const rh = 14 + ((ix * 11) % 10)
      graphics.ellipse(cx, cy, rw, rh)
      graphics.fill({ color: 0x6c8550, alpha: 0.22 })
    }
  }
  
  private renderPond(graphics: PIXI.Graphics, pond: Pond): void {
    if (!pond.shape || pond.shape.length < 6) return
    const n = pond.shape.length
    const pts: Array<{x:number,y:number}> = []
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2
      const rx = (pond.width * 0.5) * pond.shape[i]
      const ry = (pond.height * 0.5) * pond.shape[i] * 0.65
      pts.push({ x: Math.cos(ang) * rx, y: Math.sin(ang) * ry })
    }
    
    // Enhanced pond as focal point with more layers and visual interest
    
    // Deep layer (darkest water)
    graphics.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) graphics.lineTo(pts[i].x, pts[i].y)
    graphics.closePath()
    graphics.fill({ color: 0x0f3a4a, alpha: 0.98 })

    // Mid-deep layer
    graphics.moveTo(pts[0].x * 0.9, pts[0].y * 0.9)
    for (let i = 1; i < pts.length; i++) graphics.lineTo(pts[i].x * 0.9, pts[i].y * 0.9)
    graphics.closePath()
    graphics.fill({ color: 0x1a4d66, alpha: 0.9 })

    // Mid layer
    graphics.moveTo(pts[0].x * 0.78, pts[0].y * 0.78)
    for (let i = 1; i < pts.length; i++) graphics.lineTo(pts[i].x * 0.78, pts[i].y * 0.78)
    graphics.closePath()
    graphics.fill({ color: 0x2d6680, alpha: 0.82 })

    // Shallow layer
    graphics.moveTo(pts[0].x * 0.65, pts[0].y * 0.65)
    for (let i = 1; i < pts.length; i++) graphics.lineTo(pts[i].x * 0.65, pts[i].y * 0.65)
    graphics.closePath()
    graphics.fill({ color: 0x4d8099, alpha: 0.7 })

    // Surface highlights for focal appeal
    graphics.moveTo(pts[0].x * 0.5, pts[0].y * 0.5)
    for (let i = 1; i < pts.length; i++) graphics.lineTo(pts[i].x * 0.5, pts[i].y * 0.5)
    graphics.closePath()
    graphics.fill({ color: 0x7bb8d3, alpha: 0.4 })
    
    // Prominent rim highlight to draw attention
    graphics.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) graphics.lineTo(pts[i].x, pts[i].y)
    graphics.closePath()
    graphics.stroke({ width: 2, color: 0x9fd8f0, alpha: 0.65 })
    
    // Subtle inner sparkle cluster
    graphics.moveTo(pts[0].x * 0.3, pts[0].y * 0.3)
    for (let i = 1; i < pts.length; i++) graphics.lineTo(pts[i].x * 0.3, pts[i].y * 0.3)
    graphics.closePath()
    graphics.fill({ color: 0xbfe6ff, alpha: 0.18 })

    // Animated surface ripples (soft sine arcs)
    const t = (Date.now() % 60000) / 60000
    const waves = 4
    for (let w = 0; w < waves; w++) {
      const phase = t * Math.PI * 2 + (w * Math.PI) / waves
      const scale = 0.55 + w * 0.1
      graphics.moveTo(pts[0].x * scale, pts[0].y * scale)
      for (let i = 1; i < pts.length; i++) {
        const nx = pts[i].x * scale
        const ny = pts[i].y * scale + Math.sin(phase + i * 0.35) * 2
        graphics.lineTo(nx, ny)
      }
      graphics.closePath()
      graphics.stroke({ width: 1, color: 0x9bd2e6, alpha: 0.15 })
    }

    // Sparkles: a few tiny dots near the rim
    const sparkleCount = 12
    for (let i = 0; i < sparkleCount; i++) {
      const a = (i / sparkleCount) * Math.PI * 2 + t * 4
      const rx = pond.width * 0.46
      const ry = pond.height * 0.32
      const sx = Math.cos(a) * rx * (0.95 + Math.sin(t * 10 + i) * 0.02)
      const sy = Math.sin(a) * ry * (0.95 + Math.cos(t * 9 + i) * 0.02)
      graphics.circle(sx, sy, 1.4)
      graphics.fill({ color: 0xdaf2ff, alpha: 0.35 })
    }
  }

  // Build a pond container with liquid distortion effects inspired by Codrops
  private buildPondContainer(pond: Pond): PIXI.Container {
    const container = new PIXI.Container()

    // Convert pond to points array
    const n = pond.shape.length
    const pts: Array<{x:number,y:number}> = []
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2
      const rx = (pond.width * 0.5) * pond.shape[i]
      const ry = (pond.height * 0.5) * pond.shape[i] * 0.65
      pts.push({ x: Math.cos(ang) * rx, y: Math.sin(ang) * ry })
    }

    // Mask for overall pond shape
    const mask = new PIXI.Graphics()
    this.drawSmoothClosedShape(mask, pts, 1.0)
    mask.fill(0xffffff)
    container.addChild(mask)
    container.mask = mask

    // Base water layer (stable, no distortion)
    const baseWater = new PIXI.Graphics()
    this.drawSmoothClosedShape(baseWater, pts, 1.0)
    baseWater.fill({ color: 0x1a4d66, alpha: 0.9 })
    container.addChild(baseWater)

    // Smooth depth gradient using radial falloff
    const depthGradient = new PIXI.Graphics()
    const steps = 40
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1)
      const scale = 1.0 - t * 0.6 // shrink toward center
      const edgeColor = 0x4a7a8f
      const centerColor = 0x0d2832
      const color = lerpColor(edgeColor, centerColor, t * t) // quadratic for natural falloff
      this.drawSmoothClosedShape(depthGradient, pts, scale)
      depthGradient.fill({ color, alpha: 0.7 })
    }
    depthGradient.filters = [new PIXI.BlurFilter({ strength: 1.5 })]
    container.addChild(depthGradient)

    // Create multi-layered liquid distortion noise (Codrops approach)
    if (!this.waterNoiseRT) {
      this.waterNoiseRT = PIXI.RenderTexture.create({ width: 256, height: 256 })
    }
    
    // Generate complex noise pattern with multiple frequencies
    const noiseG = new PIXI.Graphics()
    
    // Layer 1: Large flow lines
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2
      const x1 = 128 + Math.cos(angle) * 100
      const y1 = 128 + Math.sin(angle) * 100
      const x2 = 128 + Math.cos(angle + 0.3) * 120
      const y2 = 128 + Math.sin(angle + 0.3) * 120
      noiseG.moveTo(x1, y1)
      noiseG.lineTo(x2, y2)
      noiseG.stroke({ width: 2, color: 0xffffff, alpha: 0.1 })
    }
    
    // Layer 2: Medium ripples
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 4
      const radius = 30 + (i % 3) * 20
      const x = 128 + Math.cos(angle) * radius
      const y = 128 + Math.sin(angle) * radius
      noiseG.circle(x, y, 1 + (i % 2))
      noiseG.fill({ color: 0xffffff, alpha: 0.08 })
    }
    
    // Layer 3: Fine turbulence
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 256
      const y = Math.random() * 256
      const size = 0.5 + Math.random() * 1.5
      noiseG.circle(x, y, size)
      noiseG.fill({ color: 0xffffff, alpha: 0.03 })
    }

    // Render the noise texture
    const clearNoise = new PIXI.Graphics()
    clearNoise.rect(0, 0, 256, 256)
    clearNoise.fill({ color: 0x000000, alpha: 0 })
    this.app.renderer.render(clearNoise, { renderTexture: this.waterNoiseRT })
    this.app.renderer.render(noiseG, { renderTexture: this.waterNoiseRT })

    // Liquid surface layer with distortion
    const liquidLayer = new PIXI.Container()
    liquidLayer.name = 'liquidLayer'
    container.addChild(liquidLayer)

    // Plants layer: masked by pond shape but NOT filtered to avoid blur/distortion
    const plantsLayer = new PIXI.Container()
    plantsLayer.name = 'plantsLayer'
    plantsLayer.mask = mask
    container.addChild(plantsLayer)

    // Surface reflections
    const reflections = new PIXI.Graphics()
    for (let i = 0; i < 8; i++) {
      const y = (i / 8 - 0.5) * pond.height * 0.8
      reflections.rect(-pond.width * 0.4, y, pond.width * 0.8, pond.height * 0.05)
      reflections.fill({ color: 0x87ceeb, alpha: 0.06 + Math.sin(i * 0.5) * 0.02 })
    }
    liquidLayer.addChild(reflections)

    // Caustic patterns
    if (!this.waterStripeTexture) {
      const rt = PIXI.RenderTexture.create({ width: 128, height: 128 })
      const g = new PIXI.Graphics()
      
      // Create organic caustic pattern
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 128
        const y = Math.random() * 128
        const radius = 2 + Math.random() * 8
        g.circle(x, y, radius)
        g.fill({ color: 0x9fd8f0, alpha: 0.1 })
      }
      
      // Add flowing lines
      for (let i = 0; i < 15; i++) {
        const x1 = Math.random() * 128
        const y1 = Math.random() * 128
        const x2 = x1 + (Math.random() - 0.5) * 40
        const y2 = y1 + (Math.random() - 0.5) * 40
        g.moveTo(x1, y1)
        g.lineTo(x2, y2)
        g.stroke({ width: 1, color: 0xbfe6ff, alpha: 0.08 })
      }

      const clearCaustic = new PIXI.Graphics()
      clearCaustic.rect(0, 0, 128, 128)
      clearCaustic.fill({ color: 0x000000, alpha: 0 })
      this.app.renderer.render(clearCaustic, { renderTexture: rt })
      this.app.renderer.render(g, { renderTexture: rt })
      this.waterStripeTexture = rt
    }

    const caustics = new PIXI.TilingSprite({ 
      texture: this.waterStripeTexture!, 
      width: pond.width * 0.9, 
      height: pond.height * 0.9 
    })
    caustics.anchor.set(0.5)
    caustics.alpha = 0.4
    caustics.name = 'waterCaustics'
    liquidLayer.addChild(caustics)

    // Create displacement sprite for liquid distortion
    if (!this.waterNoiseSprite) {
      this.waterNoiseSprite = new PIXI.Sprite(this.waterNoiseRT)
      this.waterNoiseSprite.anchor.set(0.5)
      
      // Enable texture wrapping for seamless animation
      if (this.waterNoiseSprite.texture?.source) {
        this.waterNoiseSprite.texture.source.addressMode = 'repeat'
      }
      
      // Scale down for finer detail
      this.waterNoiseSprite.scale.set(0.3)
      this.waterNoiseSprite.alpha = 0
      this.waterNoiseSprite.visible = false
      container.addChild(this.waterNoiseSprite)
    }

    // Apply liquid distortion to surface layer only
    const displacementFilter = new PIXI.DisplacementFilter({
      sprite: this.waterNoiseSprite,
      scale: { x: 80, y: 60 }, // Higher scale for more visible liquid motion
      padding: 0
    })
    
    // Add subtle blur for organic feel
    const blurFilter = new PIXI.BlurFilter({ strength: 0.8 })
    
    liquidLayer.filters = [displacementFilter, blurFilter]

    // Rim with natural water edge
    const rim = new PIXI.Graphics()
    this.drawSmoothClosedShape(rim, pts, 1.0)
    rim.stroke({ width: 3, color: 0x2d5a47, alpha: 0.4 })
    rim.filters = [new PIXI.BlurFilter({ strength: 0.8 })]
    container.addChild(rim)

    // Subtle inner edge highlights for realism
    for (const scale of [0.98, 0.95]) {
      const edge = new PIXI.Graphics()
      this.drawSmoothClosedShape(edge, pts, scale)
      edge.stroke({ width: 1, color: 0x7bb8d3, alpha: 0.12 })
      container.addChild(edge)
    }

    return container
  }

  private renderLilyPad(graphics: PIXI.Graphics, lilyPad: LilyPad): void {
    graphics.clear()
    
    // Subtle sway like original
    const sway = Math.sin(Date.now() * 0.001 + lilyPad.rotation) * 2
    graphics.x = sway
    
    const size = lilyPad.radius
    
    // Create lily pad shape with notch like original
    graphics.beginPath()
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      const notch = angle > Math.PI * 0.9 && angle < Math.PI * 1.1
      const radius = notch ? size * 0.5 : size
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      if (angle === 0) {
        graphics.moveTo(x, y)
      } else {
        graphics.lineTo(x, y)
      }
    }
    graphics.closePath()
    
    // Use gradient colors like original (HSL converted to RGB)
    // Original: hsla(120, 40%, 30%) to hsla(120, 35%, 20%)
    graphics.fill({ color: 0x2d5016, alpha: 0.9 }) // Base color like original
    
    // Add veins like original for texture
    graphics.lineStyle(0.5, 0x1a3408, 0.3) // Darker veins
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i
      graphics.moveTo(0, 0)
      graphics.lineTo(Math.cos(angle) * size * 0.8, Math.sin(angle) * size * 0.8)
    }
    graphics.stroke()
    
    // Optional flower like original
    if (lilyPad.hasFlower) {
      const flowerSize = 5 * (lilyPad.radius / 15) // Scale with pad size
      
      // Petals like original
      graphics.fillStyle = 0xf4d3e3 // Pink petals
      for (let i = 0; i < 6; i++) {
        const petalAngle = (Math.PI * 2 / 6) * i
        const petalX = Math.cos(petalAngle) * flowerSize
        const petalY = Math.sin(petalAngle) * flowerSize
        
        graphics.circle(petalX, petalY, flowerSize * 0.6)
        graphics.fill({ color: 0xf4d3e3, alpha: 0.9 })
      }
      
      // Center like original
      graphics.circle(0, 0, flowerSize * 0.4)
      graphics.fill({ color: 0xd4af37, alpha: 0.9 }) // Golden center
    }
  }
  
  private renderCattail(graphics: PIXI.Graphics, cattail: Cattail): void {
    graphics.clear()
    const height = cattail.height ?? 55
    const width = cattail.width ?? 4
    const headHeight = cattail.headHeight ?? 10
    const stalkColor = cattail.stalkColor ?? 0x4a5d2a
    const headColor = cattail.headColor ?? 0x6b4423

    // Gentle sway
    const sway = Math.sin(Date.now() * 0.001) * 1.5

    graphics.moveTo(0, 0)
    graphics.quadraticCurveTo(sway * 2, -height / 2, sway * 3, -height)
    graphics.stroke({ width, color: stalkColor, alpha: 0.9 })

    const headX = sway * 3
    const headY = -height + headHeight / 2
    graphics.ellipse(headX, headY, width + 2, headHeight)
    graphics.fill({ color: headColor, alpha: 0.95 })
    graphics.ellipse(headX - 1, headY - 1, (width + 2) * 0.7, headHeight * 0.6)
    graphics.fill({ color: 0x7d5235, alpha: 0.6 })
  }

  // Draw a smooth closed shape through points using quadratic midpoints
  private drawSmoothClosedShape(graphics: PIXI.Graphics, points: Array<{x:number,y:number}>, scale = 1): void {
    if (points.length < 2) {
      if (points.length === 1) {
        graphics.moveTo(points[0].x * scale, points[0].y * scale)
      }
      return
    }
    const n = points.length
    const p = points.map(pt => ({ x: pt.x * scale, y: pt.y * scale }))
    const mid = (a: {x:number,y:number}, b: {x:number,y:number}) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
    const m0 = mid(p[n - 1], p[0])
    graphics.moveTo(m0.x, m0.y)
    for (let i = 0; i < n; i++) {
      const curr = p[i]
      const next = p[(i + 1) % n]
      const m = mid(curr, next)
      graphics.quadraticCurveTo(curr.x, curr.y, m.x, m.y)
    }
    graphics.closePath()
  }
  
  private renderTrail(graphics: PIXI.Graphics, trail: Trail): void {
    const pts = trail.points
    if (!pts || pts.length < 2) return
    
    // Draw sophisticated trail with dashed pattern and smooth curves
    // Main dashed trail path
    graphics.moveTo(pts[0].x, pts[0].y)
    
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1]
      const b = pts[i]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy)
      
      // Create dashed effect
      const dashLength = 15
      const gapLength = 10
      const totalDash = dashLength + gapLength
      const dashCount = Math.floor(dist / totalDash)
      
      for (let d = 0; d < dashCount; d++) {
        const t1 = (d * totalDash) / dist
        const t2 = Math.min(((d * totalDash) + dashLength) / dist, 1)
        
        const x1 = a.x + dx * t1
        const y1 = a.y + dy * t1
        const x2 = a.x + dx * t2
        const y2 = a.y + dy * t2
        
        graphics.moveTo(x1, y1)
        graphics.lineTo(x2, y2)
        graphics.stroke({ 
          width: trail.width, 
          color: trail.color, 
          alpha: 0.8, 
          cap: 'round' 
        })
      }
    }
    
    // Add subtle trail edges for definition
    graphics.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1]
      const b = pts[i]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const len = Math.max(1, Math.hypot(dx, dy))
      const nx = -dy / len
      const ny = dx / len
      const off = trail.width * 0.5
      
      // Left edge
      graphics.moveTo(a.x + nx * off, a.y + ny * off)
      graphics.lineTo(b.x + nx * off, b.y + ny * off)
      graphics.stroke({ width: 1, color: 0x6d4b33, alpha: 0.3 })
      
      // Right edge  
      graphics.moveTo(a.x - nx * off, a.y - ny * off)
      graphics.lineTo(b.x - nx * off, b.y + ny * off)
      graphics.stroke({ width: 1, color: 0x6d4b33, alpha: 0.3 })
    }
  }
  
  private renderTree(graphics: PIXI.Graphics, tree: Tree): void {
    // Conifer variant
    if (!tree.hasBranches) {
      const trunk = tree.trunkColor ?? 0x4a3c28
      const h = tree.trunkHeight
      const baseW = Math.max(6, tree.trunkWidth * 0.8)
      // Trunk
      graphics.rect(-baseW/2, -h * 0.2, baseW, h * 0.2)
      graphics.fill({ color: trunk })
      // Layered foliage (triangular segments)
      const baseR = tree.foliageRadius
      const layers = 4
      for (let i = 0; i < layers; i++) {
        const t = i / (layers - 1)
        const y = -h * 0.2 - baseR * 0.6 - i * (baseR * 0.45)
        const half = baseR * (1.3 - t * 0.7)
        const col = shadeColor(tree.foliageColor ?? 0x2e5d2e, 0.9 + (layers - 1 - i) * 0.06)
        graphics.moveTo(0, y - baseR * 0.25)
        graphics.lineTo(-half, y + baseR * 0.25)
        graphics.lineTo(half, y + baseR * 0.25)
        graphics.closePath()
        graphics.fill({ color: col, alpha: 0.98 })
      }
      return
    }
    // Normalize colors to a realistic palette
    const foliage = tree.foliageColor ?? 0x2e5d2e
    const trunk = tree.trunkColor ?? 0x4a3c28
    const foliageDark = shadeColor(foliage, 0.85)
    const foliageLight = shadeColor(foliage, 1.15)

    // Trunk with gentle taper
    const baseW = tree.trunkWidth
    const h = tree.trunkHeight
    graphics.moveTo(-baseW/2, 0)
    graphics.lineTo(-baseW*0.35, -h*0.55)
    graphics.lineTo(-baseW*0.18, -h)
    graphics.lineTo(baseW*0.18, -h)
    graphics.lineTo(baseW*0.35, -h*0.55)
    graphics.lineTo(baseW/2, 0)
    graphics.closePath()
    graphics.fill({ color: trunk })
    // Trunk shadow
    graphics.moveTo(-baseW*0.1, -h)
    graphics.lineTo(-baseW*0.18, -h)
    graphics.lineTo(-baseW*0.35, -h*0.55)
    graphics.lineTo(-baseW*0.2, -h*0.55)
    graphics.closePath()
    graphics.fill({ color: shadeColor(trunk, 0.8), alpha: 0.6 })

    // Multi-lobe canopy (rounded clusters)
    const r = tree.foliageRadius
    const canopyY = -h
    const lobes = [
      { x: 0, y: canopyY - r*0.1, rr: r*1.0, color: foliage },
      { x: -r*0.6, y: canopyY + r*0.1, rr: r*0.75, color: foliageDark },
      { x: r*0.6, y: canopyY + r*0.1, rr: r*0.75, color: foliageDark },
      { x: 0, y: canopyY - r*0.55, rr: r*0.6, color: foliageLight },
    ]
    // Canopy shadow layer
    for (const l of lobes) {
      graphics.circle(l.x + 3, l.y + 6, l.rr)
      graphics.fill({ color: 0x0a1f0a, alpha: 0.15 })
    }
    // Canopy fill
    for (const l of lobes) {
      graphics.circle(l.x, l.y, l.rr)
      graphics.fill({ color: l.color, alpha: 0.95 })
    }
    // Highlights
    graphics.circle(-r*0.25, canopyY - r*0.2, r*0.35)
    graphics.fill({ color: foliageLight, alpha: 0.25 })
  }
  
  private renderFirefly(graphics: PIXI.Graphics, firefly: Firefly): void {
    if (firefly.glowIntensity > 0) {
      // Multi-layered glow effect with pulsing
      const pulseScale = 1 + Math.sin(firefly.phase * 2) * 0.2
      
      // Outer glow (largest, faintest)
      graphics.circle(0, 0, firefly.glowRadius * 4 * pulseScale)
      graphics.fill({ color: 0xffff00, alpha: firefly.glowIntensity * 0.05 })
      
      // Inner glow
      graphics.circle(0, 0, firefly.glowRadius * pulseScale)
      graphics.fill({ color: 0xffffaa, alpha: firefly.glowIntensity * 0.4 })
    }
  }
  
  private renderFrog(graphics: PIXI.Graphics, frog: Frog): void {
    // Body
    graphics.circle(0, 0, frog.size)
    graphics.fill({ color: frog.color })
    
    // Eyes
    graphics.circle(-frog.size * 0.4, -frog.size * 0.5, frog.size * 0.3)
    graphics.fill({ color: 0x2d5016 })
    graphics.circle(frog.size * 0.4, -frog.size * 0.5, frog.size * 0.3)
    graphics.fill({ color: 0x2d5016 })
  }
  
  private renderHiker(graphics: PIXI.Graphics, hiker: Hiker): void {
    // Slightly larger to match original scale
    const bodyW = 12
    const bodyH = 24
    const headR = 6
    // Body
    graphics.rect(-bodyW/2, -bodyH, bodyW, bodyH)
    graphics.fill({ color: hiker.color })
    // Head
    graphics.circle(0, -bodyH - headR, headR)
    graphics.fill({ color: 0xf1c4b1 })
    // Hat
    graphics.rect(-bodyW/2 - 2, -bodyH - headR*2 - 2, bodyW + 4, 8)
    graphics.fill({ color: hiker.hatColor })
    // Stick
    graphics.moveTo(hiker.direction > 0 ? bodyW/2 + 2 : -bodyW/2 - 2, -2)
    graphics.lineTo(hiker.direction > 0 ? bodyW/2 + 8 : -bodyW/2 - 8, -bodyH)
    graphics.stroke({ width: 2, color: 0x5a3b24 })
  }
  
  private renderOwl(graphics: PIXI.Graphics, owl: Owl, world: World): void {
    // Body
    graphics.circle(0, 0, owl.size)
    graphics.fill({ color: owl.bodyColor })
    
    // Eyes (with glow at night)
    if (!owl.isBlinking) {
      const timeEntities = world.getEntitiesWithComponents(TimeOfDay)
      const isNight = timeEntities.length > 0 && 
        (timeEntities[0].getComponent(TimeOfDay)!.currentTime < 6 || 
         timeEntities[0].getComponent(TimeOfDay)!.currentTime >= 18)
      
      if (isNight) {
        graphics.circle(-owl.size * 0.3, -owl.size * 0.2, owl.eyeGlowRadius * 1.5)
        graphics.fill({ color: owl.eyeColor, alpha: 0.3 })
        graphics.circle(owl.size * 0.3, -owl.size * 0.2, owl.eyeGlowRadius * 1.5)
        graphics.fill({ color: owl.eyeColor, alpha: 0.3 })
      }
      
      // Eyes
      graphics.circle(-owl.size * 0.3, -owl.size * 0.2, owl.eyeGlowRadius)
      graphics.fill({ color: owl.eyeColor })
      graphics.circle(owl.size * 0.3, -owl.size * 0.2, owl.eyeGlowRadius)
      graphics.fill({ color: owl.eyeColor })
    }
  }
  
  private renderSignpost(graphics: PIXI.Graphics, sign: Signpost): void {
    // Pole
    graphics.rect(-3, -sign.poleHeight, 6, sign.poleHeight)
    graphics.fill({ color: sign.woodColor })
    
    // Sign board
    graphics.rect(-sign.width/2, -sign.poleHeight - sign.height, sign.width, sign.height)
    graphics.fill({ color: sign.woodColor })
  }
  

  
  private renderCloud(graphics: PIXI.Graphics, cloud: Cloud): void {
    // Draw simple cloud layers
    const baseRadius = 40 + Math.random() * 20
    for (let i = 0; i < cloud.layers; i++) {
      const layerRadius = baseRadius + i * 15
      const offsetX = (i - cloud.layers/2) * 25
      const offsetY = Math.sin(i) * 10
      graphics.circle(offsetX, offsetY, layerRadius)
      graphics.fill({ color: 0xffffff, alpha: cloud.opacity * (0.8 - i * 0.1) })
    }
  }
  
  private renderGrassCluster(graphics: PIXI.Graphics, grass: GrassCluster): void {
    const baseColor = hslToRgbHex(grass.baseHue, grass.baseSaturation, grass.baseLightness)
    // Slightly lighter tips
    const tipColor = hslToRgbHex(grass.tipHue, grass.tipSaturation, grass.tipLightness)
    for (const blade of grass.blades) {
      // Sway animation like original
      const sway = Math.sin(Date.now() * 0.001 + blade.sway) * 3
      
      // Draw grass blade with quadratic curve like original  
      graphics.moveTo(blade.x, blade.y)
      graphics.quadraticCurveTo(
        blade.x + sway/2, blade.y - blade.height/2,
        blade.x + sway, blade.y - blade.height
      )
      graphics.stroke({ width: 1.5, color: baseColor, alpha: 0.45 })
      // tip overlay
      graphics.moveTo(blade.x + sway * 0.3, blade.y - blade.height * 0.6)
      graphics.lineTo(blade.x + sway, blade.y - blade.height)
      graphics.stroke({ width: 1, color: tipColor, alpha: 0.35 })
    }
  }

  private renderShrub(graphics: PIXI.Graphics, shrub: Shrub): void {
    const r = shrub.radius
    const base = hslToRgbHex(shrub.hue, shrub.saturation, shrub.lightness)
    const highlight = hslToRgbHex(shrub.hue, shrub.saturation, Math.min(1, shrub.lightness + 0.12))
    // shadow
    graphics.ellipse(0, 3, r * 0.9, r * 0.45)
    graphics.fill({ color: 0x0a1f0a, alpha: 0.18 })
    // clustered leaves (deterministic blobs)
    for (const b of shrub.blobs) {
      graphics.circle(b.x, b.y, b.r)
      graphics.fill({ color: base, alpha: 0.95 })
    }
    // highlight
    graphics.circle(-r * 0.2, -r * 0.3, r * 0.4)
    graphics.fill({ color: highlight, alpha: 0.25 })
  }
}

// Utility to darken/lighten hex colors
function shadeColor(col: number, factor: number): number {
  const r = Math.min(255, Math.max(0, ((col >> 16) & 0xff) * factor)) | 0
  const g = Math.min(255, Math.max(0, ((col >> 8) & 0xff) * factor)) | 0
  const b = Math.min(255, Math.max(0, (col & 0xff) * factor)) | 0
  return (r << 16) | (g << 8) | b
}


