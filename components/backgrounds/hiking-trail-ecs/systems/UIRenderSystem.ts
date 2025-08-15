import * as PIXI from 'pixi.js'
import { createSystem, queryComponents, Write, Read } from 'sim-ecs'
import { SimulationControl, TimeOfDay } from '../components'

export const UIRenderSystem = createSystem({})
  .withRunFunction(() => {
    // TODO: Convert UI rendering system to sim-ecs
  })
  .build()

export class UIRenderSystemLegacy {
  private timeText: PIXI.Text
  private dateText: PIXI.Text
  private speedText: PIXI.Text
  private switchContainer: PIXI.Container
  private switchIndicator: PIXI.Graphics
  private switchBackground: PIXI.Graphics
  private isHovering = false
  private simulateTime = true
  private onDocClick: (e: MouseEvent) => void
  private onKeyDown: (e: KeyboardEvent) => void
  
  constructor(private app: PIXI.Application) {
    console.log('UIRenderSystem constructor called')
    
    // Create time display texts with proper Pixi.js syntax
    this.timeText = new PIXI.Text('Time: Loading...', {
      fontFamily: 'monospace',
      fontSize: 16,
      fill: 0x000000
    })
    
    this.dateText = new PIXI.Text('Date: Loading...', {
      fontFamily: 'monospace',
      fontSize: 14,
      fill: 0x000000
    })
    
    this.speedText = new PIXI.Text('Speed: Loading...', {
      fontFamily: 'monospace',
      fontSize: 14,
      fill: 0x000000
    })
    
    // Create switch container with better styling
    this.switchContainer = new PIXI.Container()
    // @ts-expect-error Pixi v8 event system
    this.switchContainer.eventMode = 'static'
    this.switchContainer.cursor = 'pointer'
    this.switchContainer.hitArea = new PIXI.Rectangle(0, 0, 60, 35)
    
    // Create switch background with better visibility
    this.switchBackground = new PIXI.Graphics()
    this.switchBackground.rect(0, 0, 60, 35)
    this.switchBackground.fill({ color: 0x444444, alpha: 0.8 })
    this.switchBackground.stroke({ width: 3, color: 0xffffff, alpha: 0.9 })
    // @ts-expect-error Pixi v8 event system
    this.switchBackground.eventMode = 'none'
    this.switchContainer.addChild(this.switchBackground)
    
    // Create switch indicator
    this.switchIndicator = new PIXI.Graphics()
    this.updateSwitchIndicator()
    this.switchContainer.addChild(this.switchIndicator)
    
    // Add switch labels
    const onLabel = new PIXI.Text('ON', {
      fontFamily: 'monospace',
      fontSize: 10,
      fill: 0xffffff
    })
    onLabel.x = 5
    onLabel.y = 8
    
    const offLabel = new PIXI.Text('OFF', {
      fontFamily: 'monospace',
      fontSize: 10,
      fill: 0xffffff
    })
    offLabel.x = 35
    offLabel.y = 8
    
    this.switchContainer.addChild(onLabel)
    this.switchContainer.addChild(offLabel)
    
    // Initial position (will be updated each frame as well)
    this.timeText.x = 20
    this.timeText.y = 20
    this.dateText.x = 20
    this.dateText.y = 45
    this.speedText.x = 20
    this.speedText.y = 70
    this.switchContainer.x = window.innerWidth - 80
    this.switchContainer.y = window.innerHeight - 60
    
    // Add to stage
    this.app.stage.addChild(this.timeText)
    this.app.stage.addChild(this.dateText)
    this.app.stage.addChild(this.speedText)
    this.app.stage.addChild(this.switchContainer)
    
    console.log('UI elements added to stage')
    
    // Add event listeners (Pixi)
    this.switchContainer.on('pointerdown', () => {
      this.toggleSim()
    })
    this.switchContainer.on('pointerover', () => { this.isHovering = true; this.updateSwitchIndicator() })
    this.switchContainer.on('pointerout', () => { this.isHovering = false; this.updateSwitchIndicator() })

    // Also support DOM toggle events so clicks pass through even if canvas is behind DOM
    this.onDocClick = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      const rockerX = window.innerWidth - 80
      const rockerY = window.innerHeight - 60
      if (x >= rockerX && x <= rockerX + 60 && y >= rockerY && y <= rockerY + 35) {
        this.toggleSim()
      }
    }
    window.addEventListener('click', this.onDocClick)

    // Keyboard shortcut: press "t" to toggle
    this.onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 't') {
        this.toggleSim()
      }
    }
    window.addEventListener('keydown', this.onKeyDown)

    // Also support custom event for tests
    window.addEventListener('toggle-sim', () => this.toggleSim())
  }

  private toggleSim(): void {
    this.simulateTime = !this.simulateTime
    this.updateSwitchIndicator()
    console.log('Simulation switched to:', this.simulateTime ? 'ON' : 'OFF')
  }
  
  private updateSwitchIndicator(): void {
    this.switchIndicator.clear()
    const x = this.simulateTime ? 35 : 5
    this.switchIndicator.circle(x, 17.5, 12)
    this.switchIndicator.fill({ 
      color: this.isHovering ? 0xffff00 : (this.simulateTime ? 0x00ff00 : 0xff0000),
      alpha: 0.9
    })
    this.switchIndicator.stroke({ 
      width: 2, 
      color: 0xffffff,
      alpha: 0.8
    })
  }
  
  private updateTextColors(isDaytime: boolean): void {
    const textColor = isDaytime ? 0x000000 : 0xffffff
    this.timeText.style.fill = textColor
    this.dateText.style.fill = textColor
    this.speedText.style.fill = textColor
  }
  
  getSimulateTime(): boolean {
    return this.simulateTime
  }
  
  update(world: World): void {
    // Get simulation control
    const controlEntities = world.getEntitiesWithComponents(SimulationControl)
    if (controlEntities.length === 0) return
    
    const control = controlEntities[0].getComponent(SimulationControl)!
    
    // Get time of day for color adjustment
    const timeEntities = world.getEntitiesWithComponents(TimeOfDay)
    const currentHour = timeEntities.length > 0 ? timeEntities[0].getComponent(TimeOfDay)!.currentTime : 12
    const isDaytime = currentHour >= 6 && currentHour < 18
    
    // Update text colors based on time of day
    this.updateTextColors(isDaytime)
    
    // Update time display
    const currentDate = control.simulateTime ? control.simulatedDate : control.realDate
    const hours = Math.floor(currentDate.getHours())
    const minutes = Math.floor(currentDate.getMinutes())
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    
    this.timeText.text = `Time: ${timeString}`
    this.dateText.text = `Date: ${currentDate.toLocaleDateString()}`
    this.speedText.text = `Speed: ${control.timeScale}x`

    // Anchor texts to top-right
    const rightPad = 20
    const topPad = 20
    const maxWidth = Math.max(this.timeText.width, this.dateText.width, this.speedText.width)
    this.timeText.x = window.innerWidth - maxWidth - rightPad
    this.timeText.y = topPad
    this.dateText.x = window.innerWidth - maxWidth - rightPad
    this.dateText.y = topPad + this.timeText.height + 4
    this.speedText.x = window.innerWidth - maxWidth - rightPad
    this.speedText.y = this.dateText.y + this.dateText.height + 4
    
    // Keep rocker at bottom-right
    this.switchContainer.x = window.innerWidth - 80
    this.switchContainer.y = window.innerHeight - 60
    
    // Update simulation control - binding to rocker state
    control.simulateTime = this.simulateTime
  }
}
