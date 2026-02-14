import * as PIXI from 'pixi.js'
import { createSystem, queryComponents, Write, Read } from 'sim-ecs'
import { Trail, Transform, PixiSprite, Layer } from '../../components'

export const TrailRenderSystem = createSystem({})
  .withRunFunction(() => {
    // TODO: Convert to sim-ecs
  })
  .build()

export class TrailRenderSystemLegacy {
  private container: PIXI.Container | null = null
  constructor(private app: PIXI.Application) {}

  update(world: World): void {
    if (!this.container) {
      this.container = new PIXI.Container()
      this.container.name = 'trail-layer'
      this.app.stage.addChild(this.container)
    }
    // Clear trail layer
    this.container.removeChildren()

    const trails = world.getEntitiesWithComponents(Trail, Transform, PixiSprite)
    for (const e of trails) {
      const t = e.getComponent(Trail)!
      const g = new PIXI.Graphics()
      this.renderTrail(g, t)
      this.container.addChild(g)
    }
  }

  private renderTrail(graphics: PIXI.Graphics, trail: Trail): void {
    const pts = trail.points
    if (!pts || pts.length < 2) return
    graphics.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1]
      const b = pts[i]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy)
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
        graphics.stroke({ width: trail.width, color: trail.color, alpha: 0.8, cap: 'round' })
      }
    }
  }
}


