import { useParams } from 'react-router'
import { useGetUserSeries } from '@/hooks/useSeries.ts'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  useInfiniteSeriesPosts,
  useInfiniteUserPosts
} from '@/hooks/usePost.ts'

export default function MyBlogPage() {
  const { userId } = useParams()
  const numericUserId = Number(userId)
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null)

  const {
    data: seriesList,
    isLoading: isSeriesLoading,
    error: seriesError
  } = useGetUserSeries(numericUserId)

  // 사용자의 모든 포스트 (전체 보기)
  const {
    data: userPosts,
    fetchNextPage: fetchNextUserPosts,
    hasNextPage: hasNextUserPosts,
    isLoading: isUserPostsLoading,
    isFetchingNextPage: isFetchingNextUserPosts
  } = useInfiniteUserPosts(numericUserId)

  // 시리즈 선택 시 포스트 (선택된 시리즈)
  const {
    data: seriesPosts,
    fetchNextPage: fetchNextSeriesPosts,
    hasNextPage: hasNextSeriesPosts,
    isLoading: isSeriesPostsLoading,
    isFetchingNextPage: isFetchingNextSeriesPosts
  } = useInfiniteSeriesPosts(selectedSeriesId ?? 0)

  // 렌더링에 사용할 포스트 소스 결정
  const isSeriesSelected = selectedSeriesId !== null

  const flatPosts = useMemo(() => {
    const source = isSeriesSelected ? seriesPosts : userPosts
    const pages = source?.pages ?? []
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

  // 초기 로딩/에러 상태 (시리즈 목록)
  if (isSeriesLoading) return <div className="p-6">Loading...</div>
  if (seriesError) return <div className="p-6">에러가 발생 했습니다</div>

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString()
    } catch {
      return ''
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* 왼쪽 사이드바: 시리즈 목록 */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 p-4 sticky top-0 h-[calc(100vh-64px)] overflow-auto">
        <h2 className="text-lg font-semibold mb-3">시리즈</h2>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setSelectedSeriesId(null)}
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 ${
                selectedSeriesId === null
                  ? 'bg-gray-100 dark:bg-gray-900 font-medium'
                  : ''
              }`}
            >
              전체 글
            </button>
          </li>
          {(seriesList ?? []).map(series => (
            <li key={series.seriesId}>
              <button
                onClick={() => setSelectedSeriesId(series.seriesId)}
                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 ${
                  selectedSeriesId === series.seriesId
                    ? 'bg-gray-100 dark:bg-gray-900 font-medium'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{series.name}</span>
                  <span className="text-xs text-gray-500">{series.postCount}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* 메인 콘텐츠: 포스트 1열 목록 + 무한 스크롤 */}
      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* 초기 포스트 로딩 */}
          {loadingInitial && flatPosts.length === 0 && (
            <div className="text-center text-gray-500 py-10">불러오는 중...</div>
          )}

          {/* 비어있을 때 */}
          {!loadingInitial && flatPosts.length === 0 && (
            <div className="text-center text-gray-500 py-10">게시글이 없습니다.</div>
          )}

          {/* 포스트 카드 목록 */}
          {flatPosts.map(post => (
            <article
              key={post.postId}
              className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-black"
            >
              {post.thumbnailUrl && (
                <img
                  src={post.thumbnailUrl}
                  alt="thumbnail"
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {post.profileImageUrl && (
                    <img
                      src={post.profileImageUrl}
                      alt={post.nickname}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <span>{post.nickname}</span>
                  <span>•</span>
                  <time>{formatDate(post.createdAt)}</time>
                </div>
                <p className="mt-2 text-sm text-gray-800 dark:text-gray-200 line-clamp-3">
                  {post.content}
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  <span>좋아요 {post.likeCount}</span>
                  <span className="mx-2">·</span>
                  <span>댓글 {post.commentCount}</span>
                </div>
              </div>
            </article>
          ))}

          {/* 로딩 더보기 표시 */}
          {loadingMore && (
            <div className="text-center text-gray-500 py-6">더 불러오는 중...</div>
          )}

          {/* 무한 스크롤 센티넬 */}
          <div ref={sentinelRef} />

          {/* 다음 페이지가 없을 때 끝 표시 */}
          {!hasNext && flatPosts.length > 0 && (
            <div className="text-center text-gray-400 py-6">마지막 글입니다.</div>
          )}
        </div>
      </main>
    </div>
  )
}
