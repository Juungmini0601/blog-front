import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import {
  deletePost,
  getPostDetail,
  postCreatePost,
  putUpdatePost
} from '@/api/post'
import { deleteLike, postLike } from '@/api/post'
import { getPosts } from '@/api/post'
import type { PostItem } from '@/type/post'
import type { CreatePostRequest, UpdatePostRequest } from '@/type/post'

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
  return useMutation({
    mutationFn: ({
      postId,
      request
    }: {
      postId: number
      request: UpdatePostRequest
    }) => putUpdatePost(postId, request)
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

export {
  usePostAPI,
  useDeletePost,
  useGetPostDetail,
  useUpdatePost,
  useInfinitePosts
}
