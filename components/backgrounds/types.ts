export interface BackgroundProps {
  intensity?: 'low' | 'medium' | 'high'
}

export interface CanvasBackgroundProps extends BackgroundProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
}