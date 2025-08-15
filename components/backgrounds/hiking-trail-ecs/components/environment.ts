// Sky component
export class Sky {
  constructor(
    public topColor: number = 0x87CEEB,
    public bottomColor: number = 0xFFE4B5,
    public brightness: number = 1
  ) {}
}

// Mountain
export class Mountain {
  constructor(
    public peaks: Array<{ x: number, height: number }> = [],
    public layerIndex: number = 0, // 0 = farthest, 2 = closest
    public color: number = 0x666666
  ) {}
}

// Ground
export class Ground {
  constructor(
    public y: number,
    public color: number = 0x8B7355,
    public hasGrass: boolean = true
  ) {}
}

// Trail
export class Trail {
  constructor(
    public points: Array<{ x: number, y: number }> = [],
    public width: number = 8,
    public color: number = 0xA0522D
  ) {}
}

// Trail marker/sign
export class TrailMarker {
  constructor(
    public text: string = '',
    public direction: 'left' | 'right' = 'right'
  ) {}
}

// Cloud
export class Cloud {
  constructor(
    public layers: number = 2,
    public speed: number = 0.1,
    public opacity: number = 0.7
  ) {}
}

// Pond
export class Pond {
  constructor(
    public shape: number[] = [], // Radial variations for organic shape
    public width: number = 300,
    public height: number = 200,
    public seed: number = Math.floor(Math.random() * 1_000_000),
    public isWater: boolean = true,
    public supportsVegetation: boolean = true
  ) {
    // If no shape provided, generate an organic outline deterministically from seed
    if (!shape || shape.length === 0) {
      const segments = 20
      const arr: number[] = []
      let s = this.seed
      const rand = () => {
        s = (s * 9301 + 49297) % 233280
        return s / 233280
      }
      for (let i = 0; i < segments; i++) {
        const ang = (i / segments) * Math.PI * 2
        const base = 0.9 + rand() * 0.08
        const varr = Math.sin(ang * 2.5) * 0.28 + Math.cos(ang * 3.7) * 0.18
        arr.push(base + varr)
      }
      this.shape = arr
    }
  }
}

// Pond boundary - keeps entities in pond
export class PondBoundary {
  constructor(
    public pondEntity: number
  ) {}
}

// Splash effect
export class Splash {
  constructor(
    public radius: number = 5,
    public maxRadius: number = 20,
    public opacity: number = 1,
    public ripples: Array<{ radius: number, opacity: number }> = []
  ) {}
}

// User location (lat/lon) for environment-dependent effects
export class Location {
  constructor(
    public latitude: number = 37.7749,
    public longitude: number = -122.4194,
    public hasAccurateFix: boolean = false
  ) {}
}