interface RawHTMLProps {
  children: string
}

export function RawHTML({ children }: RawHTMLProps) {
  return (
    <div 
      className="prose prose-lg dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: children }} 
    />
  )
}