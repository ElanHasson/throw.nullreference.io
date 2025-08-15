import { createSystem, queryComponents, Write, Read } from 'sim-ecs'
import { Pond, Transform, LilyPad, PixiSprite, Layer, Cattail } from '../../components'

export const VegetationSpawnerSystem = createSystem({})
  .withRunFunction(() => {
    // TODO: Convert to sim-ecs
  })
  .build()

export class VegetationSpawnerSystemLegacy {
  private initialized = false

  update(world: World): void {
    if (this.initialized) return
    this.initialized = true

    const ponds = world.getEntitiesWithComponents(Pond, Transform)
    for (const p of ponds) {
      const pond = p.getComponent(Pond)!
      const t = p.getComponent(Transform)!
      if (!pond.supportsVegetation) continue

      // Spawn lily pads proportional to pond area
      const areaFactor = Math.max(6, Math.floor((pond.width * pond.height) / 4000))
      for (let i = 0; i < areaFactor; i++) {
        const band = i % 3
        const baseDist = 0.35 + band * 0.18
        const distance = baseDist + (Math.random() - 0.5) * 0.08
        const angle = (i / areaFactor) * Math.PI * 2 + (Math.random() - 0.5) * 0.3
        const x = t.x + Math.cos(angle) * (pond.width * 0.5 * distance)
        const y = t.y + Math.sin(angle) * (pond.height * 0.5 * distance)
        const pad = new LilyPad(12 + Math.random() * 8, 0x2d5016, Math.random() * Math.PI * 2, Math.random() > 0.7)
        world.createEntity()
          .addComponent(LilyPad, pad)
          .addComponent(Transform, new Transform(x, y))
          .addComponent(PixiSprite, new PixiSprite(null, null, null, Layer.POND))
      }

      // Spawn cattails around edge
      const cattailCount = Math.max(10, Math.floor((pond.width + pond.height) / 30))
      for (let i = 0; i < cattailCount; i++) {
        const angle = (i / cattailCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
        const distance = 0.85 + Math.random() * 0.25
        const x = t.x + Math.cos(angle) * (pond.width * 0.5 * distance)
        const y = t.y + Math.sin(angle) * (pond.height * 0.5 * distance)
        world.createEntity()
          .addComponent(Cattail, new Cattail(55, 4, 10, 0x4a5d2a, 0x6b4423))
          .addComponent(Transform, new Transform(x, y))
          .addComponent(PixiSprite, new PixiSprite(null, null, null, Layer.EFFECTS))
      }
    }
  }
}


