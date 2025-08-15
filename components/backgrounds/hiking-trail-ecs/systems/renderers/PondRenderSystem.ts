import * as PIXI from 'pixi.js'
import { createSystem, queryComponents, Write, Read } from 'sim-ecs'
import { Pond, Transform, PixiSprite } from '../../components'

function lerpColor(colorA: number, colorB: number, t: number): number {
  const ar = (colorA >> 16) & 0xff, ag = (colorA >> 8) & 0xff, ab = colorA & 0xff
  const br = (colorB >> 16) & 0xff, bg = (colorB >> 8) & 0xff, bb = colorB & 0xff
  const r = Math.round(ar + (br - ar) * t) & 0xff
  const g = Math.round(ag + (bg - ag) * t) & 0xff
  const bl = Math.round(ab + (bb - ab) * t) & 0xff
  return (r << 16) | (g << 8) | bl
}

export const PondRenderSystem = createSystem({})
  .withRunFunction(() => {
    // TODO: Convert to sim-ecs
  })
  .build()

export class PondRenderSystemLegacy {
  private waterStripeTexture: PIXI.Texture | null = null
  private waterNoiseRT: PIXI.RenderTexture | null = null
  private waterNoiseSprite: PIXI.Sprite | null = null

  constructor(private app: PIXI.Application) {}

  update(world: World): void {
    const ponds = world.getEntitiesWithComponents(Pond, Transform, PixiSprite)
    for (const e of ponds) {
      const pond = e.getComponent(Pond)!
      const t = e.getComponent(Transform)!
      const ps = e.getComponent(PixiSprite)!
      if (!ps.sprite) {
        ps.sprite = this.buildPondContainer(pond)
      }
      const container = ps.sprite as PIXI.Container
      container.x = t.x
      container.y = t.y

      const liquidLayer = container.getChildByName('liquidLayer') as PIXI.Container | null
      const waterCaustics = liquidLayer?.getChildByName('waterCaustics') as PIXI.TilingSprite | null
      if (waterCaustics && waterCaustics.tilePosition) {
        const time = Date.now() * 0.001
        waterCaustics.tilePosition.x += Math.sin(time * 0.3) * 0.8 + 0.4
        waterCaustics.tilePosition.y += Math.cos(time * 0.2) * 0.6 + 0.3
      }

      if (this.waterNoiseSprite) {
        const time = Date.now() * 0.0008
        const primaryX = Math.sin(time * 0.7) * 8
        const primaryY = Math.cos(time * 0.5) * 6
        const secondaryX = Math.sin(time * 1.8 + Math.PI * 0.3) * 4
        const secondaryY = Math.cos(time * 1.4 + Math.PI * 0.7) * 3
        const detailX = Math.sin(time * 3.2) * 1.5
        const detailY = Math.cos(time * 2.9) * 1.2
        this.waterNoiseSprite.x = primaryX + secondaryX + detailX
        this.waterNoiseSprite.y = primaryY + secondaryY + detailY
        this.waterNoiseSprite.rotation += 0.0015
        const breathe = 1 + Math.sin(time * 0.4) * 0.05
        this.waterNoiseSprite.scale.set(0.3 * breathe)
      }
    }
  }

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

  private buildPondContainer(pond: Pond): PIXI.Container {
    const container = new PIXI.Container()

    const n = pond.shape.length
    const pts: Array<{x:number,y:number}> = []
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2
      const rx = (pond.width * 0.5) * pond.shape[i]
      const ry = (pond.height * 0.5) * pond.shape[i] * 0.65
      pts.push({ x: Math.cos(ang) * rx, y: Math.sin(ang) * ry })
    }

    const mask = new PIXI.Graphics()
    this.drawSmoothClosedShape(mask, pts, 1.0)
    mask.fill(0xffffff)
    container.addChild(mask)
    container.mask = mask

    const baseWater = new PIXI.Graphics()
    this.drawSmoothClosedShape(baseWater, pts, 1.0)
    baseWater.fill({ color: 0x1a4d66, alpha: 0.9 })
    container.addChild(baseWater)

    const depthGradient = new PIXI.Graphics()
    const steps = 40
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1)
      const scale = 1.0 - t * 0.6
      const edgeColor = 0x4a7a8f
      const centerColor = 0x0d2832
      const color = lerpColor(edgeColor, centerColor, t * t)
      this.drawSmoothClosedShape(depthGradient, pts, scale)
      depthGradient.fill({ color, alpha: 0.7 })
    }
    depthGradient.filters = [new PIXI.BlurFilter({ strength: 1.5 })]
    container.addChild(depthGradient)

    if (!this.waterNoiseRT) {
      this.waterNoiseRT = PIXI.RenderTexture.create({ width: 256, height: 256 })
    }
    const noiseG = new PIXI.Graphics()
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
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 4
      const radius = 30 + (i % 3) * 20
      const x = 128 + Math.cos(angle) * radius
      const y = 128 + Math.sin(angle) * radius
      noiseG.circle(x, y, 1 + (i % 2))
      noiseG.fill({ color: 0xffffff, alpha: 0.08 })
    }
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 256
      const y = Math.random() * 256
      const size = 0.5 + Math.random() * 1.5
      noiseG.circle(x, y, size)
      noiseG.fill({ color: 0xffffff, alpha: 0.03 })
    }
    const clearNoise = new PIXI.Graphics()
    clearNoise.rect(0, 0, 256, 256)
    clearNoise.fill({ color: 0x000000, alpha: 0 })
    this.app.renderer.render(clearNoise, { renderTexture: this.waterNoiseRT })
    this.app.renderer.render(noiseG, { renderTexture: this.waterNoiseRT })

    const liquidLayer = new PIXI.Container()
    liquidLayer.name = 'liquidLayer'
    container.addChild(liquidLayer)

    const plantsLayer = new PIXI.Container()
    plantsLayer.name = 'plantsLayer'
    plantsLayer.mask = mask
    container.addChild(plantsLayer)

    const reflections = new PIXI.Graphics()
    for (let i = 0; i < 8; i++) {
      const y = (i / 8 - 0.5) * pond.height * 0.8
      reflections.rect(-pond.width * 0.4, y, pond.width * 0.8, pond.height * 0.05)
      reflections.fill({ color: 0x87ceeb, alpha: 0.06 + Math.sin(i * 0.5) * 0.02 })
    }
    liquidLayer.addChild(reflections)

    if (!this.waterStripeTexture) {
      const rt = PIXI.RenderTexture.create({ width: 128, height: 128 })
      const g = new PIXI.Graphics()
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 128
        const y = Math.random() * 128
        const radius = 2 + Math.random() * 8
        g.circle(x, y, radius)
        g.fill({ color: 0x9fd8f0, alpha: 0.1 })
      }
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

    if (!this.waterNoiseSprite) {
      this.waterNoiseSprite = new PIXI.Sprite(this.waterNoiseRT)
      this.waterNoiseSprite.anchor.set(0.5)
      if (this.waterNoiseSprite.texture?.source) {
        this.waterNoiseSprite.texture.source.addressMode = 'repeat'
      }
      this.waterNoiseSprite.scale.set(0.3)
      this.waterNoiseSprite.alpha = 0
      this.waterNoiseSprite.visible = false
      container.addChild(this.waterNoiseSprite)
    }

    const displacementFilter = new PIXI.DisplacementFilter({
      sprite: this.waterNoiseSprite,
      scale: { x: 80, y: 60 },
      padding: 0
    })
    const blurFilter = new PIXI.BlurFilter({ strength: 0.8 })
    liquidLayer.filters = [displacementFilter, blurFilter]

    const rim = new PIXI.Graphics()
    this.drawSmoothClosedShape(rim, pts, 1.0)
    rim.stroke({ width: 3, color: 0x2d5a47, alpha: 0.4 })
    rim.filters = [new PIXI.BlurFilter({ strength: 0.8 })]
    container.addChild(rim)

    for (const scale of [0.98, 0.95]) {
      const edge = new PIXI.Graphics()
      this.drawSmoothClosedShape(edge, pts, scale)
      edge.stroke({ width: 1, color: 0x7bb8d3, alpha: 0.12 })
      container.addChild(edge)
    }
    return container
  }
}


