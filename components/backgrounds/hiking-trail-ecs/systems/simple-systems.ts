import * as PIXI from 'pixi.js'
import { IWorld } from 'sim-ecs'
import { 
  Transform, Velocity, TimeOfDay, Sky,
  PixiSprite, Layer
} from '../components'

// Simple system implementation that works with sim-ecs
export class SimpleTimeSystem {
  private timeScale = 60
  
  update(world: IWorld, deltaTime: number): void {
    const entities = world.getEntities()
    
    for (const entity of entities) {
      if (entity.hasComponent(TimeOfDay)) {
        const timeOfDay = entity.getComponent(TimeOfDay)
        if (!timeOfDay) continue
        
        // Update time
        timeOfDay.currentTime += (deltaTime / 1000) * this.timeScale / 60
        if (timeOfDay.currentTime >= 24) {
          timeOfDay.currentTime -= 24
        }
        
        // Calculate day/night
        const hour = Math.floor(timeOfDay.currentTime)
        timeOfDay.isDay = hour >= 6 && hour < 18
        timeOfDay.isSunrise = hour >= 5 && hour < 7
        timeOfDay.isSunset = hour >= 17 && hour < 19
        
        // Sun/moon positions
        const sunAngle = (timeOfDay.currentTime - 6) / 12 * Math.PI
        timeOfDay.sunX = Math.cos(sunAngle)
        timeOfDay.sunY = Math.sin(sunAngle)
        
        const moonAngle = sunAngle + Math.PI
        timeOfDay.moonX = Math.cos(moonAngle)
        timeOfDay.moonY = Math.sin(moonAngle)
        
        // Sky brightness
        if (hour >= 6 && hour < 18) {
          if (hour < 8) {
            timeOfDay.skyBrightness = (hour - 6) / 2
          } else if (hour > 16) {
            timeOfDay.skyBrightness = (18 - hour) / 2
          } else {
            timeOfDay.skyBrightness = 1
          }
        } else {
          timeOfDay.skyBrightness = 0.1
        }
      }
    }
  }
}

export class SimpleMovementSystem {
  update(world: IWorld, deltaTime: number): void {
    const dt = deltaTime / 1000
    const entities = world.getEntities()
    
    for (const entity of entities) {
      if (entity.hasComponent(Transform) && entity.hasComponent(Velocity)) {
        const transform = entity.getComponent(Transform)
        const velocity = entity.getComponent(Velocity)
        if (!transform || !velocity) continue
        
        // Update position
        transform.x += velocity.vx * dt
        transform.y += velocity.vy * dt
        
        // Update rotation
        if (velocity.angular !== 0) {
          transform.rotation += velocity.angular * dt
        }
        
        // Apply friction
        if (velocity.friction > 0 && velocity.friction < 1) {
          velocity.vx *= Math.pow(velocity.friction, dt)
          velocity.vy *= Math.pow(velocity.friction, dt)
          velocity.angular *= Math.pow(velocity.friction, dt)
        }
      }
    }
  }
}

export class SimpleRenderSystem {
  private sortedContainers: Map<Layer, PIXI.Container> = new Map()
  
  constructor(private stage: PIXI.Container) {
    // Create containers for each layer
    const layerValues = Object.values(Layer).filter(v => typeof v === 'number') as Layer[]
    layerValues.forEach(layer => {
      const container = new PIXI.Container()
      container.sortableChildren = true
      this.sortedContainers.set(layer, container)
      this.stage.addChild(container)
      container.zIndex = layer
    })
    
    this.stage.sortableChildren = true
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(world: IWorld, _deltaTime: number): void {
    const entities = world.getEntities()
    
    for (const entity of entities) {
      if (entity.hasComponent(Transform) && entity.hasComponent(PixiSprite)) {
        const transform = entity.getComponent(Transform)
        const pixiSprite = entity.getComponent(PixiSprite)
        if (!transform || !pixiSprite) continue
        
        // Create sprite if needed
        if (!pixiSprite.sprite) {
          const graphics = new PIXI.Graphics()
          graphics.beginFill(pixiSprite.tint || 0xFFFFFF)
          graphics.drawRect(-16, -16, 32, 32)
          graphics.endFill()
          pixiSprite.sprite = graphics
          pixiSprite.graphics = graphics
          
          const container = this.sortedContainers.get(pixiSprite.layer)
          if (container) {
            container.addChild(graphics)
          }
        }
        
        // Update sprite position
        if (pixiSprite.sprite) {
          pixiSprite.sprite.x = transform.x
          pixiSprite.sprite.y = transform.y
          pixiSprite.sprite.rotation = transform.rotation
          pixiSprite.sprite.scale.set(transform.scaleX, transform.scaleY)
          pixiSprite.sprite.visible = pixiSprite.visible
          pixiSprite.sprite.alpha = pixiSprite.alpha
        }
      }
    }
  }
}

export class SimpleSkySystem {
  private skyColors = {
    dawn: { top: 0xFFB6C1, bottom: 0xFFE4B5 },
    day: { top: 0x87CEEB, bottom: 0xE0F6FF },
    dusk: { top: 0xFF6B35, bottom: 0xFFD700 },
    night: { top: 0x191970, bottom: 0x2F4F4F }
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(world: IWorld, _deltaTime: number): void {
    const entities = world.getEntities()
    let timeOfDay: TimeOfDay | null = null
    
    // Find time of day
    for (const entity of entities) {
      if (entity.hasComponent(TimeOfDay)) {
        timeOfDay = entity.getComponent(TimeOfDay) || null
        break
      }
    }
    
    if (!timeOfDay) return
    
    // Update sky entities
    for (const entity of entities) {
      if (entity.hasComponent(Sky) && entity.hasComponent(PixiSprite)) {
        const sky = entity.getComponent(Sky)
        const pixiSprite = entity.getComponent(PixiSprite)
        if (!sky || !pixiSprite) continue
        
        // Determine colors based on time
        const hour = timeOfDay.currentTime
        let targetColors = this.skyColors.day
        
        if (hour >= 5 && hour < 7) {
          targetColors = this.skyColors.dawn
        } else if (hour >= 17 && hour < 19) {
          targetColors = this.skyColors.dusk
        } else if (hour < 5 || hour >= 19) {
          targetColors = this.skyColors.night
        }
        
        // Create or update gradient
        if (!pixiSprite.graphics) {
          const graphics = new PIXI.Graphics()
          pixiSprite.graphics = graphics
          pixiSprite.sprite = graphics
        }
        
        const graphics = pixiSprite.graphics as PIXI.Graphics
        graphics.clear()
        
        // Draw gradient background
        const gradientFill = new PIXI.FillGradient(0, 0, 0, window.innerHeight)
        gradientFill.addColorStop(0, targetColors.top)
        gradientFill.addColorStop(1, targetColors.bottom)
        
        graphics.beginFill(0xFFFFFF)
        graphics.drawRect(0, 0, window.innerWidth, window.innerHeight)
        graphics.endFill()
        // graphics.fill = gradientFill // This is handled differently in Pixi v8
        
        sky.topColor = targetColors.top
        sky.bottomColor = targetColors.bottom
        sky.brightness = timeOfDay.skyBrightness
      }
    }
  }
}