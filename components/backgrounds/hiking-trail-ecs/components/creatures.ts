// Base animal component
export class Animal {
  constructor(
    public species: string,
    public size: 'small' | 'medium' | 'large' = 'medium',
    public state: string = 'idle'
  ) {}
}

// Frog specific
export class Frog {
  constructor(
    public rockX: number,
    public rockY: number,
    public jumpPower: number = 5,
    public tongueLength: number = 50,
    public tongueOut: boolean = false,
    public targetFly: number | null = null,
    public isJumping: boolean = false,
    public inWater: boolean = false
  ) {}
}

// Fly (frog food)
export class Fly {
  constructor(
    public buzzPhase: number = 0,
    public alive: boolean = true,
    public tauntTimer: number = 0,
    public escapedFrom: number | null = null
  ) {}
}

// Fish
export class Fish {
  constructor(
    public pondX: number = 0,
    public jumpTime: number = 0,
    public jumpHeight: number = 0,
    public active: boolean = false
  ) {}
}

// Owl
export class Owl {
  constructor(
    public hidingTree: number | null = null,
    public state: 'flying' | 'hiding' | 'peeking' | 'entering' | 'exiting' = 'flying',
    public stateTimer: number = 0,
    public huntingPhase: number = 0
  ) {}
}

// Bat
export class Bat {
  constructor(
    public state: 'active' | 'leaving' | 'gone' = 'active',
    public targetExit: 'left' | 'right' | 'mountain' = 'mountain',
    public swoopPhase: number = 0
  ) {}
}

// Firefly
export class Firefly {
  constructor(
    public brightness: number = 0,
    public pulsePhase: number = 0
  ) {}
}

// Goat
export class Goat {
  constructor(
    public targetGrass: { x: number, y: number } | null = null,
    public eatingTimer: number = 0,
    public direction: 1 | -1 = 1
  ) {}
}

// Hiker
export class Hiker {
  constructor(
    public pathPosition: number = 0,
    public speed: number = 0.5,
    public direction: 1 | -1 = 1,
    public backpackColor: number = 0x4444FF
  ) {}
}

// Bird
export class Bird {
  constructor(
    public type: 'eagle' | 'hawk' | 'swallow' = 'swallow',
    public wingPhase: number = 0
  ) {}
}

// Nocturnal behavior
export class Nocturnal {
  constructor(
    public activeStart: number = 19, // 7 PM
    public activeEnd: number = 5,    // 5 AM
    public transitionState: 'active' | 'hiding' | 'emerging' = 'active'
  ) {}
}

// Diurnal behavior
export class Diurnal {
  constructor(
    public activeStart: number = 6,  // 6 AM
    public activeEnd: number = 18    // 6 PM
  ) {}
}

// Path follower
export class PathFollower {
  constructor(
    public pathIndex: number = 0,
    public segmentProgress: number = 0,
    public speed: number = 1
  ) {}
}

// Aquatic - can be in water
export class Aquatic {
  constructor(
    public canSwim: boolean = true,
    public preferredDepth: number = 0.5
  ) {}
}