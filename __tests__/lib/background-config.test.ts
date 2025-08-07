import { backgroundPresets, getCurrentBackground } from '@/lib/background-config'

describe('Background Configuration', () => {
  describe('backgroundPresets', () => {
    it('contains all expected background presets', () => {
      const expectedPresets = [
        'minimal',
        'orbs',
        'particles',
        'neural',
        'waves',
        'geometric',
        'cyber',
        'fractal',
        'codeRain',
        'matrix'
      ]
      
      expectedPresets.forEach(preset => {
        expect(backgroundPresets).toHaveProperty(preset)
      })
    })

    describe('preset structure', () => {
      Object.entries(backgroundPresets).forEach(([name, preset]) => {
        describe(`${name} preset`, () => {
          it('has required properties', () => {
            expect(preset).toHaveProperty('type')
            expect(preset).toHaveProperty('intensity')
            expect(preset).toHaveProperty('name')
            expect(preset).toHaveProperty('description')
            expect(preset).toHaveProperty('performance')
          })

          it('has valid intensity value', () => {
            expect(['low', 'medium', 'high']).toContain(preset.intensity)
          })

          it('has valid performance value', () => {
            expect(['low', 'medium', 'high']).toContain(preset.performance)
          })

          it('has non-empty name and description', () => {
            expect(preset.name).toBeTruthy()
            expect(preset.description).toBeTruthy()
          })

          it('has valid background type', () => {
            const validTypes = [
              'animated-gradient',
              'particles',
              'geometric-grid',
              'floating-orbs',
              'matrix-rain',
              'neural-network',
              'wave-motion',
              'code-rain',
              'fractal-tree',
              'cyber-grid'
            ]
            expect(validTypes).toContain(preset.type)
          })
        })
      })
    })

    describe('performance categorization', () => {
      it('CSS-only backgrounds have high performance', () => {
        expect(backgroundPresets.minimal.performance).toBe('high')
        expect(backgroundPresets.orbs.performance).toBe('high')
      })

      it('interactive canvas backgrounds have medium performance', () => {
        expect(backgroundPresets.particles.performance).toBe('medium')
        expect(backgroundPresets.neural.performance).toBe('medium')
      })

      it('complex animations have low performance', () => {
        expect(backgroundPresets.codeRain.performance).toBe('low')
        expect(backgroundPresets.matrix.performance).toBe('low')
      })
    })

    describe('type mapping', () => {
      it('maps correct types to presets', () => {
        expect(backgroundPresets.minimal.type).toBe('animated-gradient')
        expect(backgroundPresets.orbs.type).toBe('floating-orbs')
        expect(backgroundPresets.particles.type).toBe('particles')
        expect(backgroundPresets.neural.type).toBe('neural-network')
        expect(backgroundPresets.waves.type).toBe('wave-motion')
        expect(backgroundPresets.geometric.type).toBe('geometric-grid')
        expect(backgroundPresets.cyber.type).toBe('cyber-grid')
        expect(backgroundPresets.fractal.type).toBe('fractal-tree')
        expect(backgroundPresets.codeRain.type).toBe('code-rain')
        expect(backgroundPresets.matrix.type).toBe('matrix-rain')
      })
    })
  })

  describe('getCurrentBackground', () => {
    it('returns a valid BackgroundPreset', () => {
      const background = getCurrentBackground()
      
      expect(background).toBeDefined()
      expect(background).toHaveProperty('type')
      expect(background).toHaveProperty('intensity')
      expect(background).toHaveProperty('name')
      expect(background).toHaveProperty('description')
      expect(background).toHaveProperty('performance')
    })

    it('returns one of the defined presets', () => {
      const background = getCurrentBackground()
      const presetValues = Object.values(backgroundPresets)
      
      expect(presetValues).toContainEqual(background)
    })

    it('returns a preset with valid values', () => {
      const background = getCurrentBackground()
      
      expect(['low', 'medium', 'high']).toContain(background.intensity)
      expect(['low', 'medium', 'high']).toContain(background.performance)
      expect(background.name).toBeTruthy()
      expect(background.description).toBeTruthy()
    })
  })
})