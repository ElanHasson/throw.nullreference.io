import { createSystem, queryComponents, Write, Read } from 'sim-ecs'
import { Firefly, Transform, Velocity, TimeOfDay } from '../components'

export class FireflySystem implements System {
  update(world: World, deltaTime: number): void {
    const timeEntities = world.getEntitiesWithComponents(TimeOfDay)
    const isDaytime = timeEntities.length > 0 && 
      timeEntities[0].getComponent(TimeOfDay)!.currentTime >= 6 && 
      timeEntities[0].getComponent(TimeOfDay)!.currentTime < 18
    
    const fireflies = world.getEntitiesWithComponents(Firefly, Transform, Velocity)
    for (const entity of fireflies) {
      const firefly = entity.getComponent(Firefly)!
      const transform = entity.getComponent(Transform)!
      const velocity = entity.getComponent(Velocity)!
      
      // Only visible at night
      firefly.glowIntensity = isDaytime ? 0 : 0.5 + Math.sin(firefly.phase) * 0.5
      firefly.phase += deltaTime * 0.003
      
      // Wander movement
      const dx = firefly.targetX - transform.x
      const dy = firefly.targetY - transform.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 10) {
        // Pick new target
        firefly.targetX = Math.random() * window.innerWidth
        firefly.targetY = window.innerHeight * 0.4 + Math.random() * window.innerHeight * 0.3
      }
      
      velocity.vx = (dx / dist) * firefly.speed
      velocity.vy = (dy / dist) * firefly.speed
      
      transform.x += velocity.vx * deltaTime * 0.1
      transform.y += velocity.vy * deltaTime * 0.1
    }
  }
}
