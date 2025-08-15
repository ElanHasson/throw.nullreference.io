// Tree component
export class Tree {
  constructor(
    public type: 'pine' | 'deciduous' = 'pine',
    public layers: number = 3,
    public canopyVariation: number[] = [],
    public hasBird: boolean = false,
    public hasOwl: boolean = false
  ) {}
}

// Generic plant/vegetation
export class Plant {
  constructor(
    public type: 'grass' | 'bush' | 'cattail' | 'lilypad' = 'grass',
    public size: number = 1
  ) {}
}

// Swaying animation for plants
export class Sway {
  constructor(
    public phase: number = 0,
    public amplitude: number = 2,
    public frequency: number = 0.001
  ) {}
}

// Tree rustling (when owl enters/exits)
export class Rustling {
  constructor(
    public intensity: number = 0,
    public duration: number = 0
  ) {}
}

// Lily pad specific
export class LilyPad {
  constructor(
    public hasFlower: boolean = false,
    public flowerPhase: number = 0,
    public flowerColor: number = 0xFF69B4,
    public size: number = 15,
    public rotation: number = 0
  ) {}
}

// Cattail specific
export class Cattail {
  constructor(
    public height: number = 55,
    public width: number = 4,
    public headHeight: number = 10,
    public stalkColor: number = 0x4a5d2a,
    public headColor: number = 0x6b4423
  ) {}
}

// Grass patch (for goat eating)
export class GrassPatch {
  constructor(
    public eaten: boolean = false,
    public regrowTimer: number = 0,
    public regrowDuration: number = 500
  ) {}
}