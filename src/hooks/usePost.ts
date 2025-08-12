import { useMutation } from '@tanstack/react-query'
import { postCreatePost } from '@/api/post'
import type { CreatePostRequest } from '@/type/post'

function useCreatePost() {
  return useMutation({
    mutationFn: (request: CreatePostRequest) => postCreatePost(request)
  })
}

function usePostAPI() {
  const createPostMutation = useCreatePost()

  return {
    createPostMutation
  }
}

export { usePostAPI }
