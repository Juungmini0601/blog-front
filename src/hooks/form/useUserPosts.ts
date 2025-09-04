import { useEffect, useMemo, useRef, useState } from 'react'
import { useGetUserSeries } from '@/hooks/useSeries'
import { useInfiniteSeriesPosts, useInfiniteUserPosts } from '@/hooks/usePost'

export interface UseUserPostsParams {
  userId: number
}

export function useUserPosts({ userId }: UseUserPostsParams) {
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null)

  // 시리즈 목록
  const {
    data: seriesList,
    isLoading: isSeriesLoading,
    error: seriesError
  } = useGetUserSeries(userId)

  // 사용자 글 무한스크롤
  const {
    data: userPosts,
    fetchNextPage: fetchNextUserPosts,
    hasNextPage: hasNextUserPosts,
    isLoading: isUserPostsLoading,
    isFetchingNextPage: isFetchingNextUserPosts
  } = useInfiniteUserPosts(userId)

  // 시리즈 글 무한스크롤
  const {
    data: seriesPosts,
    fetchNextPage: fetchNextSeriesPosts,
    hasNextPage: hasNextSeriesPosts,
    isLoading: isSeriesPostsLoading,
    isFetchingNextPage: isFetchingNextSeriesPosts
  } = useInfiniteSeriesPosts(selectedSeriesId ?? 0)

  const isSeriesSelected = selectedSeriesId !== null

  // 렌더링에 사용할 포스트 평탄화
  const flatPosts = useMemo(() => {
    const source = isSeriesSelected ? seriesPosts : userPosts
    const pages = (source?.pages ?? []) as Array<{
      data: import('@/type/post').PostItem[]
    }>
    return pages.flatMap(page => page.data)
  }, [isSeriesSelected, seriesPosts, userPosts])

  const hasNext = isSeriesSelected ? !!hasNextSeriesPosts : !!hasNextUserPosts
  const fetchNext = isSeriesSelected ? fetchNextSeriesPosts : fetchNextUserPosts
  const loadingInitial = isSeriesSelected
    ? isSeriesPostsLoading
    : isUserPostsLoading
  const loadingMore = isSeriesSelected
    ? isFetchingNextSeriesPosts
    : isFetchingNextUserPosts

  // 무한 스크롤 옵저버
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!sentinelRef.current) return
    const el = sentinelRef.current
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries
        if (entry.isIntersecting && hasNext && !loadingMore) {
          fetchNext()
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchNext, hasNext, loadingMore, isSeriesSelected])

  return {
    // selection
    selectedSeriesId,
    setSelectedSeriesId,
    isSeriesSelected,

    // series list
    seriesList,
    isSeriesLoading,
    seriesError,

    // posts
    flatPosts,
    hasNext,
    fetchNext,
    loadingInitial,
    loadingMore,

    // sentinel
    sentinelRef
  }
}
