/**
 * 댓글 관련 타입 정의
 * - 서버의 CommentItem 레코드와 매핑
 */
export interface CommentItem {
  commentId: number
  postId: number
  content: string
  createdAt: string
  userId: number
  nickname: string
  profileImageUrl: string | null
}

/**
 * 댓글 생성 요청 바디
 */
export interface CreateCommentRequest {
  postId: number
  parentId?: number | null
  content: string
}

/**
 * 댓글 수정 요청 바디
 */
export interface UpdateCommentRequest {
  content: string
}
