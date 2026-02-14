'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  chart: string
}

// Initialize mermaid once
if (typeof window !== 'undefined') {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    themeVariables: {
      primaryColor: '#3b82f6',
      primaryTextColor: '#fff',
      primaryBorderColor: '#2563eb',
      lineColor: '#6b7280',
      secondaryColor: '#e5e7eb',
      tertiaryColor: '#f3f4f6',
    },
    flowchart: {
      htmlLabels: true,
      curve: 'linear',
    },
  })
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const renderDiagram = async () => {
      if (!ref.current || !chart) return

      try {
        // Clear any previous errors
        setError('')

        // Clear the container
        ref.current.innerHTML = ''

        // Create a text node with the chart definition
        const textNode = document.createTextNode(chart)
        ref.current.appendChild(textNode)

        // Render the diagram
        await mermaid.run({
          nodes: [ref.current],
        })
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
      }
    }

    renderDiagram()
  }, [chart])

  if (error) {
    return (
      <div className="my-4 rounded-md border border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-950">
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to render Mermaid diagram: {error}
        </p>
        <pre className="mt-2 overflow-x-auto text-xs">
          <code>{chart}</code>
        </pre>
      </div>
    )
  }

  return (
    <div className="my-8 flex justify-center overflow-x-auto">
      <div ref={ref} className="mermaid" />
    </div>
  )
}