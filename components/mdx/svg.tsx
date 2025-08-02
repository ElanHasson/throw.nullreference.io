interface SVGProps {
  src: string
  title?: string
  viewBox?: string
  preserveAspectRatio?: string
  className?: string
}

export function SVG({ src, title, className }: SVGProps) {
  return (
    <div className={`container text-center my-8 ${className || ''}`}>
      <object 
        data={src} 
        type="image/svg+xml" 
        className="w-full h-auto"
        aria-label={title || 'Diagram'}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={title || 'Diagram'} />
      </object>
    </div>
  )
}