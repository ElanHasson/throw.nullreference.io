interface SVGProps {
  src: string
  title?: string
  viewBox?: string
  preserveAspectRatio?: string
  className?: string
}

export function SVG({ src, title, className }: SVGProps) {
  return (
    <div className={`container my-8 text-center ${className || ''}`}>
      <object
        data={src}
        type="image/svg+xml"
        className="h-auto w-full"
        aria-label={title || 'Diagram'}
      >
        <img src={src} alt={title || 'Diagram'} />
      </object>
    </div>
  )
}
