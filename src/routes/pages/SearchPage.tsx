import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useNavigate, useSearchParams } from 'react-router'
import { useInfiniteSearchPosts } from '@/hooks/usePost'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const keyword = (searchParams.get('keyword') ?? '').trim()

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteSearchPosts(keyword)

  const navigate = useNavigate()
  const observer_ref = useRef<HTMLDivElement | null>(null)

  const posts = useMemo(() => data?.pages.flatMap(p => p.data) ?? [], [data])

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

  if (!keyword) {
    return (
      <div className="flex h-[40vh] items-center justify-center text-sm text-muted-foreground">
        검색어를 입력해주세요.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {Array.from({ length: 9 }).map((_, idx) => (
            <Card key={idx} className="overflow-hidden">
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
    <div className="mx-auto my-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-4 text-sm text-muted-foreground">'{keyword}' 검색 결과</div>
      <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {posts.map(post => (
          <Card
            key={post.postId}
            className="cursor-pointer py-0 overflow-hidden transition hover:shadow-md"
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
              <h3 className="text-base md:text-lg font-semibold leading-snug">
                {post.title}
              </h3>
              <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
                {post.content}
              </p>
              <div className="flex items-center justify-between pt-2 gap-3 text-xs text-muted-foreground">
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={post.profileImageUrl ?? undefined} />
                    <AvatarFallback>{post.nickname?.[0] ?? 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{post.nickname}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>댓글 {post.commentCount}</span>
                  <span>좋아요 {post.likeCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div ref={observer_ref} className="h-8" />
      {isFetchingNextPage && (
        <div className="mx-auto mt-4 max-w-xl">
          <Skeleton className="h-6 w-full" />
        </div>
      )}
    </div>
  )
}
