import { createSystem, queryComponents, Write, Read } from 'sim-ecs'
import { Sun, Moon, Star, Transform, TimeOfDay } from '../components'

export const CelestialSystem = createSystem({
  timeQuery: queryComponents({
    timeOfDay: Read(TimeOfDay)
  }),
  sunQuery: queryComponents({
    sun: Write(Sun),
    transform: Write(Transform)
  }),
  moonQuery: queryComponents({
    moon: Write(Moon),
    transform: Write(Transform)
  }),
  starQuery: queryComponents({
    star: Write(Star)
  })
})
  .withRunFunction(({ timeQuery, sunQuery, moonQuery, starQuery }) => {
    // Get time of day
    const timeResult = timeQuery.getFirst()
    if (!timeResult) return
    
    const currentHour = timeResult.timeOfDay.currentTime

    const width = window.innerWidth
    const height = window.innerHeight
    
    // Update sun position (6 -> 18)
    sunQuery.execute(({ sun, transform }) => {
      const t = Math.max(0, Math.min(1, (currentHour - 6) / 12)) // 0 at 6, 1 at 18
      if (currentHour >= 6 && currentHour <= 18) {
        // left -> right across the sky
        const x = 0.1 * width + t * 0.8 * width
        // smooth arc peaking near noon
        const angle = t * Math.PI
        const y = 0.55 * height - Math.sin(angle) * 0.35 * height
        transform.x = x
        transform.y = y
        sun.visible = true
      } else {
        sun.visible = false
      }
    })
    
    // Update moon position (18 -> 30(=6 next day))
    moonQuery.execute(({ moon, transform }) => {
      const hourWrapped = currentHour < 6 ? currentHour + 24 : currentHour // 18..30
      const t = Math.max(0, Math.min(1, (hourWrapped - 18) / 12))
      if (currentHour < 6 || currentHour >= 18) {
        // right -> left at night to contrast the sun
        const x = 0.9 * width - t * 0.8 * width
        const angle = t * Math.PI
        const y = 0.6 * height - Math.sin(angle) * 0.28 * height
        transform.x = x
        transform.y = y
        moon.visible = true
      } else {
        moon.visible = false
      }
    })
    
    // Update star visibility/twinkle
    starQuery.execute(({ star }) => {
      const isNight = currentHour < 6 || currentHour >= 18
      star.visible = isNight
      if (isNight) {
        star.phase += star.speed * 16.67 / 1000 // Approximate deltaTime
        star.brightness = 0.5 + Math.sin(star.phase) * 0.5
      }
    })
  })
  .build()
