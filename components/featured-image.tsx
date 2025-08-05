import Image from 'next/image'
import { cn } from '@/lib/utils'

interface FeaturedImageProps {
  src: string
  alt: string
  priority?: boolean
  className?: string
  variant?: 'small' | 'medium' | 'large' | 'hero'
}

const variants = {
  small: 'aspect-[4/3] h-20 w-28',
  medium: 'aspect-[3/2] h-48', 
  large: 'aspect-[16/9] h-48',
  hero: 'aspect-video h-96'
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
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
      />
    </div>
  )
}