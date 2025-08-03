interface YouTubeProps {
  id: string
  title?: string
}

export function YouTube({ id, title }: YouTubeProps) {
  return (
    <div className="my-8">
      <div className="relative overflow-hidden rounded-lg" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 h-full w-full"
          src={`https://www.youtube.com/embed/${id}`}
          title={title || 'YouTube video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
