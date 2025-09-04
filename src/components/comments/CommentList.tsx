import CommentItem from '@/components/comments/CommentItem'
import type { CommentItem as Comment } from '@/type/comment'

export interface CommentListProps {
  comments: Comment[]
  isLoading: boolean
  currentUserId?: number
  editingCommentId: number | null
  editingContent: string
  onChangeEditingContent: (value: string) => void
  onStartEdit: (commentId: number, content: string) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDelete: (commentId: number) => void
}

export default function CommentList({
  comments,
  isLoading,
  currentUserId,
  editingCommentId,
  editingContent,
  onChangeEditingContent,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete
}: CommentListProps) {
  if (isLoading) {
    return <div>댓글을 불러오는 중입니다...</div>
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">첫 댓글을 남겨보세요!</div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => {
        const isOwner = currentUserId === comment.userId
        const isEditing = editingCommentId === comment.commentId
        return (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            isOwner={isOwner}
            isEditing={isEditing}
            editingContent={editingContent}
            onChangeEditingContent={onChangeEditingContent}
            onStartEdit={() => onStartEdit(comment.commentId, comment.content)}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onDelete={() => onDelete(comment.commentId)}
          />
        )
      })}
    </div>
  )
}
