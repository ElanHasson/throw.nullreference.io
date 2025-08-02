'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  chart: string
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (ref.current) {
      mermaid.initialize({ 
        startOnLoad: true,
        theme: 'default',
        themeVariables: {
          primaryColor: '#3b82f6',
          primaryTextColor: '#fff',
          primaryBorderColor: '#2563eb',
          lineColor: '#6b7280',
          secondaryColor: '#e5e7eb',
          tertiaryColor: '#f3f4f6'
        }
      })
      
      mermaid.contentLoaded()
    }
  }, [])
  
  return (
    <div ref={ref} className="mermaid my-8">
      {chart}
    </div>
  )
}