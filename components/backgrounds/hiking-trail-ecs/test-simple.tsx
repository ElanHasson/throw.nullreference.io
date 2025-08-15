'use client'

import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'

// Super simple test without ECS
export default function TestSimple() {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<PIXI.Application | null>(null)

  useEffect(() => {
    if (!containerRef.current || appRef.current) return

    const initPixi = async () => {
      const app = new PIXI.Application()
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x87CEEB,
        antialias: true
      })
      
      appRef.current = app
      containerRef.current!.appendChild(app.canvas as HTMLCanvasElement)
      
      // Create a simple graphics object to test rendering
      const graphics = new PIXI.Graphics()
      
      // Draw sky gradient
      graphics.rect(0, 0, window.innerWidth, window.innerHeight / 2)
      graphics.fill({ color: 0x87CEEB })
      
      graphics.rect(0, window.innerHeight / 2, window.innerWidth, window.innerHeight / 2)
      graphics.fill({ color: 0xE0F6FF })
      
      // Draw a simple mountain
      const mountainPoints = [
        0, window.innerHeight * 0.7,
        window.innerWidth * 0.3, window.innerHeight * 0.3,
        window.innerWidth * 0.6, window.innerHeight * 0.4,
        window.innerWidth, window.innerHeight * 0.7
      ]
      graphics.poly(mountainPoints)
      graphics.fill({ color: 0x666666 })
      
      // Draw ground
      graphics.rect(0, window.innerHeight * 0.7, window.innerWidth, window.innerHeight * 0.3)
      graphics.fill({ color: 0x3A5F3A })
      
      app.stage.addChild(graphics)
    }
    
    initPixi()
    
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true)
        appRef.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
    />
  )
}