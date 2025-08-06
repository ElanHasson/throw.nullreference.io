'use client'

import React, { useState, useEffect, useRef } from 'react'
import { TagPill } from './tag-pill'

interface SmartPillContainerProps {
  tags: string[]
  className?: string
  pillSize?: 'sm' | 'md'
  showHash?: boolean
}

export function SmartPillContainer({ 
  tags, 
  className = '', 
  pillSize = 'md',
  showHash = true 
}: SmartPillContainerProps) {
  const [visibleTags, setVisibleTags] = useState<string[]>(tags)
  const [hiddenCount, setHiddenCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)

  // Calculate pill width (approximate based on tag length and size)
  const estimatePillWidth = (tag: string): number => {
    const baseWidth = pillSize === 'sm' ? 20 : 24 // padding
    const charWidth = pillSize === 'sm' ? 6 : 7 // approximate character width
    const hashWidth = showHash ? (pillSize === 'sm' ? 6 : 7) : 0
    return baseWidth + (tag.length * charWidth) + hashWidth + 8 // 8 for margin
  }

  const updateVisibleTags = () => {
    if (!containerRef.current || tags.length === 0) return

    const containerWidth = containerRef.current.offsetWidth
    let totalWidth = 0
    let visibleCount = 0
    const moreButtonWidth = 60 // approximate width of "+X" button

    for (let i = 0; i < tags.length; i++) {
      const pillWidth = estimatePillWidth(tags[i])
      
      // If this would be the last tag and we have more, reserve space for "+X" button
      if (i === tags.length - 1 || totalWidth + pillWidth <= containerWidth - (i < tags.length - 1 ? moreButtonWidth : 0)) {
        totalWidth += pillWidth
        visibleCount++
      } else {
        break
      }
    }

    // If we can't fit all tags, ensure we have space for the "+X" button
    if (visibleCount < tags.length && totalWidth + moreButtonWidth > containerWidth && visibleCount > 0) {
      visibleCount--
    }

    setVisibleTags(tags.slice(0, Math.max(1, visibleCount)))
    setHiddenCount(Math.max(0, tags.length - visibleCount))
  }

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      updateVisibleTags()
    })

    if (containerRef.current) {
      observer.observe(containerRef.current)
      // Initial calculation
      setTimeout(updateVisibleTags, 0)
    }

    return () => observer.disconnect()
  }, [tags, containerWidth, pillSize, showHash])

  if (tags.length === 0) return null

  return (
    <div 
      ref={containerRef} 
      className={`flex flex-wrap items-center gap-1.5 ${className}`}
    >
      {visibleTags.map((tag) => (
        <TagPill key={tag} tag={tag} size={pillSize} showHash={showHash} />
      ))}
      {hiddenCount > 0 && (
        <span className={`
          rounded-full bg-gray-100 text-gray-500 font-medium
          dark:bg-gray-800 dark:text-gray-500
          ${pillSize === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'}
        `}>
          +{hiddenCount}
        </span>
      )}
    </div>
  )
}