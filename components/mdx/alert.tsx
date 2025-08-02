import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'
import { ReactNode } from 'react'

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  icon?: string
  children: ReactNode
}

const iconMap = {
  'info-circle-fill': Info,
  'info-circle': Info,
  'check-circle-fill': CheckCircle,
  'code-square': AlertCircle,
  'x-circle': XCircle,
}

const typeStyles = {
  info: 'bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200',
  success: 'bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-200',
  warning: 'bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200',
  error: 'bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-200',
}

export function Alert({ type = 'info', icon, children }: AlertProps) {
  const IconComponent = icon ? iconMap[icon as keyof typeof iconMap] || Info : Info
  
  return (
    <div className={`alert alert-${type} ${typeStyles[type]}`}>
      <IconComponent className="h-5 w-5 flex-shrink-0" />
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {children}
      </div>
    </div>
  )
}