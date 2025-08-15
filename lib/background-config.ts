import { BackgroundType } from '@/components/hero-background'

export interface BackgroundPreset {
  type: BackgroundType
  intensity: 'low' | 'medium' | 'high'
  interactive?: boolean
  name: string
  description: string
  performance: 'high' | 'medium' | 'low'
}

export const backgroundPresets: Record<string, BackgroundPreset> = {
  minimal: {
    type: 'animated-gradient',
    intensity: 'low',
    name: 'Animated Gradient',
    description: 'Subtle gradient animations',
    performance: 'high'
  },
  orbs: {
    type: 'floating-orbs',
    intensity: 'medium',
    name: 'Floating Orbs',
    description: 'Ethereal floating orbs',
    performance: 'high'
  },
  particles: {
    type: 'particles',
    intensity: 'medium',
    interactive: true,
    name: 'Interactive Particles',
    description: 'Mouse-responsive particle system',
    performance: 'medium'
  },
  neural: {
    type: 'neural-network',
    intensity: 'medium',
    name: 'Neural Network',
    description: 'Dynamic neural connections',
    performance: 'medium'
  },
  waves: {
    type: 'wave-motion',
    intensity: 'medium',
    name: 'Wave Motion',
    description: 'Flowing wave animations',
    performance: 'medium'
  },
  geometric: {
    type: 'geometric-grid',
    intensity: 'medium',
    name: 'Geometric Grid',
    description: 'Rotating geometric patterns',
    performance: 'medium'
  },
  cyber: {
    type: 'cyber-grid',
    intensity: 'medium',
    name: 'Cyber Grid',
    description: 'Futuristic grid with pulsing nodes',
    performance: 'medium'
  },
  fractal: {
    type: 'fractal-tree',
    intensity: 'high',
    name: 'Fractal Trees',
    description: 'Organic fractal growth',
    performance: 'medium'
  },
  codeRain: {
    type: 'code-rain',
    intensity: 'medium',
    name: 'Code Rain',
    description: 'Programming code falling',
    performance: 'low'
  },
  matrix: {
    type: 'matrix-rain',
    intensity: 'high',
    name: 'Matrix Rain',
    description: 'Classic Matrix effect',
    performance: 'low'
  },
  ecosystem: {
    type: 'ecosystem',
    intensity: 'high',
    name: 'Living Ecosystem',
    description: 'Complete animated ecosystem with creatures, animals, and landscape',
    performance: 'high'
  },
  hikingTrail: {
    type: 'hiking-trail',
    intensity: 'medium',
    name: 'Hiking Trail',
    description: 'Mountain trail with hikers, birds, and pine trees',
    performance: 'medium'
  }
}

// Get the current background configuration
export function getCurrentBackground(): BackgroundPreset {
  // Change this line to switch backgrounds
  return backgroundPresets.hikingTrail;
}
