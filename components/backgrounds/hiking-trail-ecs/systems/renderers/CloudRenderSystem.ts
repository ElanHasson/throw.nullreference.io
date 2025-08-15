import * as PIXI from 'pixi.js'
import { createSystem, queryComponents, Write, Read } from 'sim-ecs'
import { Cloud, Transform, PixiSprite } from '../../components'

export const CloudRenderSystem = createSystem({})
  .withRunFunction(() => {
    // TODO: Convert to sim-ecs
  })
  .build()

export class CloudRenderSystemLegacy {
  private container: PIXI.Container | null = null
  constructor(private app: PIXI.Application) {}

  update(world: World): void {
    if (!this.container) {
      this.container = new PIXI.Container()
      this.container.name = 'clouds'
      this.app.stage.addChild(this.container)
    }
    this.container.removeChildren()

    const clouds = world.getEntitiesWithComponents(Cloud, Transform, PixiSprite)
    for (const e of clouds) {
      const c = e.getComponent(Cloud)!
      const t = e.getComponent(Transform)!
      const g = new PIXI.Graphics()
      g.x = t.x
      g.y = t.y
      const baseRadius = 50
      for (let i = 0; i < c.layers; i++) {
        const layerRadius = baseRadius + i * 15
        const offsetX = (i - c.layers/2) * 25
        const offsetY = Math.sin(i) * 10
        g.circle(offsetX, offsetY, layerRadius)
        g.fill({ color: 0xffffff, alpha: c.opacity * (0.8 - i * 0.1) })
      }
      this.container.addChild(g)
    }
  }
}


