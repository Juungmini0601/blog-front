import type {
  CreatePostRequest,
  CreatePostResponse,
  GetPostResponse,
  GetPostsParams,
  GetSearchPostsParams,
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

async function getSearchPosts(params: GetSearchPostsParams) {
  return apiClient.getCursor<PostItem, number>('/v1/posts/search', params)
}

async function postLike(postId: number) {
  return apiClient.post(`/v1/posts/${postId}/like`)
}

async function deleteLike(postId: number) {
  return apiClient.delete(`/v1/posts/${postId}/like`)
}

export {
  postLike,
  deleteLike,
  getPosts,
  getUserPosts,
  getSeriesPosts,
  getSearchPosts,
  postCreatePost,
  getPostDetail,
  deletePost,
  putUpdatePost
}
