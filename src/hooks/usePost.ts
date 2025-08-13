import { useMutation, useQuery } from '@tanstack/react-query'
import {
  deletePost,
  getPostDetail,
  postCreatePost,
  putUpdatePost
} from '@/api/post'
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
  const createPostMutation = useCreatePost()
  const deletePostMutation = useDeletePost()

  return {
    createPostMutation,
    deletePostMutation
  }
}

export { usePostAPI, useDeletePost, useGetPostDetail, useUpdatePost }
