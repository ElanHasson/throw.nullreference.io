interface PostThumbnailProps {
  src: string
  alt: string
}

export default function PostThumbnail({ src, alt }: PostThumbnailProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
      <img
        src={src}
        alt={alt}
        className="h-auto w-full object-cover object-center transition-transform duration-300 hover:scale-105"
        loading="eager"
        style={{ maxHeight: '500px' }}
      />
    </div>
  )
}
