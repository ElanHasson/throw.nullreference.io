import * as PIXI from 'pixi.js'
import { Emitter } from '@pixi/particle-emitter'

// Layers for z-ordering (0 = back, 10 = front)
export enum Layer {
  SKY = 0,
  CELESTIAL = 1,
  MOUNTAINS = 2,
  GROUND = 3,
  FAR_TREES = 4,
  TRAIL = 5,
  POND = 6,
  CREATURES = 7,
  NEAR_TREES = 8,
  EFFECTS = 9,
  UI = 10
}

// Main rendering component
export class PixiSprite {
  constructor(
    public sprite: PIXI.Container | PIXI.Graphics | PIXI.Sprite | null = null,
    public texture: PIXI.Texture | null = null,
    public graphics: PIXI.Graphics | null = null,
    public layer: Layer = Layer.CREATURES,
    public visible: boolean = true,
    public alpha: number = 1,
    public tint: number | null = null,
    public zIndex?: number
  ) {}
}

// For glowing entities (fireflies, stars)
export class Glow {
  constructor(
    public intensity: number = 1,
    public color: number = 0xFFFF00,
    public radius: number = 10
  ) {}
}

// Shadow for depth
export class Shadow {
  constructor(
    public opacity: number = 0.3,
    public offsetX: number = 2,
    public offsetY: number = 4
  ) {}
}

// Particle emitter for effects
export class ParticleEmitter {
  constructor(
    public emitter: Emitter | null = null,
    public config: Record<string, unknown> | null = null
  ) {}
}

// Filter effects
export class FilterEffect {
  constructor(
    public filters: PIXI.Filter[] = []
  ) {}
}

// Culling component for optimization
export class Cullable {
  constructor(
    public bounds: PIXI.Rectangle,
    public alwaysVisible: boolean = false
  ) {}
}