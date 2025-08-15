'use client'

import React, { useState, useEffect, useRef } from 'react'

interface DynamicDescriptionProps {
  description: string
  className?: string
  colSpanClass: string
  hasLongTitle: boolean
  hasSeries: boolean
  tagCount: number
}

export function DynamicDescription({
  description,
  className = '',
  colSpanClass,
  hasLongTitle,
  hasSeries,
  tagCount
}: DynamicDescriptionProps) {
  const [lineClampValue, setLineClampValue] = useState(3)
  const containerRef = useRef<HTMLDivElement>(null)

  const calculateOptimalLines = () => {
    if (!containerRef.current) return

    // Base line clamp calculation based on card characteristics
    let lines = 3 // default

    // More space for wider cards
    if (colSpanClass.includes('col-span-2')) {
      lines = 4
    }

    // Adjust based on content that takes up space
    if (hasLongTitle) {
      lines = Math.max(2, lines - 1) // Long titles take more vertical space
    }

    if (hasSeries) {
      lines = Math.max(2, lines - 1) // Series pill takes space
    }

    // Adjust based on tag count - fewer tags = more space for description
    if (tagCount <= 2) {
      lines += 2
    } else if (tagCount <= 4) {
      lines += 1
    } else if (tagCount > 6) {
      lines = Math.max(2, lines - 1)
    }

    // Extra space for very wide cards
    if (colSpanClass.includes('xl:col-span-2') || colSpanClass.includes('2xl:col-span-2')) {
      lines += 1
    }

    // Minimum of 2 lines, maximum of 6 lines
    lines = Math.max(2, Math.min(6, lines))

    setLineClampValue(lines)
  }

  useEffect(() => {
    // Calculate initial lines
    calculateOptimalLines()

    // Recalculate on resize
    const handleResize = () => {
      calculateOptimalLines()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [colSpanClass, hasLongTitle, hasSeries, tagCount])

  // Dynamic line-clamp class based on calculated value
  const getLineClampClass = (lines: number) => {
    switch (lines) {
      case 1: return 'line-clamp-1'
      case 2: return 'line-clamp-2'
      case 3: return 'line-clamp-3'
      case 4: return 'line-clamp-4'
      case 5: return 'line-clamp-5'
      case 6: return 'line-clamp-6'
      default: return 'line-clamp-3'
    }
  }

  return (
    <div ref={containerRef}>
      <p className={`${className} ${getLineClampClass(lineClampValue)}`}>
        {description}
      </p>
    </div>
  )
}