import { CardContent } from '../ui/card'
import { formatRelativeDate } from '@/lib/date.ts'

interface PostItemBodyProps {
  title?: string | null
  content: string
  createdAt: string
}

export default function PostItemBody({
  title,
  content,
  createdAt
}: PostItemBodyProps) {
  return (
    <CardContent className="space-y-3 px-4 h-full">
      <h3 className="line-clamp-1 text-base md:text-lg font-semibold leading-snug">
        {title}
      </h3>

      <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
        {content}
      </p>

      <div className="flex items-center justify-between pt-2 gap-3 text-xs text-muted-foreground">
        <span>{formatRelativeDate(createdAt)}</span>
      </div>
    </CardContent>
  )
}
