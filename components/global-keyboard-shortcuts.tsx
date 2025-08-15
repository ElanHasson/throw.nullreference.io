'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function GlobalKeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search from anywhere
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        router.push('/search')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return null
}