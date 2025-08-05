import { ReactNode } from 'react'

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  children: ReactNode
}

const typeStyles = {
  info: 'bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200 border-blue-200 dark:border-blue-800',
  success: 'bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-200 border-green-200 dark:border-green-800',
  warning: 'bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
  error: 'bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-200 border-red-200 dark:border-red-800',
}

export function Alert({ type = 'info', children }: AlertProps) {
  return (
    <div className={`my-6 p-4 border rounded-lg ${typeStyles[type]}`}>
      <div className="prose prose-sm dark:prose-invert max-w-none">{children}</div>
    </div>
  )
}