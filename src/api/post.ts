import type {
  CreatePostRequest,
  CreatePostResponse,
  GetPostResponse,
  GetPostsParams,
  GetSeriesPostsParams,
  GetUserPostsParams,
  PostItem,
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

async function getPosts(params?: GetPostsParams) {
  return apiClient.getCursor<PostItem, number>('/v1/posts', params)
}

async function getUserPosts(params: GetUserPostsParams) {
  return apiClient.getCursor<PostItem, number>(
    `/v1/posts/users/${params.userId}`,
    params
  )
}

async function getSeriesPosts(params: GetSeriesPostsParams) {
  return apiClient.getCursor<PostItem, number>(
    `/v1/posts/series/${params.seriesId}`,
    params
  )
}

export { getPosts, getUserPosts, getSeriesPosts }

// 게시글 좋아요 추가
async function postLike(postId: number) {
  return apiClient.post(`/v1/posts/${postId}/like`)
}

// 게시글 좋아요 취소
async function deleteLike(postId: number) {
  return apiClient.delete(`/v1/posts/${postId}/like`)
}

export { postLike, deleteLike }
