import * as PIXI from 'pixi.js'
import { createSystem, queryComponents, Write, Read } from 'sim-ecs'
import { LilyPad, Transform, Pond, PixiSprite } from '../../components'

export const LilyPadRenderSystem = createSystem({})
  .withRunFunction(() => {
    // TODO: Convert to sim-ecs
  })
  .build()

export class LilyPadRenderSystemLegacy {
  private pondRefs: Array<{ x: number; y: number; container: PIXI.Container | null; w: number; h: number }> = []

  update(world: World): void {
    // Refresh pond references
    this.pondRefs = []
    const ponds = world.getEntitiesWithComponents(Pond, Transform, PixiSprite)
    for (const e of ponds) {
      const t = e.getComponent(Transform)!
      const ps = e.getComponent(PixiSprite)!
      const pond = e.getComponent(Pond)!
      this.pondRefs.push({ x: t.x, y: t.y, container: (ps.sprite as PIXI.Container) || null, w: pond.width, h: pond.height })
    }

    const pads = world.getEntitiesWithComponents(LilyPad, Transform, PixiSprite)
    for (const e of pads) {
      const pad = e.getComponent(LilyPad)!
      const t = e.getComponent(Transform)!
      const ps = e.getComponent(PixiSprite)!
      if (!ps.graphics) ps.graphics = new PIXI.Graphics()
      const g = ps.graphics as PIXI.Graphics
      g.clear()

      // Subtle sway
      const sway = Math.sin(Date.now() * 0.001 + pad.rotation) * 2
      g.x = sway

      const size = pad.radius
      g.beginPath()
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        const notch = angle > Math.PI * 0.9 && angle < Math.PI * 1.1
        const radius = notch ? size * 0.5 : size
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        if (angle === 0) g.moveTo(x, y)
        else g.lineTo(x, y)
      }
      g.closePath()
      g.fill({ color: pad.color, alpha: 0.9 })
      g.lineStyle(0.5, 0x1a3408, 0.3)
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 / 6) * i
        g.moveTo(0, 0)
        g.lineTo(Math.cos(a) * size * 0.8, Math.sin(a) * size * 0.8)
      }
      g.stroke()

      if (pad.hasFlower) {
        const flowerSize = 5 * (pad.radius / 15)
        for (let i = 0; i < 6; i++) {
          const pa = (Math.PI * 2 / 6) * i
          const px = Math.cos(pa) * flowerSize
          const py = Math.sin(pa) * flowerSize
          g.circle(px, py, flowerSize * 0.6)
          g.fill({ color: 0xf4d3e3, alpha: 0.9 })
        }
        g.circle(0, 0, flowerSize * 0.4)
        g.fill({ color: 0xd4af37, alpha: 0.9 })
      }

      // Attach into nearest pond plantsLayer and clamp to ellipse
      let best: { x: number; y: number; container: PIXI.Container | null; w: number; h: number } | null = null
      let bestDist = Infinity
      for (const pr of this.pondRefs) {
        const dx = t.x - pr.x
        const dy = t.y - pr.y
        const d2 = dx * dx + dy * dy
        if (d2 < bestDist) { bestDist = d2; best = pr }
      }
      const plantsLayer = best?.container?.children.find(c => c.name === 'plantsLayer') as PIXI.Container | undefined
      if (plantsLayer && best) {
        let lx = t.x - best.x
        let ly = t.y - best.y
        const rx = best.w * 0.5 * 0.96
        const ry = best.h * 0.5 * 0.96 * 0.65
        if (rx > 0 && ry > 0) {
          const ex = lx / rx
          const ey = ly / ry
          const e2 = ex * ex + ey * ey
          if (e2 > 1) {
            const s = 1 / Math.sqrt(e2)
            lx *= s
            ly *= s
          }
        }
        g.x = lx
        g.y = ly
        plantsLayer.addChild(g)
      }
    }
  }
}


