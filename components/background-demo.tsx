'use client'

import { useState } from 'react'
import { HeroBackground } from './hero-background'
import { backgroundPresets } from '@/lib/background-config'

export function BackgroundDemo() {
  const [selectedBackground, setSelectedBackground] = useState<string>('neural')
  const [showDemo, setShowDemo] = useState(false)

  if (!showDemo) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowDemo(true)}
          className="rounded-full bg-rose-600 px-4 py-2 text-sm text-white shadow-lg hover:bg-rose-700 transition-colors"
        >
          🎨 Background Demo
        </button>
      </div>
    )
  }

  const config = backgroundPresets[selectedBackground]

  return (
    <>
      {/* Background Preview */}
      <div className="fixed inset-0 z-40">
        <HeroBackground 
          type={config.type}
          interactive={config.interactive}
          intensity={config.intensity}
        />
        
        {/* Demo Controls */}
        <div className="absolute top-4 left-4 right-4 z-50">
          <div className="mx-auto max-w-4xl rounded-xl bg-white/90 backdrop-blur-sm p-6 shadow-xl dark:bg-gray-900/90">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Background Demo
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose your perfect homepage background
                </p>
              </div>
              <button
                onClick={() => setShowDemo(false)}
                className="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Current Selection Info */}
            <div className="mb-6 rounded-lg bg-rose-50 p-4 dark:bg-rose-900/20">
              <h3 className="font-semibold text-rose-900 dark:text-rose-300">
                {config.name}
              </h3>
              <p className="text-sm text-rose-700 dark:text-rose-400">
                {config.description}
              </p>
              <div className="mt-2 flex gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  config.performance === 'high' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : config.performance === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {config.performance.toUpperCase()} Performance
                </span>
                {config.type === 'particles' && (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    INTERACTIVE
                  </span>
                )}
                <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  {config.intensity.toUpperCase()} Intensity
                </span>
              </div>
            </div>

            {/* Background Options Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(backgroundPresets).map(([key, bgConfig]) => (
                <button
                  key={key}
                  onClick={() => setSelectedBackground(key)}
                  className={`p-4 rounded-lg border-2 text-left transition-all hover:scale-105 ${
                    selectedBackground === key
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{bgConfig.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {bgConfig.description}
                  </div>
                  <div className="flex gap-1">
                    <span className={`w-2 h-2 rounded-full ${
                      bgConfig.performance === 'high' ? 'bg-green-500' :
                      bgConfig.performance === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    {bgConfig.interactive && (
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Apply Button */}
            <div className="mt-6 flex justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  To use this background, update the return value in:
                </p>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                  /lib/background-config.ts → getCurrentBackground()
                </code>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Change: <span className="font-mono">backgroundPresets.{selectedBackground}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Content Overlay */}
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4 drop-shadow-lg">
              Throwin' <span className="text-rose-300">Exceptions</span>
            </h1>
            <p className="text-xl drop-shadow-md opacity-90">
              Testing background: <span className="font-semibold">{config.name}</span>
            </p>
            {config.interactive && (
              <p className="text-sm mt-2 opacity-75">
                🖱️ Move your mouse around to interact!
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}