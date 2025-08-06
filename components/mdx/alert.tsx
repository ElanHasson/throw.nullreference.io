import { ReactNode, ComponentType } from 'react'
import { InfoIcon, SuccessIcon, WarningIcon, ErrorIcon, TipIcon, NoteIcon } from '../icons'

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error' | 'tip' | 'note' | 'danger'
  icon?: ComponentType<{ className?: string }>
  children: ReactNode
}

const typeConfig = {
  info: {
    icon: InfoIcon,
    styles: 'bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200 border-blue-200 dark:border-blue-800',
    iconStyles: 'text-blue-500 dark:text-blue-400'
  },
  success: {
    icon: SuccessIcon,
    styles: 'bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-200 border-green-200 dark:border-green-800',
    iconStyles: 'text-green-500 dark:text-green-400'
  },
  warning: {
    icon: WarningIcon,
    styles: 'bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
    iconStyles: 'text-yellow-500 dark:text-yellow-400'
  },
  error: {
    icon: ErrorIcon,
    styles: 'bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-200 border-red-200 dark:border-red-800',
    iconStyles: 'text-red-500 dark:text-red-400'
  },
  danger: {
    icon: ErrorIcon,
    styles: 'bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-200 border-red-200 dark:border-red-800',
    iconStyles: 'text-red-500 dark:text-red-400'
  },
  tip: {
    icon: TipIcon,
    styles: 'bg-purple-50 text-purple-900 dark:bg-purple-900/20 dark:text-purple-200 border-purple-200 dark:border-purple-800',
    iconStyles: 'text-purple-500 dark:text-purple-400'
  },
  note: {
    icon: NoteIcon,
    styles: 'bg-gray-50 text-gray-900 dark:bg-gray-900/20 dark:text-gray-200 border-gray-200 dark:border-gray-800',
    iconStyles: 'text-gray-500 dark:text-gray-400'
  }
}

export function Alert({ type = 'info', icon, children }: AlertProps) {
  const config = typeConfig[type]
  const IconComponent = icon || config.icon

  return (
    <div className={`my-6 p-4 border rounded-lg ${config.styles}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <IconComponent className={`h-5 w-5 ${config.iconStyles}`} />
        </div>
        <div className="flex-1 prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  )
}