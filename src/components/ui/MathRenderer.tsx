import katex from 'katex'
import 'katex/dist/katex.min.css'
import { cn } from '@/lib/utils'

interface MathRendererProps {
  math: string
  displayMode?: boolean
  className?: string
}

export default function MathRenderer({ math, displayMode = false, className }: MathRendererProps) {
  if (!math) return null

  let html: string
  try {
    html = katex.renderToString(math, {
      throwOnError: false,
      displayMode,
    })
  } catch {
    html = math
  }

  return (
    <span
      className={cn(displayMode ? 'block w-full text-center' : 'inline-block', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
