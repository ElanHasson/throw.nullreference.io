import * as PIXI from 'pixi.js'
import { IWorld } from 'sim-ecs'

export interface GameResources {
  app: PIXI.Application
  textures: Map<string, PIXI.Texture>
  timeScale: number
  paused: boolean
  rockerEnabled: boolean
}

export interface WorldWithResources extends IWorld {
  resources: GameResources
}

export function createResources(world: IWorld, app: PIXI.Application): GameResources {
  const resources: GameResources = {
    app,
    textures: new Map(),
    timeScale: 60, // 1 second = 1 minute in simulation
    paused: false,
    rockerEnabled: false
  }

  // Store resources in world for systems to access
  const worldWithResources = world as WorldWithResources
  worldWithResources.resources = resources

  return resources
}