import { createSystem, queryComponents, Write, Read } from 'sim-ecs'
import { Ground, Transform, Shrub, PixiSprite, Layer, Pond } from '../../components'

export const ShrubSpawnerSystem = createSystem({})
  .withRunFunction(() => {
    // TODO: Convert to sim-ecs
  })
  .build()

export class ShrubSpawnerSystemLegacy {
  private initialized = false

  update(world: World): void {
    if (this.initialized) return
    this.initialized = true

    const groundEntities = world.getEntitiesWithComponents(Ground, Transform)
    if (groundEntities.length === 0) return
    const ground = groundEntities[0].getComponent(Ground)!

    // Collect water bodies
    const ponds = world.getEntitiesWithComponents(Pond, Transform).map(e => ({ pond: e.getComponent(Pond)!, t: e.getComponent(Transform)! }))

    const width = window.innerWidth
    const shrubCount = 100
    for (let i = 0; i < shrubCount; i++) {
      let x = Math.random() * width
      let y = ground.y - 8 + Math.sin(x * 0.004) * 12 + (Math.random() - 0.5) * 20

      // Avoid water: skip spawn if within pond ellipse
      let inWater = false
      for (const { pond, t } of ponds) {
        const dx = (x - t.x) / (pond.width * 0.5)
        const dy = (y - t.y) / (pond.height * 0.5 * 0.65)
        if (dx * dx + dy * dy < 1) { inWater = true; break }
      }
      if (inWater) continue

      world.createEntity()
        .addComponent(Shrub, new Shrub())
        .addComponent(Transform, new Transform(x, y))
        .addComponent(PixiSprite, new PixiSprite(null, null, null, Math.random() < 0.5 ? Layer.FAR_TREES : Layer.NEAR_TREES))
    }
  }
}


