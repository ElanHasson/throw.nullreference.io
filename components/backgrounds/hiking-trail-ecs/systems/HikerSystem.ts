import { createSystem, queryComponents, Write, Read } from 'sim-ecs'
import { Hiker, Transform, Trail } from '../components'

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export class HikerSystem implements System {
  update(world: World, deltaTime: number): void {
    // Get trail path for hikers to follow
    const trailEntities = world.getEntitiesWithComponents(Trail)
    if (trailEntities.length === 0) return
    const trail = trailEntities[0].getComponent(Trail)!
    const points = trail.points
    if (points.length < 2) return

    const hikers = world.getEntitiesWithComponents(Hiker, Transform)
    for (const entity of hikers) {
      const hiker = entity.getComponent(Hiker)!
      const transform = entity.getComponent(Transform)!

      // ensure index in range
      if (!Number.isFinite(hiker.currentPathIndex)) hiker.currentPathIndex = 0
      hiker.currentPathIndex = (hiker.currentPathIndex + points.length) % points.length

      // current and next indices
      const i0 = Math.floor(hiker.currentPathIndex)
      const i1 = (i0 + 1) % points.length
      const p0 = points[i0]
      const p1 = points[i1]

      // param along current segment
      const segDX = p1.x - p0.x
      const segDY = p1.y - p0.y
      const segLen = Math.max(1, Math.hypot(segDX, segDY))
      const step = (hiker.walkSpeed * deltaTime * 0.001) / segLen
      const dir = hiker.direction >= 0 ? 1 : -1
      let t = (hiker.currentPathIndex - i0)
      t = clamp(t + step * dir, 0, 1)

      // update index when reaching segment end
      if (t >= 1) {
        hiker.currentPathIndex = i1
        t = 0
      } else if (t <= 0 && dir < 0) {
        hiker.currentPathIndex = (i0 - 1 + points.length) % points.length
        t = 1
      } else {
        hiker.currentPathIndex = i0 + t
      }

      // smooth interpolation (could be upgraded to Catmull-Rom later)
      const x = p0.x + segDX * t
      const y = p0.y + segDY * t

      // place hiker on trail (no floating)
      transform.x = x
      transform.y = y
    }
  }
}
