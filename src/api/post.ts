import type {
  CreatePostRequest,
  CreatePostResponse,
  GetPostResponse,
  UpdatePostRequest,
  PostItem,
  GetPostsParams
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

// 게시글 목록 (커서 기반) 조회 API
async function getPosts(params?: GetPostsParams) {
  // 서버는 lastPostId 파라미터를 사용함
  return apiClient.getCursor<PostItem, number>('/v1/posts', params)
}

export { getPosts }

// 게시글 좋아요 추가
async function postLike(postId: number) {
  return apiClient.post(`/v1/posts/${postId}/like`)
}

// 게시글 좋아요 취소
async function deleteLike(postId: number) {
  return apiClient.delete(`/v1/posts/${postId}/like`)
}

export { postLike, deleteLike }
