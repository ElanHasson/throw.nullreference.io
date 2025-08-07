import { BackgroundProps } from './types'

export function AnimatedGradient({ intensity = 'medium' }: BackgroundProps) {
  const getIntensityClass = () => {
    switch (intensity) {
      case 'low': return 'animate-gradient-slow'
      case 'high': return 'animate-gradient-fast'
      default: return 'animate-gradient'
    }
  }

  return (
    <div className={`absolute inset-0 bg-gradient-to-br from-rose-100 via-purple-50 to-indigo-100 dark:from-rose-950/20 dark:via-purple-950/20 dark:to-indigo-950/20 ${getIntensityClass()}`} />
  )
}