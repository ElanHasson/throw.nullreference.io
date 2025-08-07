// Ecosystem background worker with realistic astronomy and weather
let canvas: OffscreenCanvas | null = null
let ctx: OffscreenCanvasRenderingContext2D | null = null
let animationId: number | null = null
let intensity: 'low' | 'medium' | 'high' = 'medium'

// User location and time
let userLatitude = 40.7128 // Default to NYC
let userLongitude = -74.0060
let timeOffset = 0 // For testing different times of day

// Animation state
const state: any = {
  time: 0,
  windStrength: 0,
  windTarget: 0,
  windGusts: [] as any[],
  trees: [] as any[],
  creatures: [] as any[],
  animals: [] as any[],
  clouds: [] as any[],
  stars: [] as any[],
  width: 0,
  height: 0
}

// Message handler
self.addEventListener('message', (event) => {
  const { type, data, latitude, longitude } = event.data
  
  console.log('[Worker] Received message:', type, data)
  
  switch (type) {
    case 'init':
      console.log('[Worker] Initializing canvas...')
      initCanvas(data.canvas, data.intensity, latitude, longitude)
      break
    case 'resize':
      console.log('[Worker] Resizing canvas...')
      resizeCanvas(data.width, data.height)
      break
    case 'stop':
      console.log('[Worker] Stopping animation...')
      stopAnimation()
      break
    case 'updateLocation':
      userLatitude = latitude
      userLongitude = longitude
      break
    case 'setTimeOffset':
      timeOffset = data.offset
      break
  }
})

function initCanvas(offscreenCanvas: OffscreenCanvas, bgIntensity: 'low' | 'medium' | 'high', lat?: number, lon?: number) {
  console.log('[Worker] InitCanvas called with:', { bgIntensity, lat, lon })
  canvas = offscreenCanvas
  console.log('[Worker] Canvas received:', canvas)
  ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
  console.log('[Worker] Context created:', ctx)
  intensity = bgIntensity
  
  if (lat !== undefined) userLatitude = lat
  if (lon !== undefined) userLongitude = lon
  
  if (!ctx) {
    console.error('[Worker] Failed to get 2D context')
    self.postMessage({ type: 'error', message: 'Failed to get 2D context' })
    return
  }
  
  state.width = canvas.width
  state.height = canvas.height
  console.log('[Worker] Canvas dimensions:', state.width, 'x', state.height)
  
  initializeEcosystem()
  console.log('[Worker] Ecosystem initialized')
  startAnimation()
  console.log('[Worker] Animation started')
}

function resizeCanvas(width: number, height: number) {
  if (!canvas) return
  
  canvas.width = width
  canvas.height = height
  state.width = width
  state.height = height
  
  // Stop current animation
  stopAnimation()
  
  // Reinitialize ecosystem with new dimensions
  initializeEcosystem()
  
  // Restart animation
  startAnimation()
}

function stopAnimation() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

function startAnimation() {
  console.log('[Worker] StartAnimation called, ctx:', !!ctx, 'canvas:', !!canvas)
  if (!ctx || !canvas) {
    console.error('[Worker] Cannot start animation - missing ctx or canvas')
    return
  }
  
  const animate = () => {
    if (!ctx || !canvas) return
    animateEcosystem()
    animationId = requestAnimationFrame(animate)
  }
  
  console.log('[Worker] Starting animation loop...')
  animate()
}

// Astronomical calculations
function getSunMoonPosition(date: Date, latitude: number, longitude: number) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const hour = date.getHours() + date.getMinutes() / 60
  
  // Simplified sun position calculation
  const declination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180)
  const hourAngle = 15 * (hour - 12) // 15 degrees per hour
  const solarAltitude = Math.asin(
    Math.sin(latitude * Math.PI / 180) * Math.sin(declination * Math.PI / 180) +
    Math.cos(latitude * Math.PI / 180) * Math.cos(declination * Math.PI / 180) * Math.cos(hourAngle * Math.PI / 180)
  ) * 180 / Math.PI
  
  const solarAzimuth = Math.atan2(
    Math.sin(hourAngle * Math.PI / 180),
    Math.cos(hourAngle * Math.PI / 180) * Math.sin(latitude * Math.PI / 180) -
    Math.tan(declination * Math.PI / 180) * Math.cos(latitude * Math.PI / 180)
  ) * 180 / Math.PI + 180
  
  // Moon phase calculation
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // Simplified lunar phase (0 = new moon, 0.5 = full moon, 1 = new moon again)
  const lunarCycle = 29.53059 // days
  const knownNewMoon = new Date(2000, 0, 6, 18, 14) // Known new moon
  const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / 86400000
  const moonPhase = (daysSinceNewMoon % lunarCycle) / lunarCycle
  
  // Moon position (opposite of sun at full moon)
  const moonAltitude = -solarAltitude + 30 * Math.sin(moonPhase * Math.PI * 2)
  const moonAzimuth = (solarAzimuth + 180) % 360
  
  return {
    sun: { altitude: solarAltitude, azimuth: solarAzimuth },
    moon: { altitude: moonAltitude, azimuth: moonAzimuth, phase: moonPhase }
  }
}

function getMoonPhaseIcon(phase: number): string {
  if (phase < 0.05) return '🌑' // New Moon
  else if (phase < 0.20) return '🌒' // Waxing Crescent
  else if (phase < 0.30) return '🌓' // First Quarter
  else if (phase < 0.45) return '🌔' // Waxing Gibbous
  else if (phase < 0.55) return '🌕' // Full Moon
  else if (phase < 0.70) return '🌖' // Waning Gibbous
  else if (phase < 0.80) return '🌗' // Last Quarter
  else if (phase < 0.95) return '🌘' // Waning Crescent
  else return '🌑' // New Moon
}

function initializeEcosystem() {
  if (!canvas) return
  
  const treeCount = intensity === 'low' ? 2 : intensity === 'high' ? 4 : 3
  const creatureCount = intensity === 'low' ? 5 : intensity === 'high' ? 15 : 10
  const animalCount = intensity === 'low' ? 3 : intensity === 'high' ? 8 : 5
  
  // Initialize trees
  state.trees = Array(treeCount).fill(0).map((_, i) => ({
    x: (state.width / (treeCount + 1)) * (i + 1),
    baseAngle: -Math.PI / 2 + (Math.random() - 0.5) * 0.1,
    growthRate: 0.3 + Math.random() * 0.2,
    phase: Math.random() * Math.PI * 2,
    size: 0.7 + Math.random() * 0.3,
    branches: [] as any[]
  }))
  
  // Initialize creatures
  state.creatures = Array(creatureCount).fill(0).map(() => ({
    branchIndex: Math.floor(Math.random() * state.trees.length),
    position: Math.random(),
    size: 0.5 + Math.random() * 0.5,
    hue: Math.random() * 360,
    wingPhase: Math.random() * Math.PI * 2,
    type: ['butterfly', 'bird', 'dragonfly', 'fairy'][Math.floor(Math.random() * 4)]
  }))
  
  // Initialize animals
  state.animals = Array(animalCount).fill(0).map(() => ({
    x: Math.random() * state.width,
    y: state.height - 20 - Math.random() * 50,
    vx: (Math.random() - 0.5) * 2,
    size: 0.7 + Math.random() * 0.5,
    type: ['rabbit', 'fox', 'deer', 'squirrel'][Math.floor(Math.random() * 4)],
    animPhase: Math.random() * Math.PI * 2,
    hue: 20 + Math.random() * 40,
    jumpHeight: 0
  }))
  
  // Initialize clouds - spread them across the screen
  state.clouds = Array(6).fill(0).map((_, i) => ({
    x: (state.width / 6) * i + Math.random() * (state.width / 6), // Distribute evenly
    y: 50 + Math.random() * 150,
    size: 40 + Math.random() * 60,
    opacity: 0.4 + Math.random() * 0.3,
    speed: 0.05 + Math.random() * 0.15,
    type: Math.random() > 0.5 ? 'cumulus' : 'stratus'
  }))
  
  // Initialize stars
  state.stars = Array(100).fill(0).map(() => ({
    x: Math.random() * state.width,
    y: Math.random() * state.height * 0.6,
    size: Math.random() * 2 + 0.5,
    twinkle: Math.random() * Math.PI * 2,
    brightness: 0.3 + Math.random() * 0.7
  }))
}

function animateEcosystem() {
  if (!ctx || !canvas) return
  
  state.time++
  
  // Get current date/time with offset for testing
  const now = new Date(Date.now() + timeOffset)
  const astro = getSunMoonPosition(now, userLatitude, userLongitude)
  
  // Determine if it's day or night based on sun altitude
  const isDay = astro.sun.altitude > 0
  const twilight = astro.sun.altitude > -18 && astro.sun.altitude <= 0
  
  // Sky gradient based on sun position
  drawSky(isDay, twilight, astro.sun.altitude)
  
  // Draw stars if night
  if (!isDay) {
    drawStars()
  }
  
  // Draw celestial bodies
  drawSun(astro.sun, isDay)
  drawMoon(astro.moon, isDay)
  
  // Update and draw weather
  updateWind()
  drawWindGusts()
  drawClouds(isDay)
  
  // Draw landscape
  drawMountains(isDay, astro.sun.altitude)
  
  // Clear branches for recalculation
  state.trees.forEach((tree: any) => tree.branches = [])
  
  // Draw trees
  drawTrees()
  
  // Draw creatures and animals
  drawCreatures()
  drawAnimals()
  
  // Draw ground
  drawGround(isDay)
}

function drawSky(isDay: boolean, twilight: boolean, sunAltitude: number) {
  if (!ctx) return
  
  const gradient = ctx.createLinearGradient(0, 0, 0, state.height)
  
  if (isDay) {
    // Day sky - varies with sun altitude
    const brightness = Math.max(0, Math.min(1, (sunAltitude + 10) / 70))
    gradient.addColorStop(0, `hsl(200, 70%, ${20 + brightness * 40}%)`)
    gradient.addColorStop(0.3, `hsl(190, 65%, ${30 + brightness * 40}%)`)
    gradient.addColorStop(1, `hsl(180, 60%, ${40 + brightness * 35}%)`)
  } else if (twilight) {
    // Twilight colors
    const twilightProgress = (sunAltitude + 18) / 18
    gradient.addColorStop(0, `hsl(240, 70%, ${5 + twilightProgress * 15}%)`)
    gradient.addColorStop(0.3, `hsl(20, 60%, ${10 + twilightProgress * 30}%)`)
    gradient.addColorStop(0.6, `hsl(30, 50%, ${15 + twilightProgress * 25}%)`)
    gradient.addColorStop(1, `hsl(200, 40%, ${20 + twilightProgress * 20}%)`)
  } else {
    // Night sky
    gradient.addColorStop(0, 'hsl(240, 80%, 2%)')
    gradient.addColorStop(0.5, 'hsl(240, 70%, 5%)')
    gradient.addColorStop(1, 'hsl(220, 60%, 10%)')
  }
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, state.width, state.height)
}

function drawStars() {
  if (!ctx) return
  
  state.stars.forEach((star: any) => {
    star.twinkle += 0.05
    const opacity = star.brightness * (0.5 + Math.sin(star.twinkle) * 0.5)
    
    ctx.fillStyle = `hsla(60, 100%, 90%, ${opacity})`
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
    ctx.fill()
    
    // Add glow for brighter stars
    if (star.brightness > 0.7) {
      const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3)
      glow.addColorStop(0, `hsla(60, 100%, 90%, ${opacity * 0.3})`)
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(star.x - star.size * 3, star.y - star.size * 3, star.size * 6, star.size * 6)
    }
  })
}

function drawSun(sun: {altitude: number, azimuth: number}, isDay: boolean) {
  if (!ctx || sun.altitude < -10) return
  
  // Convert altitude/azimuth to x/y position
  const x = state.width * (sun.azimuth / 360)
  const y = state.height * (0.5 - sun.altitude / 90)
  
  const sunRadius = 30 + Math.abs(sun.altitude) / 3
  
  // Sun rays
  if (sun.altitude > 0) {
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2 + state.time * 0.001
      const rayLength = sunRadius + 30 + Math.sin(state.time * 0.01 + i) * 15
      
      const gradient = ctx.createLinearGradient(
        x + Math.cos(angle) * sunRadius,
        y + Math.sin(angle) * sunRadius,
        x + Math.cos(angle) * rayLength,
        y + Math.sin(angle) * rayLength
      )
      gradient.addColorStop(0, `hsla(45, 100%, 60%, ${0.4})`)
      gradient.addColorStop(1, 'transparent')
      
      ctx.strokeStyle = gradient
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x + Math.cos(angle) * sunRadius, y + Math.sin(angle) * sunRadius)
      ctx.lineTo(x + Math.cos(angle) * rayLength, y + Math.sin(angle) * rayLength)
      ctx.stroke()
    }
  }
  
  // Sun glow
  const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, sunRadius * 3)
  if (sun.altitude > 0) {
    glowGradient.addColorStop(0, 'hsla(45, 100%, 65%, 0.6)')
    glowGradient.addColorStop(0.3, 'hsla(45, 100%, 60%, 0.3)')
    glowGradient.addColorStop(1, 'transparent')
  } else {
    // Sunset/sunrise colors
    glowGradient.addColorStop(0, 'hsla(15, 100%, 50%, 0.6)')
    glowGradient.addColorStop(0.3, 'hsla(25, 100%, 45%, 0.3)')
    glowGradient.addColorStop(1, 'transparent')
  }
  
  ctx.fillStyle = glowGradient
  ctx.beginPath()
  ctx.arc(x, y, sunRadius * 3, 0, Math.PI * 2)
  ctx.fill()
  
  // Sun body
  ctx.fillStyle = sun.altitude > 0 ? 'hsl(45, 100%, 65%)' : 'hsl(20, 100%, 55%)'
  ctx.beginPath()
  ctx.arc(x, y, sunRadius, 0, Math.PI * 2)
  ctx.fill()
}

function drawMoon(moon: {altitude: number, azimuth: number, phase: number}, isDay: boolean) {
  if (!ctx || moon.altitude < 0) return
  
  const x = state.width * (moon.azimuth / 360)
  const y = state.height * (0.5 - moon.altitude / 90)
  const moonRadius = 25
  
  // Moon glow
  const glowIntensity = isDay ? 0.2 : 0.5
  const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, moonRadius * 2)
  glowGradient.addColorStop(0, `hsla(220, 20%, 85%, ${glowIntensity})`)
  glowGradient.addColorStop(1, 'transparent')
  
  ctx.fillStyle = glowGradient
  ctx.beginPath()
  ctx.arc(x, y, moonRadius * 2, 0, Math.PI * 2)
  ctx.fill()
  
  // Moon body
  ctx.fillStyle = isDay ? 'hsla(220, 20%, 85%, 0.5)' : 'hsla(220, 20%, 85%, 0.9)'
  ctx.beginPath()
  ctx.arc(x, y, moonRadius, 0, Math.PI * 2)
  ctx.fill()
  
  // Moon phase shadow
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, moonRadius, 0, Math.PI * 2)
  ctx.clip()
  
  if (moon.phase < 0.5) {
    // Waxing - shadow on left
    const shadowX = x - moonRadius + (moon.phase * 2 * moonRadius)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(x - moonRadius, y - moonRadius, shadowX - (x - moonRadius), moonRadius * 2)
  } else {
    // Waning - shadow on right
    const shadowX = x - moonRadius + ((moon.phase - 0.5) * 2 * moonRadius)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(shadowX, y - moonRadius, x + moonRadius - shadowX, moonRadius * 2)
  }
  
  ctx.restore()
  
  // Moon craters
  ctx.fillStyle = 'hsla(220, 20%, 75%, 0.5)'
  ctx.beginPath()
  ctx.arc(x - moonRadius * 0.3, y - moonRadius * 0.2, moonRadius * 0.15, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + moonRadius * 0.2, y + moonRadius * 0.3, moonRadius * 0.1, 0, Math.PI * 2)
  ctx.fill()
}

function updateWind() {
  // Regular wind changes
  if (Math.random() > 0.98) {
    state.windTarget = (Math.random() - 0.5) * 2
  }
  state.windStrength += (state.windTarget - state.windStrength) * 0.02
  
  // Occasional wind gusts
  if (Math.random() > 0.995) {
    state.windGusts.push({
      x: -100,
      y: state.height * (0.2 + Math.random() * 0.6),
      vx: 3 + Math.random() * 5,
      vy: (Math.random() - 0.5) * 2,
      strength: 0.5 + Math.random() * 0.5,
      tendrils: Array(5).fill(0).map(() => ({
        offset: Math.random() * 50 - 25,
        phase: Math.random() * Math.PI * 2,
        amplitude: 10 + Math.random() * 20
      }))
    })
  }
  
  // Update gusts
  state.windGusts = state.windGusts.filter((gust: any) => {
    gust.x += gust.vx
    gust.y += gust.vy
    gust.strength *= 0.98
    return gust.x < state.width + 100 && gust.strength > 0.01
  })
}

function drawWindGusts() {
  if (!ctx) return
  
  state.windGusts.forEach((gust: any) => {
    gust.tendrils.forEach((tendril: any, i: number) => {
      ctx.strokeStyle = `hsla(200, 30%, 80%, ${gust.strength * 0.3})`
      ctx.lineWidth = 1
      ctx.beginPath()
      
      const points = 20
      for (let j = 0; j <= points; j++) {
        const progress = j / points
        const x = gust.x - progress * 100
        const y = gust.y + tendril.offset + 
          Math.sin(progress * Math.PI * 2 + tendril.phase + state.time * 0.05) * tendril.amplitude
        
        if (j === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      
      ctx.stroke()
    })
  })
}

function drawClouds(isDay: boolean) {
  if (!ctx) return
  
  state.clouds.forEach((cloud: any) => {
    cloud.x += cloud.speed + state.windStrength * 0.3
    if (cloud.x > state.width + cloud.size * 2) {
      cloud.x = -cloud.size * 2
      cloud.y = 30 + Math.random() * 200  // More vertical variation
    }
    
    ctx.save()
    
    if (cloud.type === 'cumulus') {
      // Soft, natural cumulus clouds with gradient
      const brightness = isDay ? 100 : 75
      
      // Draw cloud with soft edges using multiple passes
      for (let pass = 0; pass < 3; pass++) {
        const opacity = cloud.opacity * (0.2 - pass * 0.05)
        ctx.fillStyle = `hsla(0, 0%, ${brightness}%, ${opacity})`
        
        // Create natural cloud shape with random puffs
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2
          const distance = cloud.size * (0.5 + Math.random() * 0.3)
          const offsetX = Math.cos(angle) * distance
          const offsetY = Math.sin(angle) * distance * 0.5 // Flatten vertically
          const puffSize = cloud.size * (0.6 + Math.random() * 0.2 - pass * 0.1)
          
          ctx.beginPath()
          ctx.arc(cloud.x + offsetX, cloud.y + offsetY, puffSize, 0, Math.PI * 2)
          ctx.fill()
        }
        
        // Central mass
        ctx.beginPath()
        ctx.ellipse(cloud.x, cloud.y, cloud.size * (1.2 - pass * 0.1), cloud.size * (0.6 - pass * 0.05), 0, 0, Math.PI * 2)
        ctx.fill()
      }
    } else {
      // Wispy stratus clouds
      const brightness = isDay ? 95 : 70
      
      // Draw wispy layers
      for (let layer = 0; layer < 3; layer++) {
        ctx.fillStyle = `hsla(0, 0%, ${brightness}%, ${cloud.opacity * 0.15})`
        
        ctx.beginPath()
        const stretch = 2 + layer * 0.5
        const yOffset = layer * cloud.size * 0.1
        ctx.ellipse(cloud.x, cloud.y + yOffset, cloud.size * stretch, cloud.size * 0.2, Math.sin(state.time * 0.001) * 0.1, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    ctx.restore()
  })
}

function drawMountains(isDay: boolean, sunAltitude: number) {
  if (!ctx) return
  
  // Multiple mountain layers for depth
  for (let layer = 0; layer < 3; layer++) {
    const layerDepth = 1 - layer * 0.3
    const mountainCount = 4 + layer
    
    for (let i = 0; i < mountainCount; i++) {
      const x = (state.width / mountainCount) * i - 50
      const width = state.width / mountainCount + 100
      const height = (200 + Math.sin(i * 0.7 + layer) * 80) * layerDepth
      const peakX = x + width / 2 + Math.sin(i * 1.5 + layer * 0.5) * 40
      const baseY = state.height - 100  // Align with ground level
      const peakY = baseY - height
      
      // Mountain shadow (offset based on sun position)
      const shadowOffset = isDay ? (sunAltitude / 90) * 20 : 5
      ctx.fillStyle = `hsla(220, 30%, ${10 + layer * 5}%, ${0.3 * layerDepth})`
      ctx.beginPath()
      ctx.moveTo(x + shadowOffset, baseY)
      ctx.lineTo(peakX + shadowOffset, peakY)
      ctx.lineTo(x + width + shadowOffset, baseY)
      ctx.closePath()
      ctx.fill()
      
      // Mountain gradient
      const gradient = ctx.createLinearGradient(0, peakY, 0, baseY)
      const lightness = isDay ? 25 + layer * 10 + sunAltitude / 3 : 15 + layer * 5
      gradient.addColorStop(0, `hsla(220, 25%, ${lightness + 15}%, ${0.8 * layerDepth})`)
      gradient.addColorStop(0.3, `hsla(220, 20%, ${lightness + 10}%, ${0.8 * layerDepth})`)
      gradient.addColorStop(0.7, `hsla(220, 15%, ${lightness + 5}%, ${0.8 * layerDepth})`)
      gradient.addColorStop(1, `hsla(220, 10%, ${lightness}%, ${0.8 * layerDepth})`)
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.moveTo(x, baseY)
      ctx.lineTo(peakX, peakY)
      ctx.lineTo(x + width, baseY)
      ctx.closePath()
      ctx.fill()
      
      // Natural snow cap
      if (height > 150 && layer < 2) {
        const snowLine = peakY + height * 0.35
        
        // Create irregular snow patches
        for (let s = 0; s < 5; s++) {
          const snowX = peakX + (Math.random() - 0.5) * width * 0.3
          const snowY = peakY + Math.random() * (snowLine - peakY)
          const snowWidth = 20 + Math.random() * 30
          
          // Snow gradient for each patch
          const snowGradient = ctx.createRadialGradient(snowX, snowY, 0, snowX, snowY, snowWidth)
          const snowBrightness = isDay ? 95 + sunAltitude / 18 : 80
          snowGradient.addColorStop(0, `hsla(200, 20%, ${snowBrightness}%, 0.9)`)
          snowGradient.addColorStop(0.5, `hsla(200, 15%, ${snowBrightness - 5}%, 0.7)`)
          snowGradient.addColorStop(1, `hsla(200, 10%, ${snowBrightness - 10}%, 0.3)`)
          
          ctx.fillStyle = snowGradient
          ctx.beginPath()
          ctx.ellipse(snowX, snowY, snowWidth * layerDepth, snowWidth * 0.6 * layerDepth, Math.random() * Math.PI, 0, Math.PI * 2)
          ctx.fill()
        }
        
        // Main snow cap
        const mainSnowGradient = ctx.createLinearGradient(peakX, peakY, peakX, snowLine)
        const brightness = isDay ? 92 + sunAltitude / 12 : 75
        mainSnowGradient.addColorStop(0, `hsla(200, 25%, ${brightness}%, 0.95)`)
        mainSnowGradient.addColorStop(0.3, `hsla(200, 20%, ${brightness - 5}%, 0.85)`)
        mainSnowGradient.addColorStop(0.7, `hsla(200, 15%, ${brightness - 10}%, 0.7)`)
        mainSnowGradient.addColorStop(1, `hsla(200, 10%, ${brightness - 15}%, 0.4)`)
        
        // Draw irregular snow cap shape
        ctx.fillStyle = mainSnowGradient
        ctx.beginPath()
        ctx.moveTo(peakX - 35 * layerDepth, snowLine)
        ctx.quadraticCurveTo(peakX - 20 * layerDepth, peakY + height * 0.15, peakX, peakY)
        ctx.quadraticCurveTo(peakX + 20 * layerDepth, peakY + height * 0.15, peakX + 35 * layerDepth, snowLine)
        ctx.lineTo(peakX + 25 * layerDepth, snowLine + 10)
        ctx.lineTo(peakX - 25 * layerDepth, snowLine + 10)
        ctx.closePath()
        ctx.fill()
        
        // Subtle highlights for depth
        if (isDay && sunAltitude > 0) {
          ctx.fillStyle = `hsla(45, 30%, 100%, ${0.2 * (sunAltitude / 90)})`
          ctx.beginPath()
          ctx.moveTo(peakX - 15 * layerDepth, peakY + 15)
          ctx.quadraticCurveTo(peakX, peakY + 5, peakX + 10 * layerDepth, peakY + 25)
          ctx.lineTo(peakX + 5 * layerDepth, peakY + 30)
          ctx.lineTo(peakX - 10 * layerDepth, peakY + 20)
          ctx.closePath()
          ctx.fill()
        }
      }
      
      // Rock texture details
      ctx.strokeStyle = `hsla(220, 15%, ${lightness - 5}%, ${0.2 * layerDepth})`
      ctx.lineWidth = 1
      for (let j = 0; j < 5; j++) {
        const rockY = peakY + (height * 0.3) + j * 20
        const rockX1 = peakX - (state.height * 0.7 - rockY) * 0.5
        const rockX2 = peakX + (state.height * 0.7 - rockY) * 0.3
        
        ctx.beginPath()
        ctx.moveTo(rockX1, rockY)
        ctx.lineTo(rockX2, rockY + Math.random() * 10)
        ctx.stroke()
      }
    }
  }
}

function drawTrees() {
  if (!ctx) return
  
  const maxDepth = intensity === 'low' ? 7 : intensity === 'high' ? 10 : 8
  
  state.trees.forEach((tree: any, treeIndex: number) => {
    const growthCycle = Math.sin(state.time * tree.growthRate * 0.01 + tree.phase)
    const growthFactor = 0.7 + (growthCycle + 1) * 0.15
    
    // Apply wind gust effects
    let windEffect = state.windStrength
    state.windGusts.forEach((gust: any) => {
      const distance = Math.abs(gust.x - tree.x)
      if (distance < 200) {
        windEffect += gust.strength * (1 - distance / 200) * 2
      }
    })
    
    drawBranch(tree.x, state.height - 80, tree.baseAngle, maxDepth, state.height / 6 * tree.size, growthFactor, windEffect, treeIndex, maxDepth)
  })
}

function drawBranch(
  x: number, 
  y: number, 
  angle: number, 
  depth: number, 
  length: number, 
  growthFactor: number,
  windEffect: number,
  treeIndex: number,
  maxDepth: number
) {
  if (!ctx || depth === 0 || growthFactor <= 0) return

  const windAngle = angle + windEffect * (1 - depth / maxDepth) * 0.2
  const endX = x + Math.cos(windAngle) * length * growthFactor
  const endY = y + Math.sin(windAngle) * length * growthFactor

  // Store main branches for creature positioning
  if (depth === maxDepth - 2) {
    state.trees[treeIndex].branches.push({ x: endX, y: endY, angle: windAngle, depth })
  }

  // Tree trunk and branches
  const thickness = Math.max(depth * 0.8, 0.5)
  ctx.strokeStyle = `hsla(25, 40%, ${20 + depth * 3}%, 0.9)`
  ctx.lineWidth = thickness
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(endX, endY)
  ctx.stroke()

  // Leaves
  if (depth <= 3 && growthFactor > 0.7) {
    const seasonalHue = 90 + Math.sin(state.time * 0.0001) * 30
    ctx.fillStyle = `hsla(${seasonalHue}, 60%, ${40 + depth * 5}%, 0.7)`
    
    for (let i = 0; i < 3; i++) {
      const leafX = x + (endX - x) * (0.3 + i * 0.3)
      const leafY = y + (endY - y) * (0.3 + i * 0.3)
      const leafSize = 3 + Math.sin(state.time * 0.01 + i) * 1
      
      ctx.beginPath()
      ctx.ellipse(leafX, leafY, leafSize * 2, leafSize, windAngle + Math.PI / 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Recursive branching
  const angleVariation = (Math.PI / 5) + Math.sin(state.time * 0.001 + depth) * 0.1
  const branchingRandomness = Math.sin(x + y + state.time * 0.0005) * 0.1
  
  drawBranch(endX, endY, windAngle - angleVariation + branchingRandomness, depth - 1, length * 0.75, growthFactor, windEffect, treeIndex, maxDepth)
  drawBranch(endX, endY, windAngle + angleVariation - branchingRandomness, depth - 1, length * 0.75, growthFactor, windEffect, treeIndex, maxDepth)
  
  if (depth > maxDepth / 2 && Math.sin(state.time * 0.01 + x) > 0.6) {
    drawBranch(endX, endY, windAngle + branchingRandomness * 2, depth - 1, length * 0.6, growthFactor, windEffect, treeIndex, maxDepth)
  }
}

function drawCreatures() {
  if (!ctx) return
  
  state.creatures.forEach((creature: any, i: number) => {
    const tree = state.trees[creature.branchIndex]
    if (!tree.branches.length) return
    
    const branch = tree.branches[Math.floor(creature.position * tree.branches.length)]
    if (!branch) return
    
    creature.wingPhase += 0.15
    creature.position += Math.sin(state.time * 0.01 + i) * 0.002
    if (creature.position > 1) creature.position = 0
    if (creature.position < 0) creature.position = 1
    
    const x = branch.x + Math.sin(creature.wingPhase * 0.5) * 10
    const y = branch.y + Math.cos(creature.wingPhase * 0.3) * 5
    
    ctx.save()
    ctx.translate(x, y)
    
    switch(creature.type) {
      case 'butterfly':
        // Wings
        const wingSpan = 15 * creature.size * (1 + Math.sin(creature.wingPhase) * 0.3)
        ctx.fillStyle = `hsla(${creature.hue}, 70%, 50%, 0.7)`
        
        // Left wing
        ctx.beginPath()
        ctx.ellipse(-wingSpan/2, 0, wingSpan/2, wingSpan/3, -Math.PI/6 + Math.sin(creature.wingPhase) * 0.3, 0, Math.PI * 2)
        ctx.fill()
        
        // Right wing
        ctx.beginPath()
        ctx.ellipse(wingSpan/2, 0, wingSpan/2, wingSpan/3, Math.PI/6 - Math.sin(creature.wingPhase) * 0.3, 0, Math.PI * 2)
        ctx.fill()
        
        // Body
        ctx.fillStyle = 'hsl(30, 40%, 30%)'
        ctx.fillRect(-1, -3, 2, 6)
        break
        
      case 'bird':
        ctx.fillStyle = `hsl(${creature.hue}, 70%, 50%)`
        ctx.beginPath()
        ctx.arc(0, 0, 4 * creature.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Wing flap
        const flapAngle = Math.sin(creature.wingPhase) * 0.5
        ctx.strokeStyle = `hsl(${creature.hue}, 70%, 50%)`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(-10 * creature.size, -5 + flapAngle * 10)
        ctx.moveTo(0, 0)
        ctx.lineTo(10 * creature.size, -5 - flapAngle * 10)
        ctx.stroke()
        break
        
      case 'dragonfly':
        // Wings
        ctx.fillStyle = `hsla(${creature.hue}, 70%, 50%, 0.33)`
        const dfWingSize = 12 * creature.size
        
        for (let w = 0; w < 4; w++) {
          const wingAngle = (w / 4) * Math.PI + Math.sin(creature.wingPhase * 2) * 0.2
          ctx.beginPath()
          ctx.ellipse(
            Math.cos(wingAngle) * dfWingSize/2,
            Math.sin(wingAngle) * dfWingSize/2,
            dfWingSize, dfWingSize/4,
            wingAngle, 0, Math.PI * 2
          )
          ctx.fill()
        }
        
        // Body
        ctx.fillStyle = `hsl(${creature.hue}, 70%, 50%)`
        ctx.fillRect(-1, -8, 2, 16)
        break
        
      case 'fairy':
        // Glowing effect
        const glowSize = 8 * creature.size * (1 + Math.sin(creature.wingPhase * 2) * 0.2)
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize)
        glow.addColorStop(0, `hsla(${creature.hue}, 70%, 50%, 0.6)`)
        glow.addColorStop(0.5, `hsla(${creature.hue}, 70%, 50%, 0.27)`)
        glow.addColorStop(1, `hsla(${creature.hue}, 70%, 50%, 0)`)
        
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(0, 0, glowSize, 0, Math.PI * 2)
        ctx.fill()
        
        // Sparkles
        for (let s = 0; s < 3; s++) {
          const sparkleAngle = (s / 3) * Math.PI * 2 + creature.wingPhase
          const sparkleR = glowSize + 5
          ctx.fillStyle = `hsla(60, 100%, 80%, ${Math.sin(creature.wingPhase * 3 + s) * 0.5 + 0.5})`
          ctx.beginPath()
          ctx.arc(
            Math.cos(sparkleAngle) * sparkleR,
            Math.sin(sparkleAngle) * sparkleR,
            2, 0, Math.PI * 2
          )
          ctx.fill()
        }
        break
    }
    
    ctx.restore()
  })
}

function drawAnimals() {
  if (!ctx) return
  
  state.animals.forEach((animal: any) => {
    animal.animPhase += 0.1
    animal.x += animal.vx
    
    if (animal.x < 0 || animal.x > state.width) {
      animal.vx *= -1
      animal.x = Math.max(0, Math.min(state.width, animal.x))
    }
    
    if (Math.random() > 0.99) {
      animal.vx = (Math.random() - 0.5) * 2
    }
    
    if (Math.random() > 0.995 && animal.jumpHeight === 0) {
      animal.jumpHeight = 20 + Math.random() * 20
    }
    if (animal.jumpHeight > 0) {
      animal.jumpHeight -= 2
    }
    
    const y = animal.y - Math.abs(animal.jumpHeight)
    
    ctx.save()
    ctx.translate(animal.x, y)
    
    // Flip if moving left
    if (animal.vx < 0) {
      ctx.scale(-1, 1)
    }
    
    switch(animal.type) {
      case 'rabbit':
        // Body
        ctx.fillStyle = `hsl(${animal.hue}, 40%, 40%)`
        ctx.beginPath()
        ctx.ellipse(0, 0, 8 * animal.size, 6 * animal.size, 0, 0, Math.PI * 2)
        ctx.fill()
        
        // Head
        ctx.beginPath()
        ctx.arc(-6 * animal.size, -2, 5 * animal.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Ears
        ctx.beginPath()
        ctx.ellipse(-6 * animal.size, -8, 2 * animal.size, 6 * animal.size, -0.2, 0, Math.PI * 2)
        ctx.ellipse(-4 * animal.size, -8, 2 * animal.size, 6 * animal.size, 0.2, 0, Math.PI * 2)
        ctx.fill()
        
        // Tail
        ctx.fillStyle = 'hsla(0, 0%, 90%, 0.8)'
        ctx.beginPath()
        ctx.arc(8 * animal.size, -2, 3 * animal.size, 0, Math.PI * 2)
        ctx.fill()
        break
        
      case 'fox':
        // Body
        ctx.fillStyle = `hsl(${animal.hue}, 50%, 35%)`
        ctx.beginPath()
        ctx.ellipse(0, 0, 12 * animal.size, 6 * animal.size, 0, 0, Math.PI * 2)
        ctx.fill()
        
        // Head (triangular)
        ctx.beginPath()
        ctx.moveTo(-10 * animal.size, -2)
        ctx.lineTo(-15 * animal.size, -6)
        ctx.lineTo(-15 * animal.size, 2)
        ctx.closePath()
        ctx.fill()
        
        // Tail
        ctx.beginPath()
        ctx.ellipse(10 * animal.size, -3, 8 * animal.size, 4 * animal.size, -0.3, 0, Math.PI * 2)
        ctx.fill()
        
        // White tail tip
        ctx.fillStyle = 'hsla(0, 0%, 95%, 0.9)'
        ctx.beginPath()
        ctx.ellipse(14 * animal.size, -4, 3 * animal.size, 2 * animal.size, -0.3, 0, Math.PI * 2)
        ctx.fill()
        break
        
      case 'deer':
        // Body
        ctx.fillStyle = `hsl(${animal.hue}, 30%, 40%)`
        ctx.beginPath()
        ctx.ellipse(0, -5, 10 * animal.size, 8 * animal.size, 0, 0, Math.PI * 2)
        ctx.fill()
        
        // Neck
        ctx.beginPath()
        ctx.moveTo(-8 * animal.size, -5)
        ctx.lineTo(-12 * animal.size, -15)
        ctx.lineTo(-6 * animal.size, -10)
        ctx.closePath()
        ctx.fill()
        
        // Head
        ctx.beginPath()
        ctx.ellipse(-12 * animal.size, -15, 4 * animal.size, 3 * animal.size, -0.5, 0, Math.PI * 2)
        ctx.fill()
        
        // Antlers
        ctx.strokeStyle = `hsl(${animal.hue}, 30%, 30%)`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(-13 * animal.size, -18)
        ctx.lineTo(-15 * animal.size, -22)
        ctx.moveTo(-11 * animal.size, -18)
        ctx.lineTo(-9 * animal.size, -22)
        ctx.stroke()
        
        // Legs
        ctx.strokeStyle = `hsl(${animal.hue}, 30%, 30%)`
        ctx.lineWidth = 2
        for (let leg = 0; leg < 4; leg++) {
          const legX = -5 + leg * 4
          const legPhase = Math.sin(animal.animPhase + leg * Math.PI / 2) * 2
          ctx.beginPath()
          ctx.moveTo(legX * animal.size, 0)
          ctx.lineTo(legX * animal.size + legPhase, 8)
          ctx.stroke()
        }
        break
        
      case 'squirrel':
        // Body
        ctx.fillStyle = `hsl(${animal.hue}, 45%, 35%)`
        ctx.beginPath()
        ctx.ellipse(0, 0, 6 * animal.size, 5 * animal.size, 0.2, 0, Math.PI * 2)
        ctx.fill()
        
        // Head
        ctx.beginPath()
        ctx.arc(-5 * animal.size, -3, 4 * animal.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Bushy tail
        ctx.beginPath()
        ctx.ellipse(6 * animal.size, -8, 5 * animal.size, 10 * animal.size, 0.5, 0, Math.PI * 2)
        ctx.fill()
        break
    }
    
    ctx.restore()
  })
}

function drawGround(isDay: boolean) {
  if (!ctx) return
  
  const lightness = isDay ? 25 : 15
  const groundGradient = ctx.createLinearGradient(0, state.height - 100, 0, state.height)
  groundGradient.addColorStop(0, `hsla(90, 40%, ${lightness + 5}%, 0.9)`)
  groundGradient.addColorStop(1, `hsla(30, 30%, ${lightness}%, 0.9)`)
  
  ctx.fillStyle = groundGradient
  ctx.fillRect(0, state.height - 100, state.width, 100)
  
  // Grass with wind effect
  ctx.strokeStyle = `hsla(90, 50%, ${lightness + 10}%, 0.7)`
  for (let x = 0; x < state.width; x += 5) {
    const grassHeight = 10 + Math.sin(x * 0.1 + state.time * 0.01) * 5
    const sway = Math.sin(state.time * 0.02 + x * 0.01) * 2 + state.windStrength * 3
    
    // Extra sway from wind gusts
    let gustSway = 0
    state.windGusts.forEach((gust: any) => {
      const distance = Math.abs(gust.x - x)
      if (distance < 200) {
        gustSway += gust.strength * (1 - distance / 200) * 10
      }
    })
    
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, state.height)
    ctx.quadraticCurveTo(
      x + sway + gustSway, 
      state.height - grassHeight / 2, 
      x + (sway + gustSway) * 2, 
      state.height - grassHeight
    )
    ctx.stroke()
  }
}

// Export for TypeScript
export {}