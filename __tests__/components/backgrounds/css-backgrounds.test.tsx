import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AnimatedGradient } from '@/components/backgrounds/animated-gradient'
import { FloatingOrbs } from '@/components/backgrounds/floating-orbs'

describe('CSS-Only Backgrounds', () => {
  describe('AnimatedGradient', () => {
    it('renders with default intensity', () => {
      const { container } = render(<AnimatedGradient />)
      const element = container.firstChild as HTMLElement
      expect(element).toBeInTheDocument()
      expect(element).toHaveClass('absolute', 'inset-0', 'animate-gradient')
    })

    it('renders with low intensity', () => {
      const { container } = render(<AnimatedGradient intensity="low" />)
      const element = container.firstChild as HTMLElement
      expect(element).toHaveClass('animate-gradient-slow')
    })

    it('renders with high intensity', () => {
      const { container } = render(<AnimatedGradient intensity="high" />)
      const element = container.firstChild as HTMLElement
      expect(element).toHaveClass('animate-gradient-fast')
    })

    it('applies correct gradient classes', () => {
      const { container } = render(<AnimatedGradient />)
      const element = container.firstChild as HTMLElement
      expect(element).toHaveClass('bg-gradient-to-br', 'from-rose-100', 'via-purple-50', 'to-indigo-100')
    })
  })

  describe('FloatingOrbs', () => {
    it('renders with default intensity', () => {
      const { container } = render(<FloatingOrbs />)
      const element = container.firstChild as HTMLElement
      expect(element).toBeInTheDocument()
      expect(element).toHaveClass('absolute', 'inset-0', 'overflow-hidden')
    })

    it('renders correct number of orbs for low intensity', () => {
      const { container } = render(<FloatingOrbs intensity="low" />)
      const orbs = container.querySelectorAll('.rounded-full')
      expect(orbs).toHaveLength(3)
    })

    it('renders correct number of orbs for medium intensity', () => {
      const { container } = render(<FloatingOrbs intensity="medium" />)
      const orbs = container.querySelectorAll('.rounded-full')
      expect(orbs).toHaveLength(5)
    })

    it('renders correct number of orbs for high intensity', () => {
      const { container } = render(<FloatingOrbs intensity="high" />)
      const orbs = container.querySelectorAll('.rounded-full')
      expect(orbs).toHaveLength(8)
    })

    it('applies blur and opacity to orbs', () => {
      const { container } = render(<FloatingOrbs />)
      const orb = container.querySelector('.rounded-full') as HTMLElement
      expect(orb).toHaveClass('blur-3xl', 'opacity-20', 'dark:opacity-10')
    })

    it('sets random styles for orbs', () => {
      const { container } = render(<FloatingOrbs />)
      const orbs = container.querySelectorAll('.rounded-full') as NodeListOf<HTMLElement>
      orbs.forEach(orb => {
        expect(orb.style.width).toBeTruthy()
        expect(orb.style.height).toBeTruthy()
        expect(orb.style.left).toBeTruthy()
        expect(orb.style.top).toBeTruthy()
        expect(orb.style.background).toBeTruthy()
        expect(orb.style.animationDelay).toBeTruthy()
        expect(orb.style.animationDuration).toBeTruthy()
      })
    })
  })
})