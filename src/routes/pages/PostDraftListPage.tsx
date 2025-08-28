import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router'
import {
  useDeletePostDraftMutation,
  useInfinitePostDraftsQuery
} from '@/hooks/usePostdraft'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import Confirm from '@/components/Confirm'

export default function PostDraftListPage() {
  const navigate = useNavigate()
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfinitePostDraftsQuery(true)

  const { mutateAsync: deleteDraft, isPending: isDeleting } =
    useDeletePostDraftMutation()

  const drafts = useMemo(() => data?.pages.flatMap(p => p.data) ?? [], [data])

  const observerRef = useRef<HTMLDivElement | null>(null)

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const isVisible = entries.some(entry => entry.isIntersecting)
      if (isVisible && hasNextPage && !isFetchingNextPage) {
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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card
              key={idx}
              className="overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full" />
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
        임시글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
      </div>
    )
  }

  return (
    <div className="mx-auto my-8 max-w-5xl px-4 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-xl font-semibold">임시 저장 목록</h1>
      <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {drafts.map(draft => (
          <Card
            key={draft.postDraftId}
            className="cursor-pointer overflow-hidden transition hover:shadow-md"
            onMouseDown={e => {
              if (e.button !== 0) return
              const target = e.target as HTMLElement
              if (
                target &&
                target.closest(
                  'button, a, input, textarea, select, [role="button"]'
                )
              ) {
                return
              }
              navigate('/post/create', {
                state: { draft }
              })
            }}>
            {draft.thumbnailUrl ? (
              <img
                src={draft.thumbnailUrl}
                alt="thumbnail"
                className="aspect-video w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="aspect-video w-full bg-muted" />
            )}
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={draft.profileImageUrl ?? undefined} />
                    <AvatarFallback>
                      {draft.nickname?.[0] ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm text-muted-foreground">
                    {draft.nickname}
                  </span>
                </div>
                <Badge variant={draft.isPublic ? 'default' : 'secondary'}>
                  {draft.isPublic ? '공개' : '비공개'}
                </Badge>
              </div>

              <h3 className="text-base font-semibold leading-snug line-clamp-2">
                {draft.title || '제목 없음'}
              </h3>
              <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
                {draft.content}
              </p>

              <div className="flex items-center justify-between pt-2 gap-3 text-xs text-muted-foreground">
                <span>{new Date(draft.updatedAt).toLocaleString()}</span>
                <Confirm
                  title="임시글 삭제"
                  description="해당 임시글을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
                  confirmText="삭제"
                  cancelText="취소"
                  isLoading={isDeleting}
                  onConfirm={async () => {
                    await deleteDraft(draft.postDraftId)
                  }}
                  trigger={
                    <Button
                      variant="destructive"
                      size="sm"
                      className="cursor-pointer"
                      onClick={e => e.stopPropagation()}
                      onMouseDown={e => e.stopPropagation()}
                      onPointerDown={e => e.stopPropagation()}>
                      삭제
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div
        ref={observerRef}
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
