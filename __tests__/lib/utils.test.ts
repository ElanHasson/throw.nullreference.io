import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-2 py-1', 'bg-blue-500', 'text-white')
    expect(result).toBe('px-2 py-1 bg-blue-500 text-white')
  })

  it('should handle conditional classes with clsx', () => {
    const isActive = true
    const isDisabled = false
    
    const result = cn(
      'base-class',
      isActive && 'active-class',
      isDisabled && 'disabled-class'
    )
    
    expect(result).toBe('base-class active-class')
  })

  it('should merge conflicting Tailwind classes with twMerge', () => {
    // Later classes should override earlier ones
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4')
  })

  it('should handle complex merging scenarios', () => {
    const result = cn(
      'px-2 py-1 bg-red-500',
      'px-4 bg-blue-500', // px-4 and bg-blue-500 should override
      'hover:bg-green-500'
    )
    expect(result).toBe('py-1 px-4 bg-blue-500 hover:bg-green-500')
  })

  it('should handle array inputs', () => {
    const result = cn(['px-2', 'py-1'], 'bg-blue-500')
    expect(result).toBe('px-2 py-1 bg-blue-500')
  })

  it('should handle object inputs', () => {
    const result = cn({
      'px-2': true,
      'py-1': true,
      'bg-blue-500': true,
      'text-red-500': false
    })
    expect(result).toBe('px-2 py-1 bg-blue-500')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn(null, undefined, false)).toBe('')
  })

  it('should handle mixed input types', () => {
    const result = cn(
      'base-class',
      ['array-class'],
      { 'object-class': true, 'false-class': false },
      true && 'conditional-class',
      null,
      undefined
    )
    expect(result).toBe('base-class array-class object-class conditional-class')
  })

  it('should preserve important modifiers', () => {
    const result = cn('!px-2 py-1', 'px-4')
    expect(result).toContain('!px-2') // Important should be preserved
    expect(result).toContain('py-1')
  })

  it('should handle responsive and state variants correctly', () => {
    const result = cn(
      'text-sm md:text-base lg:text-lg',
      'hover:text-blue-500 focus:text-red-500',
      'dark:text-white'
    )
    expect(result).toBe('text-sm md:text-base lg:text-lg hover:text-blue-500 focus:text-red-500 dark:text-white')
  })

  it('should merge same-type classes correctly', () => {
    const result = cn('text-red-500', 'text-blue-500') // Later should win
    expect(result).toBe('text-blue-500')
  })
})