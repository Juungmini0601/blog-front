import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useInfinitePosts } from '@/hooks/usePost'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useNavigate } from 'react-router'

export default function PostListPage() {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfinitePosts()

  const navigate = useNavigate()
  const observer_ref = useRef<HTMLDivElement | null>(null)

  // 플랫 배열로 변환
  const posts = useMemo(() => data?.pages.flatMap(p => p.data) ?? [], [data])

  // 교차 관찰자 콜백
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const is_visible = entries.some(entry => entry.isIntersecting)
      if (is_visible && hasNextPage && !isFetchingNextPage) {
        fetchNextPage().catch(() => {})
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    if (!observer_ref.current) return
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.2
    })
    observer.observe(observer_ref.current)
    return () => observer.disconnect()
  }, [handleIntersect])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, idx) => (
          <Card
            key={idx}
            className="overflow-hidden">
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
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-muted-foreground">
        일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <Card
            key={post.postId}
            className="cursor-pointer overflow-hidden transition hover:shadow-md"
            onClick={() => navigate(`/post/${post.postId}`)}>
            {post.thumbnailUrl ? (
              <img
                src={post.thumbnailUrl}
                alt="thumbnail"
                className="aspect-video w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="aspect-video w-full bg-muted" />
            )}
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.profileImageUrl ?? undefined} />
                  <AvatarFallback>{post.nickname?.[0] ?? 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{post.nickname}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <Separator />
              <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
                {post.content}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>좋아요 {post.likeCount}</span>
                <span>댓글 {post.commentCount}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div
        ref={observer_ref}
        className="h-8"
      />
      {isFetchingNextPage && (
        <div className="mx-auto mt-4 max-w-xl">
          <Skeleton className="h-6 w-full" />
        </div>
      )}
    </div>
  )
}
