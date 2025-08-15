import { createSystem, queryComponents, Write, Read } from 'sim-ecs'
import { Cloud, Transform } from '../components'

export class CloudSystem implements System {
  update(world: World, deltaTime: number): void {
    const clouds = world.getEntitiesWithComponents(Cloud, Transform)
    
    for (const entity of clouds) {
      const cloud = entity.getComponent(Cloud)!
      const transform = entity.getComponent(Transform)!
      
      // Move cloud slowly across screen
      transform.x += cloud.speed * deltaTime * 0.001
      
      // Wrap around when off screen
      if (transform.x > window.innerWidth + 200) {
        transform.x = -200
        transform.y = Math.random() * window.innerHeight * 0.3
      }
    }
  }
}
