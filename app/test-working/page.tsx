'use client'

import Link from 'next/link'
import HikingTrailECS from '@/components/backgrounds/hiking-trail-ecs/index'

export default function TestWorkingPage() {
  return (
    <>
      {/* Hero Section with ECS Hiking Trail Background */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* ECS Hiking Trail Background */}
        <HikingTrailECS />
      </section>

      {/* About the ECS Implementation */}
      <section className="py-24 sm:py-28 lg:py-32 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 sm:p-12 lg:p-16 dark:from-gray-800 dark:to-gray-900 shadow-2xl">
              <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-16">
                <div>
                  <h2 className="mb-8 text-3xl font-bold sm:text-4xl">ECS Architecture 🎮</h2>
                  <p className="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                    This hiking trail scene is built using Entity Component System (ECS) architecture with Pixi.js for WebGL rendering, providing better performance and maintainability.
                  </p>
                  <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                    The scene includes dynamic day/night cycles, animated creatures, weather effects, and interactive elements - all managed through decoupled systems.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <span className="rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                      ECS
                    </span>
                    <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      Pixi.js
                    </span>
                    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      TypeScript
                    </span>
                    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      WebGL
                    </span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                    <h3 className="mb-4 text-xl font-semibold">Features</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex items-center">
                        <span className="mr-2 text-green-500">✓</span>
                        Dynamic day/night cycle
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-green-500">✓</span>
                        Animated creatures (frogs, hikers, owls)
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-green-500">✓</span>
                        Weather effects (clouds, fireflies)
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-green-500">✓</span>
                        Interactive time controls
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-green-500">✓</span>
                        Layered rendering system
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
