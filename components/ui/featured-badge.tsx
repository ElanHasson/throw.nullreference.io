interface FeaturedBadgeProps {
  size?: 'sm' | 'md'
  className?: string
}

export function FeaturedBadge({ size = 'md', className = '' }: FeaturedBadgeProps) {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1 text-xs'
  }

  return (
    <span className={`
      inline-flex items-center rounded-full font-semibold
      bg-gradient-to-r from-rose-500 to-pink-500 text-white
      ${sizeClasses[size]}
      ${className}
    `}>
      Featured
    </span>
  )
}