import type {
  CreatePostRequest,
  CreatePostResponse,
  GetPostResponse,
  UpdatePostRequest
} from '@/type/post'
import { apiClient } from '@/api/index'

async function postCreatePost(request: CreatePostRequest) {
  return apiClient.post<CreatePostResponse>('/v1/posts', { ...request })
}

async function getPostDetail(postId: number) {
  return apiClient.get<GetPostResponse>(`/v1/posts/${postId}`)
}

async function deletePost(postId: number) {
  return apiClient.delete(`/v1/posts/${postId}`)
}

async function putUpdatePost(postId: number, request: UpdatePostRequest) {
  return apiClient.put(`/v1/posts/${postId}`, { ...request })
}

export { postCreatePost, getPostDetail, deletePost, putUpdatePost }
