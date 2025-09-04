import { Link, useNavigate, useParams } from 'react-router'
import { useUserPosts } from '@/hooks/form/useUserPosts'
import { formatRelativeDate } from '@/lib/date.ts'

// 이쪽 컴포넌트는 재사용 가능성이 별로 없어서 걍 냅두기.
export default function MyBlogPage() {
  const { userId } = useParams()
  const numericUserId = Number(userId)
  const navigate = useNavigate()
  const {
    // selection
    selectedSeriesId,
    setSelectedSeriesId,

    // series list
    seriesList,
    isSeriesLoading,
    seriesError,

    // posts data
    flatPosts,
    hasNext,
    loadingInitial,
    loadingMore,

    // sentinel
    sentinelRef
  } = useUserPosts({ userId: numericUserId })

  if (isSeriesLoading) return <div className="p-6">Loading...</div>
  if (seriesError) return <div className="p-6">에러가 발생 했습니다</div>

  return (
    <div className="min-h-[calc(100vh-64px)] w-full">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 시리즈 목록 */}
          <aside className="w-full md:w-64 md:border-r border-gray-200 dark:border-gray-800 md:pr-4 md:sticky md:top-0 md:h-[calc(100vh-64px)]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">시리즈</h2>
              <div className="flex items-center gap-2">
                <Link
                  to="/series/create"
                  className="text-xs px-2 py-1 cursor-pointer rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900">
                  생성
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedSeriesId) {
                      navigate(`/series/${selectedSeriesId}/edit`)
                    }
                  }}
                  disabled={!selectedSeriesId}
                  className="text-xs px-2 py-1 cursor-pointer rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-900">
                  수정
                </button>
              </div>
            </div>
            <ul className="space-y-1">
              <li className="cursor-pointer">
                <button
                  onClick={() => setSelectedSeriesId(null)}
                  className={`w-full text-left px-3 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 ${
                    selectedSeriesId === null
                      ? 'bg-gray-100 dark:bg-gray-900 font-medium'
                      : ''
                  }`}>
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
                    }`}>
                    <div className="flex items-center justify-between cursor-pointer">
                      <span>{series.name}</span>
                      <span className="text-xs text-gray-500">
                        {series.postCount}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* 콘텐츠 */}
          <main className="flex-1">
            <div className="max-w-2xl mx-auto space-y-4">
              {loadingInitial && flatPosts.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                  불러오는 중...
                </div>
              )}

              {/* 비어있을 때 */}
              {!loadingInitial && flatPosts.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                  게시글이 없습니다.
                </div>
              )}

              {/* 포스트 카드 목록 */}
              {flatPosts.map(post => (
                <article
                  key={post.postId}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/post/${post.postId}`)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ')
                      navigate(`/post/${post.postId}`)
                  }}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-black cursor-pointer hover:shadow-md transition-shadow">
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
                      <time>{formatRelativeDate(post.createdAt)}</time>
                    </div>
                    <h2 className="font-bold pt-2">{post.title}</h2>
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

              {/* 로딩 */}
              {loadingMore && (
                <div className="text-center text-gray-500 py-6">
                  더 불러오는 중...
                </div>
              )}

              {/* 무한 스크롤  */}
              <div ref={sentinelRef} />

              {/* 다음 페이지가 없을 때 끝 표시 */}
              {!hasNext && flatPosts.length > 0 && (
                <div className="text-center text-gray-400 py-6">
                  마지막 글입니다.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
