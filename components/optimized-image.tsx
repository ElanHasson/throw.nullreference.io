'use client'

import ExportedImage from "next-image-export-optimizer"
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  sizes?: string
  onError?: () => void
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  fill, 
  priority, 
  className,
  sizes,
  onError 
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  if (hasError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 ${className}`} 
           style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}>
        <div className="flex h-full w-full items-center justify-center text-gray-400">
          <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    )
  }

  if (fill) {
    return (
      <ExportedImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={className}
        sizes={sizes}
        onError={handleError}
      />
    )
  }

  return (
    <ExportedImage
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      priority={priority}
      className={className}
      sizes={sizes}
      onError={handleError}
    />
  )
}