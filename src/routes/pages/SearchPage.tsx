import { Skeleton } from '@/components/ui/skeleton'
import PostItem from '@/components/posts/PostItem.tsx'
import PostItemSkeleton from '@/components/posts/PostItemSkeleton.tsx'
import { useSearchParams } from 'react-router'
import { usePostSearchList } from '@/hooks/posts/usePostSearchList.ts'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const keyword = (searchParams.get('keyword') ?? '').trim()

  const { posts, isLoading, isError, isFetchingNextPage, observerRef } =
    usePostSearchList(keyword)

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
      <div className="mb-4 text-sm text-muted-foreground">
        '{keyword}' 검색 결과
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {posts.map(post => (
          <PostItem
            key={post.postId}
            {...post}
          />
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
