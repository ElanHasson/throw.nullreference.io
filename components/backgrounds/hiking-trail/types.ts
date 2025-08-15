export interface Bird {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  wingPhase: number
  type: 'eagle' | 'hawk' | 'swallow'
}

export interface Hiker {
  x: number
  y: number
  speed: number
  direction: 1 | -1
  size: number
  animPhase: number
  color: number
  pathPosition: number
}

export interface Owl {
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  size: number
  wingPhase: number
  huntingPhase: number
  hidingTree: TreePosition | null
  state: 'flying' | 'hiding' | 'peeking' | 'entering' | 'exiting'
  stateTimer: number
}

export interface Bat {
  x: number
  y: number
  vx: number
  vy: number
  wingPhase: number
  size: number
  swoopPhase: number
  state: 'active' | 'leaving' | 'gone'
  targetExit: 'left' | 'right' | 'mountain'
}

export interface Firefly {
  x: number
  y: number
  vx: number
  vy: number
  brightness: number
  pulsePhase: number
  size: number
}

export interface Comet {
  x: number
  y: number
  vx: number
  vy: number
  tail: Array<{x: number, y: number}>
  active: boolean
  size: number
}

export interface Fish {
  pondX: number
  jumpTime: number
  jumpHeight: number
  splashPhase: number
  active: boolean
}

export interface ISS {
  orbitalPeriod: number
  currentAngle: number
  altitude: number
  azimuth: number
  visible: boolean
  solarPanelAngle: number
}

export interface Vegetation {
  x: number
  y: number
  type: 'lilypad' | 'cattail' | 'bush' | 'grass' | 'flower' | 'mountain-shrub'
  size: number
  swayPhase: number
  color?: string
  hasFlower?: boolean
  flowerPhase?: number
  inWater?: boolean
}

export interface Frog {
  x: number
  y: number
  rockX: number
  rockY: number
  size: number
  direction: 1 | -1
  tongueOut: boolean
  tongueTarget: Fly | null
  tongueLength: number
  catchCooldown: number
  animPhase: number
  isJumping: boolean
  jumpVx: number
  jumpVy: number
  inWater: boolean
  climbingBack: boolean
  climbProgress: number
}

export interface Fly {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alive: boolean
  buzzPhase: number
  tauntTimer: number
  escapedFrom: Frog | null
}

export interface WaterSplash {
  x: number
  y: number
  radius: number
  opacity: number
  ripples: Array<{radius: number, opacity: number}>
}

export interface TreePosition {
  x: number
  y: number
  size: number
  type: 'pine' | 'deciduous'
  layers: number
  groundDetail: number
  canopyVariation: number[]
  hasBird: boolean
  hasOwl?: boolean
  leafRustleTimer?: number
}

export interface Cloud {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  layers: number
}

export interface Mountain {
  x: number
  height: number
  vegetation?: Vegetation[]
}

export interface PondConfig {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  shape: number[]
}

export interface Goat {
  x: number
  y: number
  vx: number
  size: number
  direction: 1 | -1
  animPhase: number
  eatingTimer: number
  targetGrass: {x: number, y: number} | null
}