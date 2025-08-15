import { createSystem, queryComponents, Write, Read } from 'sim-ecs'
import { TimeOfDay, SimulationControl } from '../components'

export const TimeSystem = createSystem({
  controlQuery: queryComponents({
    control: Write(SimulationControl)
  }),
  timeQuery: queryComponents({
    timeOfDay: Write(TimeOfDay)
  })
})
  .withRunFunction(({ controlQuery, timeQuery }) => {
    // Get simulation control
    const controlResult = controlQuery.getFirst()
    if (!controlResult) return
    
    const { control } = controlResult
    
    // Update time based on simulation mode
    let currentDate: Date
    if (control.simulateTime) {
      // Update simulated date
      control.simulatedDate = new Date(control.simulatedDate.getTime() + 16.67 * control.timeScale) // Approximate 60fps deltaTime
      currentDate = control.simulatedDate
    } else {
      currentDate = new Date()
      control.realDate = currentDate
    }
    
    const hours = currentDate.getHours() + currentDate.getMinutes() / 60
    
    // Update all TimeOfDay entities
    timeQuery.execute(({ timeOfDay }) => {
      timeOfDay.currentTime = hours
    })
  })
  .build()
