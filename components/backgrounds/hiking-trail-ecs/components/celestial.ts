// Base celestial body
export class Celestial {
  constructor(
    public altitude: number = 0,  // degrees above horizon
    public azimuth: number = 0,   // degrees from north
    public visible: boolean = true
  ) {}
}

// Sun
export class Sun {
  constructor(
    public intensity: number = 1,
    public color: number = 0xFFD700,
    public radius: number = 40,
    public visible: boolean = true
  ) {}
}

// Moon
export class Moon {
  constructor(
    public phase: number = 0.5,      // 0 = new, 0.5 = full, 1 = new
    public illumination: number = 1,
    public color: number = 0xF0F0F0,
    public radius: number = 25,
    public visible: boolean = false
  ) {}
}

// Star
export class Star {
  constructor(
    public brightness: number = 1,
    public twinklePhase: number = 0,
    public twinkleSpeed: number = 0.01,
    public size: number = 1,
    public visible: boolean = false,
    public phase: number = Math.random() * Math.PI * 2,
    public speed: number = 0.01
  ) {}
}

// Comet
export class Comet {
  constructor(
    public tail: Array<{ x: number, y: number }> = [],
    public active: boolean = true,
    public size: number = 3
  ) {}
}

// International Space Station
export class ISS {
  constructor(
    public orbitalPeriod: number = 90 * 60 * 1000, // 90 minutes in ms
    public currentAngle: number = 0,
    public solarPanelAngle: number = 0,
    public blinkPhase: number = 0
  ) {}
}