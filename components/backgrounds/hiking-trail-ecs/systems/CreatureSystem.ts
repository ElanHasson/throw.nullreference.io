import { createSystem, queryComponents, Write, Read } from 'sim-ecs'
import { Frog, Owl, TimeOfDay } from '../components'

export class CreatureSystem implements System {
  update(world: World, deltaTime: number): void {
    // Get time for creature behavior
    const timeEntities = world.getEntitiesWithComponents(TimeOfDay)
    const currentHour = timeEntities.length > 0 ? timeEntities[0].getComponent(TimeOfDay)!.currentTime : 12
    
    // Update frogs
    const frogs = world.getEntitiesWithComponents(Frog)
    for (const entity of frogs) {
      const frog = entity.getComponent(Frog)!
      
      // Simple frog behavior
      if (frog.jumpCooldown > 0) {
        frog.jumpCooldown -= deltaTime
      } else if (Math.random() < 0.001) {
        // Random jump
        frog.isJumping = true
        frog.jumpCooldown = 2000 + Math.random() * 3000
      }
    }
    
    // Update owls
    const owls = world.getEntitiesWithComponents(Owl)
    for (const entity of owls) {
      const owl = entity.getComponent(Owl)!
      
      // Blink occasionally
      if (owl.blinkTimer > 0) {
        owl.blinkTimer -= deltaTime
        if (owl.blinkTimer <= 0) {
          owl.isBlinking = false
          owl.blinkTimer = 3000 + Math.random() * 5000
        }
      } else if (Math.random() < 0.002) {
        // Start blinking
        owl.isBlinking = true
        owl.blinkTimer = 200 + Math.random() * 300
      }
    }
  }
}
