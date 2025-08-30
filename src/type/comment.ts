export interface CommentItem {
  commentId: number
  postId: number
  content: string
  createdAt: string
  userId: number
  nickname: string
  profileImageUrl: string | null
}

export interface CreateCommentRequest {
  postId: number
  parentId?: number | null
  content: string
}

export interface UpdateCommentRequest {
  content: string
}
