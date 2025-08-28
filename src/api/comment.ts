import type {
  CommentItem,
  CreateCommentRequest,
  UpdateCommentRequest
} from '@/type/comment'
import { apiClient, type ApiResponse } from '@/api/index'

async function getComments(
  postId: number
): Promise<ApiResponse<CommentItem[]>> {
  return apiClient.get<CommentItem[]>(`/v1/comments/${postId}`)
}

async function postCreateComment(
  request: CreateCommentRequest
): Promise<ApiResponse<CommentItem>> {
  return apiClient.post<CommentItem>('/v1/comments', { ...request })
}

async function putUpdateComment(
  commentId: number,
  request: UpdateCommentRequest
): Promise<ApiResponse<CommentItem>> {
  return apiClient.put<CommentItem>(`/v1/comments/${commentId}`, {
    ...request
  })
}

async function deleteComment(commentId: number): Promise<ApiResponse<void>> {
  return apiClient.delete<void>(`/v1/comments/${commentId}`)
}

export { getComments, postCreateComment, putUpdateComment, deleteComment }
