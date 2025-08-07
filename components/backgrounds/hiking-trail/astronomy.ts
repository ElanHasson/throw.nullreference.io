export interface SunPosition {
  altitude: number
  azimuth: number
}

export interface MoonPosition {
  altitude: number
  azimuth: number
  phase: number
  illumination: number
}

export function getSunMoonPosition(date: Date, latitude: number): { sun: SunPosition, moon: MoonPosition } {
  const julianDate = (date.getTime() / 86400000) + 2440587.5
  const n = julianDate - 2451545.0
  
  // Sun calculations
  const L = (280.460 + 0.9856474 * n) % 360
  const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180
  const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * Math.PI / 180
  
  const beta = 0
  const epsilon = (23.439 - 0.0000004 * n) * Math.PI / 180
  
  const alpha = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda))
  const delta = Math.asin(Math.sin(epsilon) * Math.sin(lambda))
  
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60
  const siderealTime = (280.147 + 360.9856235 * n + hour * 15) % 360
  const hourAngle = (siderealTime - alpha * 180 / Math.PI) * Math.PI / 180
  
  const latRad = latitude * Math.PI / 180
  const sunAltitude = Math.asin(
    Math.sin(latRad) * Math.sin(delta) + 
    Math.cos(latRad) * Math.cos(delta) * Math.cos(hourAngle)
  ) * 180 / Math.PI
  
  const sunAzimuth = Math.atan2(
    -Math.cos(delta) * Math.sin(hourAngle),
    Math.sin(delta) * Math.cos(latRad) - Math.cos(delta) * Math.cos(hourAngle) * Math.sin(latRad)
  ) * 180 / Math.PI + 180
  
  // Moon calculations (simplified)
  const moonAge = ((julianDate - 2451550.1) / 29.530588853) % 1
  const moonPhase = moonAge
  const moonIllumination = 0.5 * (1 - Math.cos(2 * Math.PI * moonAge))
  
  const moonLongitude = (218.316 + 13.176396 * n) % 360
  const moonAngle = moonLongitude * Math.PI / 180
  
  const moonAltitude = 30 * Math.sin(moonAngle - hourAngle) + 20
  const moonAzimuth = (moonLongitude + 90) % 360
  
  return {
    sun: { altitude: sunAltitude, azimuth: sunAzimuth },
    moon: { 
      altitude: moonAltitude, 
      azimuth: moonAzimuth, 
      phase: moonPhase,
      illumination: moonIllumination
    }
  }
}