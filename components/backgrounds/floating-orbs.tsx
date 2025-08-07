import { BackgroundProps } from './types'

export function FloatingOrbs({ intensity = 'medium' }: BackgroundProps) {
  const orbCount = intensity === 'low' ? 3 : intensity === 'high' ? 8 : 5

  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: orbCount }).map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-3xl opacity-20 dark:opacity-10 animate-float-${i % 3}`}
          style={{
            width: `${Math.random() * 400 + 200}px`,
            height: `${Math.random() * 400 + 200}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, ${['#ec4899', '#8b5cf6', '#3b82f6', '#10b981'][i % 4]} 0%, transparent 70%)`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${20 + i * 5}s`
          }}
        />
      ))}
    </div>
  )
}