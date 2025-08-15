import * as PIXI from 'pixi.js'
import { createSystem, queryComponents, Write, Read, WriteResource } from 'sim-ecs'
import { Sky, Ground, TimeOfDay, PixiSprite, Transform, SceneContainer } from '../../components'

export const SkyGroundRenderSystem = createSystem({
  sceneContainer: WriteResource(SceneContainer),
  skyQuery: queryComponents({
    sky: Read(Sky),
    transform: Read(Transform),
    pixiSprite: Write(PixiSprite)
  }),
  groundQuery: queryComponents({
    ground: Read(Ground),
    transform: Read(Transform),
    pixiSprite: Write(PixiSprite)
  }),
  timeQuery: queryComponents({
    timeOfDay: Read(TimeOfDay)
  })
})
  .withRunFunction(({ sceneContainer, skyQuery, groundQuery, timeQuery }) => {
    // Get current time for sky gradient
    const timeResult = timeQuery.getFirst()
    const currentHour = timeResult?.timeOfDay.currentTime || 12

    // Render sky
    skyQuery.execute(({ sky, transform, pixiSprite }) => {
      if (!pixiSprite.sprite || !(pixiSprite.sprite instanceof PIXI.Graphics)) {
        pixiSprite.sprite = new PIXI.Graphics()
        sceneContainer.container.addChild(pixiSprite.sprite)
      }
      
      const graphics = pixiSprite.sprite as PIXI.Graphics
      graphics.clear()
      
      // Sky gradient based on time of day
      const width = window.innerWidth
      const height = window.innerHeight
      
      let topColor: number, bottomColor: number
      
      if (currentHour >= 6 && currentHour <= 18) {
        // Day: blue gradient
        const dayProgress = Math.abs(currentHour - 12) / 6 // 0 at noon, 1 at dawn/dusk
        topColor = lerpColor(0x87CEEB, 0xFFE4B5, dayProgress * 0.3)
        bottomColor = lerpColor(0xB0E0E6, 0xFFF8DC, dayProgress * 0.4)
      } else {
        // Night: dark gradient
        topColor = 0x0B1426
        bottomColor = 0x1E3A5F
      }
      
      // Create gradient
      const gradient = new PIXI.FillGradient(0, 0, 0, height)
      gradient.addColorStop(0, topColor)
      gradient.addColorStop(1, bottomColor)
      
      graphics.rect(0, 0, width, height)
      graphics.fill(gradient)
    })

    // Render ground
    groundQuery.execute(({ ground, transform, pixiSprite }) => {
      if (!pixiSprite.sprite || !(pixiSprite.sprite instanceof PIXI.Graphics)) {
        pixiSprite.sprite = new PIXI.Graphics()
        sceneContainer.container.addChild(pixiSprite.sprite)
      }
      
      const graphics = pixiSprite.sprite as PIXI.Graphics
      graphics.clear()
      
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Ground fill
      graphics.rect(0, ground.y, width, height - ground.y)
      graphics.fill({ color: ground.color })
      
      // Horizon line for definition
      graphics.moveTo(0, ground.y)
      graphics.lineTo(width, ground.y)
      graphics.stroke({ width: 1, color: 0x2d4a2d, alpha: 0.6 })
    })
  })
  .build()

// Helper function for color interpolation
function lerpColor(colorA: number, colorB: number, t: number): number {
  const ar = (colorA >> 16) & 0xff, ag = (colorA >> 8) & 0xff, ab = colorA & 0xff
  const br = (colorB >> 16) & 0xff, bg = (colorB >> 8) & 0xff, bb = colorB & 0xff
  const r = Math.round(ar + (br - ar) * t) & 0xff
  const g = Math.round(ag + (bg - ag) * t) & 0xff
  const bl = Math.round(ab + (bb - ab) * t) & 0xff
  return (r << 16) | (g << 8) | bl
}

export class SkyGroundRenderSystemLegacy {
  private container: PIXI.Container | null = null
  constructor(private app: PIXI.Application) {}

  update(world: World): void {
    if (!this.container) {
      this.container = new PIXI.Container()
      this.container.name = 'sky-ground'
      this.app.stage.addChildAt(this.container, 0)
    }
    this.container.removeChildren()

    const hour = (() => {
      const e = world.getEntitiesWithComponents(TimeOfDay)
      return e.length ? e[0].getComponent(TimeOfDay)!.currentTime : 12
    })()

    // Sky
    const skyEntities = world.getEntitiesWithComponents(Sky, Transform, PixiSprite)
    for (const _e of skyEntities) {
      const g = new PIXI.Graphics()
      this.renderSky(g, hour)
      this.container.addChild(g)
    }

    // Ground
    const grounds = world.getEntitiesWithComponents(Ground, Transform, PixiSprite)
    for (const e of grounds) {
      const ground = e.getComponent(Ground)!
      const t = e.getComponent(Transform)!
      const g = new PIXI.Graphics()
      g.x = t.x
      g.y = t.y
      this.renderGround(g, ground)
      this.container.addChild(g)
    }
  }

  private renderSky(graphics: PIXI.Graphics, currentHour: number): void {
    const palettes = {
      day: { top: 0x5fb8ff, bottom: 0xbfe6ff },
      dusk: { top: 0x5070b8, bottom: 0x8fb3e0 },
      night: { top: 0x0b1238, bottom: 0x182a6a },
      dawn: { top: 0x5e8fd6, bottom: 0xaad4ff }
    }

    let topColor = palettes.day.top
    let bottomColor = palettes.day.bottom
    if (currentHour < 5 || currentHour >= 21) {
      topColor = palettes.night.top
      bottomColor = palettes.night.bottom
    } else if (currentHour < 7) {
      topColor = palettes.dawn.top
      bottomColor = palettes.dawn.bottom
    } else if (currentHour >= 19) {
      topColor = palettes.dusk.top
      bottomColor = palettes.dusk.bottom
    }

    const width = window.innerWidth
    const height = window.innerHeight
    const steps = 128

    const r1 = (topColor >> 16) & 0xff
    const g1 = (topColor >> 8) & 0xff
    const b1 = topColor & 0xff
    const r2 = (bottomColor >> 16) & 0xff
    const g2 = (bottomColor >> 8) & 0xff
    const b2 = bottomColor & 0xff

    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1)
      const r = Math.round(r1 + (r2 - r1) * t)
      const g = Math.round(g1 + (g2 - g1) * t)
      const b = Math.round(b1 + (b2 - b1) * t)
      const color = (r << 16) | (g << 8) | b
      const y = Math.floor((i * height) / steps)
      const h = Math.ceil(((i + 1) * height) / steps) - y
      graphics.rect(0, y, width, h)
      graphics.fill({ color })
    }
  }

  private renderGround(graphics: PIXI.Graphics, ground: Ground): void {
    const width = window.innerWidth
    const bottom = Math.max(0, window.innerHeight - ground.y)
    const groundPoints: Array<{ x: number; y: number }> = []
    for (let x = -10; x <= width + 20; x += 20) {
      const y = Math.sin(x * 0.005) * 10 + Math.cos(x * 0.008) * 5
      groundPoints.push({ x, y })
    }
    graphics.beginPath()
    graphics.moveTo(-10, 0)
    for (let i = 0; i < groundPoints.length; i++) {
      graphics.lineTo(groundPoints[i].x, groundPoints[i].y)
    }
    graphics.lineTo(width + 10, bottom)
    graphics.lineTo(-10, bottom)
    graphics.closePath()
    graphics.fill({ color: 0x5a7042, alpha: 1 })

    graphics.moveTo(-10, 0)
    graphics.lineTo(width + 10, 0)
    graphics.stroke({ width: 2, color: 0x2f3a21, alpha: 0.15 })
  }
}


