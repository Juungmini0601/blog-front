import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import {
  deleteLike,
  deletePost,
  getPostDetail,
  getPosts,
  getSeriesPosts,
  getUserPosts,
  postCreatePost,
  postLike,
  putUpdatePost
} from '@/api/post'
import type {
  CreatePostRequest,
  PostItem,
  UpdatePostRequest
} from '@/type/post'

function useCreatePost() {
  return useMutation({
    mutationFn: (request: CreatePostRequest) => postCreatePost(request)
  })
}

function useDeletePost() {
  return useMutation({
    mutationFn: (postId: number) => deletePost(postId)
  })
}

function useUpdatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      postId,
      request
    }: {
      postId: number
      request: UpdatePostRequest
    }) => putUpdatePost(postId, request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['post', 'detail', variables.postId]
      })
      queryClient.invalidateQueries({
        queryKey: ['posts']
      })
    }
  })
}

function useGetPostDetail(postId: number) {
  return useQuery({
    queryKey: ['post', 'detail', postId],
    queryFn: async () => {
      const response = await getPostDetail(postId)
      return response.data
    }
  })
}

function usePostAPI() {
  const queryClient = useQueryClient()
  const createPostMutation = useCreatePost()
  const deletePostMutation = useDeletePost()

  const likeMutation = useMutation({
    mutationFn: ({ postId, isLiked }: { postId: number; isLiked: boolean }) =>
      isLiked ? deleteLike(postId) : postLike(postId),
    onSuccess: (_, variables) => {
      // 상세와 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['post', 'detail', variables.postId]
      })
      queryClient.invalidateQueries({ queryKey: ['posts', 'infinite'] })
    }
  })

  return {
    createPostMutation,
    deletePostMutation,
    likeMutation
  }
}

function useInfinitePosts() {
  return useInfiniteQuery<{
    data: PostItem[]
    nextCursor: number
    hasNext: boolean
  }>({
    queryKey: ['posts', 'infinite'],
    queryFn: async ({ pageParam }) => {
      const response = await getPosts({
        lastPostId: pageParam as number | undefined
      })
      return response
    },
    initialPageParam: undefined,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.nextCursor : undefined
  })
}

function useInfiniteUserPosts(userId: number) {
  return useInfiniteQuery<{
    data: PostItem[]
    nextCursor: number
    hasNext: boolean
  }>({
    queryKey: ['posts', 'user', userId, 'infinite'],
    queryFn: async ({ pageParam }) => {
      const response = await getUserPosts({
        userId,
        lastPostId: pageParam as number | undefined
      })
      return response
    },
    initialPageParam: undefined,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: !!userId // userId가 있을 때만 쿼리 실행
  })
}

function useInfiniteSeriesPosts(seriesId: number) {
  return useInfiniteQuery<{
    data: PostItem[]
    nextCursor: number
    hasNext: boolean
  }>({
    queryKey: ['posts', 'series', seriesId, 'infinite'],
    queryFn: async ({ pageParam }) => {
      const response = await getSeriesPosts({
        seriesId,
        lastPostId: pageParam as number | undefined
      })
      return response
    },
    initialPageParam: undefined,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: !!seriesId // seriesId가 있을 때만 쿼리 실행
  })
}

export {
  usePostAPI,
  useDeletePost,
  useGetPostDetail,
  useUpdatePost,
  useInfinitePosts,
  useInfiniteUserPosts,
  useInfiniteSeriesPosts
}

function useInfiniteSearchPosts(keyword: string) {
  return useInfiniteQuery<{
    data: PostItem[]
    nextCursor: number
    hasNext: boolean
  }>({
    queryKey: ['posts', 'search', keyword, 'infinite'],
    queryFn: async ({ pageParam }) => {
      const { getSearchPosts } = await import('@/api/post')
      const response = await getSearchPosts({
        keyword,
        lastPostItem: pageParam as number | undefined
      })
      return response
    },
    initialPageParam: undefined,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: !!keyword
  })
}

export { useInfiniteSearchPosts }
