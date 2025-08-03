import Image from 'next/image'

interface FigureProps {
  src: string
  alt: string
  width?: number
  height?: number
  caption?: string
  className?: string
}

export function Figure({ src, alt, width, height, caption, className }: FigureProps) {
  // Handle Hugo-style width in src (e.g., "image.png?width=300px")
  const cleanSrc = src.split('?')[0]
  const params = new URLSearchParams(src.split('?')[1] || '')
  const widthParam = params.get('width')

  const finalWidth = width || (widthParam ? parseInt(widthParam) : 800)
  const finalHeight = height || finalWidth * 0.75 // Default aspect ratio

  return (
    <figure className={`my-8 ${className || ''}`}>
      <div className="flex justify-center">
        <Image
          src={cleanSrc}
          alt={alt}
          width={finalWidth}
          height={finalHeight}
          className="rounded-lg"
          unoptimized
        />
      </div>
      {caption && (
        <figcaption className="text-muted-foreground mt-2 text-center text-sm">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
