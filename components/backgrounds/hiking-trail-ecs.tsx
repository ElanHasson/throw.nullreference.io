'use client'

import HikingTrailECS from './hiking-trail-ecs'

export interface HikingTrailProps {
  className?: string
}

export default function HikingTrailBackground({ className }: HikingTrailProps) {
  return <HikingTrailECS className={className} />
}