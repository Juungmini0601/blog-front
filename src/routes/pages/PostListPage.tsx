import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useInfinitePosts } from '@/hooks/usePost'
import { Skeleton } from '@/components/ui/skeleton'
import PostItem from '@/components/posts/PostItem.tsx'
import PostItemSkeleton from '@/components/posts/PostItemSkeleton.tsx'

export default function PostListPage() {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfinitePosts()

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {Array.from({ length: 9 }).map((_, idx) => (
            <PostItemSkeleton key={idx} />
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
      <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {posts.map(post => (
          <PostItem
            key={post.postId}
            {...post}
          />
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
