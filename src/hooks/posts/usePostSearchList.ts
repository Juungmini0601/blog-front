import { useInfiniteSearchPosts } from '@/hooks/usePost.ts'
import { useCallback, useEffect, useMemo, useRef } from 'react'

export function usePostSearchList(keyword: string) {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteSearchPosts(keyword)

  const observerRef = useRef<HTMLDivElement | null>(null)

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
    if (!observerRef.current) return
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.2
    })
    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [handleIntersect])

  return {
    posts,
    isLoading,
    isError,
    isFetchingNextPage,
    observerRef
  }
}
