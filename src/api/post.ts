import type { CreatePostRequest, CreatePostResponse } from '@/type/post'
import { apiClient } from '@/api/index'

async function postCreatePost(request: CreatePostRequest) {
  return apiClient.post<CreatePostResponse>('/v1/posts', { ...request })
}

export { postCreatePost }
