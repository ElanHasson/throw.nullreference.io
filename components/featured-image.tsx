import { OptimizedImage } from './optimized-image'
import { cn } from '@/lib/utils'

interface FeaturedImageProps {
  src: string
  alt: string
  priority?: boolean
  className?: string
  variant?: 'small' | 'medium' | 'large' | 'hero'
}

const variants = {
  small: 'aspect-[4/3] max-h-48',
  medium: 'aspect-[3/2] max-h-64', 
  large: 'aspect-[16/9] max-h-80',
  hero: 'aspect-video max-h-96'
}

export function FeaturedImage({ 
  src, 
  alt, 
  priority = false, 
  className,
  variant = 'medium' 
}: FeaturedImageProps) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-lg shadow-sm transition-shadow group-hover:shadow-md',
      variants[variant],
      className
    )}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
        priority={priority}
      />
    </div>
  )
}