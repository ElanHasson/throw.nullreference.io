'use client'

import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { buildWorld, createSystem, queryComponents, Write, Read } from 'sim-ecs'
import { 
  Transform, Sky, Mountain, Ground, Pond, Trail, Sun, Moon, Star,
  TimeOfDay, PixiSprite, Layer, Tree, Firefly, Frog, Hiker, Owl, 
  Signpost, GrassCluster, LilyPad, Cloud, Shrub, Cattail, SimulationControl,
  Velocity, Location, SceneContainer
} from './components'
import { TimeSystem, RenderSystem, UIRenderSystem, CelestialSystem, VegetationSpawnerSystem, ShrubSpawnerSystem, SkyGroundRenderSystem, PondRenderSystem, TrailRenderSystem, TreeRenderSystem, CloudRenderSystem, LilyPadRenderSystem } from './systems'
import { spawnAllEntities } from './prefabs'

interface HikingTrailECSProps {
  className?: string
}

export default function HikingTrailECS({ className }: HikingTrailECSProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<PIXI.Application | null>(null)
  const worldRef = useRef<any>(null)
  const systemsRef = useRef<any[]>([])

  useEffect(() => {
    if (!containerRef.current || appRef.current) return

    // Handle window resize
    const handleResize = () => {
      if (appRef.current) {
        // Force full viewport dimensions
        const vw = window.innerWidth
        const vh = window.innerHeight
        appRef.current.renderer.resize(vw, vh)
        
        // Also ensure canvas fills viewport
        const canvas = appRef.current.canvas as HTMLCanvasElement
        canvas.style.width = '100vw'
        canvas.style.height = '100vh'
        
        // TODO: Update transform positions for sim-ecs
      }
    }

    const initECS = async () => {
      console.log('Initializing ECS hiking trail...')
      
      // Initialize Pixi
      const app = new PIXI.Application()
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x87CEEB,
        antialias: true
      })
      
      console.log('Pixi.js initialized successfully')
      
      appRef.current = app
      containerRef.current!.appendChild(app.canvas as HTMLCanvasElement)
      
      const canvas = app.canvas as HTMLCanvasElement
      canvas.style.position = 'absolute'
      canvas.style.top = '0'
      canvas.style.left = '0'
      canvas.style.width = '100vw'
      canvas.style.height = '100vh'
      canvas.style.zIndex = '-1'
      canvas.style.pointerEvents = 'auto'
      canvas.style.objectFit = 'cover'
      
      window.addEventListener('resize', handleResize)
      
      // Create scene container for ECS graphics
      const sceneContainer = new PIXI.Container()
      app.stage.addChild(sceneContainer)
      
      // Create ECS world with sim-ecs
      const prepWorld = buildWorld()
        .withResource(SceneContainer)
        .withComponent(Transform)
        .withComponent(Sky)
        .withComponent(Mountain)
        .withComponent(Ground)
        .withComponent(Pond)
        .withComponent(Trail)
        .withComponent(Sun)
        .withComponent(Moon)
        .withComponent(Star)
        .withComponent(TimeOfDay)
        .withComponent(PixiSprite)
        .withComponent(Tree)
        .withComponent(Firefly)
        .withComponent(Frog)
        .withComponent(Hiker)
        .withComponent(Owl)
        .withComponent(Signpost)
        .withComponent(GrassCluster)
        .withComponent(LilyPad)
        .withComponent(Cloud)
        .withComponent(Shrub)
        .withComponent(Cattail)
        .withComponent(SimulationControl)
        .withComponent(Velocity)
        .withComponent(Location)
        .withDefaultScheduling(root => root
          .addNewStage(stage => stage
            .addSystem(TimeSystem)
            .addSystem(CelestialSystem)
            .addSystem(SkyGroundRenderSystem)
            .addSystem(PondRenderSystem)
            .addSystem(TrailRenderSystem)
            .addSystem(TreeRenderSystem)
            .addSystem(CloudRenderSystem)
            .addSystem(LilyPadRenderSystem)
            .addSystem(VegetationSpawnerSystem)
            .addSystem(ShrubSpawnerSystem)
            .addSystem(RenderSystem)
            .addSystem(UIRenderSystem)
          )
        )
        .build()

      worldRef.current = prepWorld
      
      console.log('sim-ecs world created')
      
      // Initialize SceneContainer resource
      prepWorld.addResource(SceneContainer, sceneContainer)
      
      // Create all entities using prefabs
      spawnAllEntities(prepWorld)
      
      // Prepare runtime world
      const runWorld = await prepWorld.prepareRun()
      
      console.log('Runtime world prepared')
      
      // Start the sim-ecs loop
      runWorld.start()
        .catch(console.error)
      
      console.log('Game loop started')
    }
    
    initECS()
    
    return () => {
      if (appRef.current) {
        window.removeEventListener('resize', handleResize)
        appRef.current.destroy(true)
        appRef.current = null
      }
      worldRef.current = null
      systemsRef.current = []
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        zIndex: -1,
        pointerEvents: 'auto',
        overflow: 'hidden'
      }}
    />
  )
}