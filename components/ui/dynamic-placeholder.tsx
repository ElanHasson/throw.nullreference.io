'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface DynamicPlaceholderProps {
  className?: string
  colSpanClass: string
  hasLongTitle: boolean
  hasSeries: boolean
  tagCount: number
  descriptionLength: number
}

export function DynamicPlaceholder({ 
  className,
  colSpanClass,
  hasLongTitle,
  hasSeries,
  tagCount,
  descriptionLength
}: DynamicPlaceholderProps) {
  
  // Calculate optimal placeholder dimensions (same logic as DynamicFeaturedImage)
  const calculateDimensions = () => {
    let aspectRatio = 'aspect-[4/3]' // default
    let height = 'h-36' // default height class
    
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
    
    // Determine size based on card width and content density
    if (isExtraWideCard) {
      // Extra wide cards can have larger placeholders
      if (contentScore <= 2) {
        // Low content density - large placeholder
        aspectRatio = 'aspect-[5/3]'
        height = 'h-48'
      } else if (contentScore <= 4) {
        // Medium content density - medium placeholder
        aspectRatio = 'aspect-[4/3]'
        height = 'h-40'
      } else {
        // High content density - smaller placeholder
        aspectRatio = 'aspect-[3/2]'
        height = 'h-32'
      }
    } else if (isWideCard) {
      // Wide cards get proportionally larger placeholders
      if (contentScore <= 2) {
        // Low content density - large placeholder
        aspectRatio = 'aspect-[4/3]'
        height = 'h-44'
      } else if (contentScore <= 4) {
        // Medium content density - medium placeholder
        aspectRatio = 'aspect-[4/3]'
        height = 'h-36'
      } else {
        // High content density - smaller placeholder
        aspectRatio = 'aspect-[3/2]'
        height = 'h-28'
      }
    } else {
      // Single column cards
      if (contentScore <= 1) {
        // Very low content density - large placeholder
        aspectRatio = 'aspect-[4/3]'
        height = 'h-40'
      } else if (contentScore <= 3) {
        // Medium content density - standard placeholder
        aspectRatio = 'aspect-[4/3]'
        height = 'h-36'
      } else if (contentScore <= 5) {
        // High content density - smaller placeholder
        aspectRatio = 'aspect-[3/2]'
        height = 'h-32'
      } else {
        // Very high content density - compact placeholder
        aspectRatio = 'aspect-[16/10]'
        height = 'h-28'
      }
    }
    
    return { aspectRatio, height }
  }
  
  const { aspectRatio, height } = calculateDimensions()
  
  return (
    <div className={cn(
      'bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 dark:from-rose-900/20 dark:via-pink-900/20 dark:to-purple-900/20 flex items-center justify-center rounded-lg transition-all duration-300 group-hover:shadow-md',
      aspectRatio,
      height,
      className
    )}>
      <div className="text-center">
        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-rose-600/10 flex items-center justify-center">
          <svg className="h-6 w-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Read Article</p>
      </div>
    </div>
  )
}