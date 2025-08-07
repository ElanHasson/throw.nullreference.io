'use client'

import { useState, useEffect } from 'react'

type OS = 'mac' | 'windows' | 'linux' | 'other'

export function useOS(): OS {
  const [os, setOS] = useState<OS>('other')

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    const platform = window.navigator.platform.toLowerCase()

    if (platform.includes('mac') || userAgent.includes('mac')) {
      setOS('mac')
    } else if (platform.includes('win') || userAgent.includes('win')) {
      setOS('windows')
    } else if (platform.includes('linux') || userAgent.includes('linux')) {
      setOS('linux')
    } else {
      setOS('other')
    }
  }, [])

  return os
}

export function useKeyboardShortcut() {
  const os = useOS()
  
  const modifierKey = os === 'mac' ? '⌘' : 'Ctrl'
  const modifierKeyName = os === 'mac' ? 'Command' : 'Control'
  
  return {
    os,
    modifierKey,
    modifierKeyName,
    searchShortcut: `${modifierKey}K`
  }
}