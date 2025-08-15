# Hiking Trail ECS + Pixi.js Implementation Plan

## Overview
Refactor the hiking trail background to use Entity Component System (ECS) architecture with sim-ecs and Pixi.js for rendering.

## Goals
- Improve performance with WebGL rendering
- Better code organization with ECS
- Easier to add/modify features
- Maintain all existing visual features

## Architecture

### Technology Stack
- **sim-ecs**: Entity Component System framework
- **Pixi.js**: WebGL/Canvas rendering engine
- **TypeScript**: Type safety

### Directory Structure
```
hiking-trail-ecs/
├── components/          # ECS Components
│   ├── core.ts         # Transform, Velocity, Lifetime
│   ├── rendering.ts    # PixiSprite, Layer, Glow
│   ├── environment.ts  # Sky, Mountain, Ground, Trail
│   ├── pond.ts         # Pond, Aquatic, Splash
│   ├── creatures.ts    # Animal, Frog, Owl, Bat, etc.
│   ├── vegetation.ts   # Tree, Plant, Sway
│   └── celestial.ts    # Sun, Moon, Star, Comet, ISS
├── systems/            # ECS Systems
│   ├── time-system.ts
│   ├── movement-system.ts
│   ├── render-system.ts
│   ├── sky-system.ts
│   ├── pond-system.ts
│   ├── creature-behavior/
│   │   ├── frog-system.ts
│   │   ├── owl-system.ts
│   │   ├── bat-system.ts
│   │   ├── goat-system.ts
│   │   ├── hiker-system.ts
│   │   └── firefly-system.ts
│   ├── nocturnal-system.ts
│   ├── vegetation-system.ts
│   └── celestial-system.ts
├── prefabs/            # Entity factories
│   ├── environment.ts
│   ├── creatures.ts
│   └── vegetation.ts
├── resources/          # Shared resources
│   ├── textures.ts
│   ├── game-state.ts
│   └── constants.ts
├── utils/
│   ├── pool.ts        # Object pooling
│   └── math.ts        # Helper functions
└── index.tsx          # Main component

```

## Implementation Phases

### Phase 1: Core Setup ✅ COMPLETE
1. ✅ Install dependencies (pixi.js, sim-ecs, @pixi/particle-emitter)
2. ✅ Create basic ECS world structure
3. ✅ Set up Pixi.js application
4. ✅ Create layer system for proper z-ordering

### Phase 2: Core Systems ✅ COMPLETE
1. ✅ TimeSystem - Day/night cycle management
2. ✅ MovementSystem - Entity physics and movement
3. ✅ RenderSystem - Pixi.js sprite management
4. ✅ SkySystem - Dynamic sky gradient
5. ✅ CelestialSystem - Sun, moon, stars positioning
6. ✅ ParticleSystem - Particle effects with @pixi/particle-emitter

### Phase 3: Static Environment 🚧 IN PROGRESS
1. ⏳ Mountain generation and rendering
2. ⏳ Ground and grass
3. ⏳ Static trees

### Phase 3: Dynamic Environment
1. Cloud movement
2. Vegetation swaying
3. Trail path generation

### Phase 4: Celestial Bodies
1. Sun/Moon positioning
2. Day/night cycle
3. Stars and twinkling
4. ISS orbital movement
5. Comets

### Phase 5: Pond Ecosystem
1. Pond shape generation
2. Water shader effects
3. Lily pads and cattails
4. Splash particle system

### Phase 6: Creatures - Aquatic
1. Frogs (jumping, tongue, swimming)
2. Fish (jumping from water)
3. Pond boundary system

### Phase 7: Creatures - Land
1. Hikers following trail
2. Goats grazing
3. Birds in trees

### Phase 8: Creatures - Nocturnal
1. Owls (hiding in trees, peeking)
2. Bats (dawn migration)
3. Fireflies (glowing particles)
4. Nocturnal transition system

### Phase 9: Interactions & Polish
1. Rocker switch UI
2. Time simulation control
3. Performance optimizations
4. Visual effects (filters, particles)

## Components

### Core Components
```typescript
class Transform {
  x: number
  y: number
  rotation: number
  scale: { x: number, y: number }
}

class Velocity {
  vx: number
  vy: number
  ax: number // acceleration
  ay: number
}

class PixiSprite {
  sprite: PIXI.Container
  layer: number // 0-10 for z-ordering
}
```

### Creature Components
```typescript
class Animal {
  species: string
  size: 'small' | 'medium' | 'large'
  state: string
}

class Frog {
  rockPosition: Point
  jumpPower: number
  tongueLength: number
  targetFly: number | null
}

class Owl {
  hidingTree: number | null
  state: 'flying' | 'hiding' | 'peeking' | 'entering' | 'exiting'
  stateTimer: number
}
```

## Systems

### Core Systems
1. **TimeSystem**: Manages day/night cycle, updates game time
2. **MovementSystem**: Updates entity positions based on velocity
3. **RenderSystem**: Syncs ECS transforms with Pixi sprites

### Behavior Systems
1. **FrogBehaviorSystem**: Jump, catch flies, swim
2. **OwlBehaviorSystem**: Hide at dawn, peek at dusk
3. **HikerPathSystem**: Follow trail path
4. **GoatGrazingSystem**: Find and eat grass

## Pixi.js Layer Structure
```
0. Sky (gradient background)
1. Celestial (sun, moon, stars)
2. Mountains (far background)
3. Far Trees (behind trail)
4. Trail (path and signs)
5. Pond (water and vegetation)
6. Ground (grass texture)
7. Creatures (animals, hikers)
8. Near Trees (foreground)
9. Effects (particles, glows)
10. UI (time display, controls)
```

## Performance Optimizations

### Object Pooling
- Splash effects
- Firefly glows
- Particles

### Culling
- Hide sprites outside viewport
- LOD system for distant objects

### Batching
- Use ParticleContainer for similar sprites
- Texture atlases for all assets

### Filters
- Night color filter
- Water displacement
- Glow effects for fireflies

## Migration Strategy

1. **Keep existing code intact** - New version in separate directory
2. **Incremental development** - Build feature by feature
3. **Visual parity** - Match existing appearance
4. **Performance testing** - Ensure improvement
5. **Easy switching** - Toggle between versions

## Success Metrics

- [ ] All creatures and features working
- [ ] 60 FPS performance
- [ ] Clean, maintainable code
- [ ] Easy to add new features
- [ ] Proper TypeScript types
- [ ] Visual quality matches/exceeds original

## Next Steps

1. Install dependencies
2. Create basic world and rendering setup
3. Implement sky and mountains
4. Add creatures incrementally
5. Polish with effects