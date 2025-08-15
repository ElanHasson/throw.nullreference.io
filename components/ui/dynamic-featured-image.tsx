'use client'

import React from 'react'
import { OptimizedImage } from '../optimized-image'
import { cn } from '@/lib/utils'

interface DynamicFeaturedImageProps {
  src: string
  alt: string
  priority?: boolean
  className?: string
  colSpanClass: string
  hasLongTitle: boolean
  hasSeries: boolean
  tagCount: number
  descriptionLength: number
}

export function DynamicFeaturedImage({ 
  src, 
  alt, 
  priority = false, 
  className,
  colSpanClass,
  hasLongTitle,
  hasSeries,
  tagCount,
  descriptionLength
}: DynamicFeaturedImageProps) {
  
  // Calculate optimal image dimensions based on content and screen responsiveness
  const calculateImageDimensions = () => {
    let aspectRatio = 'aspect-[4/3]' // default
    let maxHeight = 'max-h-64' // increased default for better visual presence
    
    // Base sizing for column span
    const isWideCard = colSpanClass.includes('col-span-2')
    const isExtraWideCard = colSpanClass.includes('xl:col-span-2') || colSpanClass.includes('2xl:col-span-2')
    
    // Content density calculation with refined scoring
    let contentScore = 0
    
    // Title length impact (more nuanced scoring)
    if (hasLongTitle) {
      contentScore += 2
    }
    
    // Series takes up significant visual space
    if (hasSeries) {
      contentScore += 1.5
    }
    
    // Description length (progressive scoring)
    if (descriptionLength > 80) contentScore += 1
    if (descriptionLength > 120) contentScore += 1
    if (descriptionLength > 180) contentScore += 1
    
    // Tag count impact (tags wrap and take substantial space)
    if (tagCount > 2) contentScore += 0.5
    if (tagCount > 4) contentScore += 1
    if (tagCount > 6) contentScore += 1.5
    
    // Determine image dimensions based on card width and content density
    // Increased all max-height values for better visual impact
    if (isExtraWideCard) {
      // Extra wide cards can have larger, wider images
      if (contentScore <= 2) {
        // Low content density - large striking image
        aspectRatio = 'aspect-[5/3]'
        maxHeight = 'max-h-72 sm:max-h-80 lg:max-h-96'
      } else if (contentScore <= 4) {
        // Medium content density - medium-large image
        aspectRatio = 'aspect-[4/3]'
        maxHeight = 'max-h-64 sm:max-h-72 lg:max-h-80'
      } else {
        // High content density - still prominent image
        aspectRatio = 'aspect-[3/2]'
        maxHeight = 'max-h-56 sm:max-h-64 lg:max-h-72'
      }
    } else if (isWideCard) {
      // Wide cards get well-sized images for visual balance
      if (contentScore <= 2) {
        // Low content density - prominent image
        aspectRatio = 'aspect-[4/3]'
        maxHeight = 'max-h-64 sm:max-h-72 lg:max-h-80'
      } else if (contentScore <= 4) {
        // Medium content density - balanced image
        aspectRatio = 'aspect-[4/3]'
        maxHeight = 'max-h-56 sm:max-h-64 lg:max-h-72'
      } else {
        // High content density - compact but visible image
        aspectRatio = 'aspect-[3/2]'
        maxHeight = 'max-h-48 sm:max-h-56 lg:max-h-64'
      }
    } else {
      // Single column cards - better sizing for modern displays
      if (contentScore <= 1) {
        // Very low content density - prominent image
        aspectRatio = 'aspect-[4/3]'
        maxHeight = 'max-h-56 sm:max-h-64 lg:max-h-72'
      } else if (contentScore <= 3) {
        // Medium content density - good balance
        aspectRatio = 'aspect-[4/3]'
        maxHeight = 'max-h-52 sm:max-h-60 lg:max-h-64'
      } else if (contentScore <= 5) {
        // High content density - still substantial image
        aspectRatio = 'aspect-[3/2]'
        maxHeight = 'max-h-48 sm:max-h-56 lg:max-h-60'
      } else {
        // Very high content density - compact but not tiny
        aspectRatio = 'aspect-[16/10]'
        maxHeight = 'max-h-44 sm:max-h-48 lg:max-h-56'
      }
    }
    
    return { aspectRatio, maxHeight }
  }
  
  const { aspectRatio, maxHeight } = calculateImageDimensions()
  
  return (
    <div className={cn(
      'relative overflow-hidden rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md',
      aspectRatio,
      maxHeight,
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