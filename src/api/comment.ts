import type {
  CommentItem,
  CreateCommentRequest,
  UpdateCommentRequest
} from '@/type/comment'
import { apiClient, type ApiResponse } from '@/api/index'

/**
 * 댓글 목록 조회
 */
async function getComments(
  postId: number
): Promise<ApiResponse<CommentItem[]>> {
  return apiClient.get<CommentItem[]>(`/v1/comments/${postId}`)
}

/**
 * 댓글 생성
 */
async function postCreateComment(
  request: CreateCommentRequest
): Promise<ApiResponse<CommentItem>> {
  return apiClient.post<CommentItem>('/v1/comments', { ...request })
}

/**
 * 댓글 수정
 */
async function putUpdateComment(
  commentId: number,
  request: UpdateCommentRequest
): Promise<ApiResponse<CommentItem>> {
  return apiClient.put<CommentItem>(`/v1/comments/${commentId}`, {
    ...request
  })
}

/**
 * 댓글 삭제
 */
async function deleteComment(commentId: number): Promise<ApiResponse<void>> {
  return apiClient.delete<void>(`/v1/comments/${commentId}`)
}

export { getComments, postCreateComment, putUpdateComment, deleteComment }
