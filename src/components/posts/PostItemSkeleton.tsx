import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Card, CardContent } from '@/components/ui/card.tsx'

export default function PostItemSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-40 w-full" />
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>
  )
}
