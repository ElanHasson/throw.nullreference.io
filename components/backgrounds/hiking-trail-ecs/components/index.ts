export * from './core'
export * from './rendering'
export * from './creatures'
export * from './environment'
export * from './vegetation'
export * from './celestial'

// Additional rich detail components
export class Tree {
  constructor(
    public trunkWidth: number = 15,
    public trunkHeight: number = 100,
    public foliageRadius: number = 40,
    public trunkColor: number = 0x4a3c28,
    public foliageColor: number = 0x2d5016,
    public hasBranches: boolean = true // true=broadleaf, false=conifer
  ) {}
}

// Simple shrub/bush
export class Shrub {
  public blobs: Array<{ x: number; y: number; r: number }> = []
  constructor(
    public radius: number = 10 + Math.random() * 22,
    // HSL parameters (greens). Hue 100-135, S 0.38-0.56, L 0.22-0.38
    public hue: number = 100 + Math.random() * 35,
    public saturation: number = 0.38 + Math.random() * 0.18,
    public lightness: number = 0.22 + Math.random() * 0.16,
    public density: number = 2 + Math.floor(Math.random() * 4),
    public seed: number = Math.floor(Math.random() * 1_000_000)
  ) {
    // deterministic local PRNG to avoid per-frame jitter
    let s = this.seed
    const rand = () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
    for (let i = 0; i < this.density; i++) {
      const angle = (i / this.density) * Math.PI * 2 + rand() * 0.8
      const dist = this.radius * (0.25 + rand() * 0.55)
      const x = Math.cos(angle) * dist
      const y = -Math.abs(Math.sin(angle) * dist)
      const r = this.radius * (0.4 + rand() * 0.45)
      this.blobs.push({ x, y, r })
    }
  }
}

export class Firefly {
  constructor(
    public glowRadius: number = 3,
    public glowIntensity: number = 1,
    public targetX: number = 0,
    public targetY: number = 0,
    public phase: number = Math.random() * Math.PI * 2,
    public speed: number = 0.5 + Math.random() * 0.5
  ) {}
}

export class Frog {
  constructor(
    public size: number = 15,
    public color: number = 0x4a7c4e,
    public isJumping: boolean = false,
    public jumpCooldown: number = 0,
    public sitting: boolean = true
  ) {}
}

export class Hiker {
  constructor(
    public walkSpeed: number = 30,
    public direction: number = 1, // 1 for right, -1 for left
    public currentPathIndex: number = 0,
    public color: number = Math.random() > 0.5 ? 0x5c4033 : 0x7a6a5a,
    public hatColor: number = Math.random() > 0.5 ? 0xff6b6b : 0x4ecdc4
  ) {}
}

export class Owl {
  constructor(
    public size: number = 25,
    public eyeGlowRadius: number = 5,
    public blinkTimer: number = 0,
    public isBlinking: boolean = false,
    public bodyColor: number = 0x8b7355,
    public eyeColor: number = 0xffff00
  ) {}
}

export class Signpost {
  constructor(
    public text: string = '',
    public width: number = 60,
    public height: number = 30,
    public poleHeight: number = 40,
    public woodColor: number = 0x8b4513
  ) {}
}

export class GrassCluster {
  constructor(
    public blades: Array<{x: number, y: number, height: number, sway: number}> = [],
    // HSL palette (greens). Base hue 100-130; tip slightly lighter
    public baseHue: number = 110,
    public baseSaturation: number = 0.45,
    public baseLightness: number = 0.30,
    public tipHue: number = 112,
    public tipSaturation: number = 0.48,
    public tipLightness: number = 0.40
  ) {
    // Only generate random grass blades if none provided
    if (this.blades.length === 0) {
      const bladeCount = 5 + Math.floor(Math.random() * 10)
      for (let i = 0; i < bladeCount; i++) {
        this.blades.push({
          x: (Math.random() - 0.5) * 30,
          y: 0,
          height: 10 + Math.random() * 20,
          sway: Math.random() * Math.PI * 2
        })
      }
    }
  }
}

// Simulation control component for decoupled time control
export class SimulationControl {
  constructor(
    public simulateTime: boolean = true,
    public timeScale: number = 60,
    public realDate: Date = new Date(),
    public simulatedDate: Date = new Date()
  ) {}
}

// Lily pad component
export class LilyPad {
  constructor(
    public radius: number = 20,
    public color: number = 0x2d5016,
    public rotation: number = Math.random() * Math.PI * 2,
    public hasFlower: boolean = Math.random() > 0.7
  ) {}
}

// Resource for PIXI scene container
export class SceneContainer {
  constructor(public container: import('pixi.js').Container) {}
}

