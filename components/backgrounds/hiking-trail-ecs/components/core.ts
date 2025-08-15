// Basic transform component
export class Transform {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public rotation: number = 0,
    public scaleX: number = 1,
    public scaleY: number = 1
  ) {}
}

// Velocity for moving entities
export class Velocity {
  constructor(
    public vx: number = 0,
    public vy: number = 0,
    public ax: number = 0, // acceleration
    public ay: number = 0,
    public angular: number = 0, // angular velocity
    public friction: number = 0  // friction factor
  ) {}
}

// Lifetime for temporary entities
export class Lifetime {
  constructor(
    public remaining: number,
    public total: number
  ) {}
}

// Animation component
export class Animated {
  constructor(
    public phase: number = 0,
    public speed: number = 0.05
  ) {}
}

// Time of day tracker
export class TimeOfDay {
  constructor(
    public currentTime: number = 12, // 24-hour time as float (e.g., 13.5 = 1:30 PM)
    public isDay: boolean = true,
    public isSunrise: boolean = false,
    public isSunset: boolean = false,
    public sunX: number = 0,
    public sunY: number = 0,
    public moonX: number = 0,
    public moonY: number = 0,
    public skyBrightness: number = 1
  ) {}
}