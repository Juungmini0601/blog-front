import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import Confirm from '@/components/shared/Confirm'
import { format } from 'date-fns'
import type { CommentItem as Comment } from '@/type/comment'

function MenuText({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <span
      className="cursor-pointer hover:text-primary"
      onClick={onClick}>
      {text}
    </span>
  )
}

export interface CommentItemProps {
  comment: Comment
  isOwner: boolean
  isEditing: boolean
  editingContent: string
  onChangeEditingContent: (value: string) => void
  onStartEdit: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDelete: () => void
}

export default function CommentItem({
  comment,
  isOwner,
  isEditing,
  editingContent,
  onChangeEditingContent,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete
}: CommentItemProps) {
  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            {comment.profileImageUrl ? (
              <AvatarImage
                src={comment.profileImageUrl}
                alt="프로필 이미지"
              />
            ) : (
              <AvatarFallback>
                <span className="text-xs">{comment.nickname?.[0] || 'U'}</span>
              </AvatarFallback>
            )}
          </Avatar>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground mr-2">
              {comment.nickname}
            </span>
            <span>
              {format(new Date(comment.createdAt), 'yyyy.MM.dd HH:mm')}
            </span>
          </div>
        </div>
        {isOwner && (
          <div className="flex items-center gap-3 text-sm">
            {isEditing ? (
              <>
                <MenuText
                  text="저장"
                  onClick={onSaveEdit}
                />
                <MenuText
                  text="취소"
                  onClick={onCancelEdit}
                />
              </>
            ) : (
              <>
                <MenuText
                  text="수정"
                  onClick={onStartEdit}
                />
                <Confirm
                  title="댓글 삭제"
                  description="이 댓글을 삭제하시겠습니까?"
                  confirmText="삭제"
                  cancelText="취소"
                  onConfirm={onDelete}
                  trigger={<MenuText text="삭제" />}
                />
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-3">
        {isEditing ? (
          <Textarea
            value={editingContent}
            onChange={e => onChangeEditingContent(e.target.value)}
          />
        ) : (
          <p className="whitespace-pre-wrap leading-6">{comment.content}</p>
        )}
      </div>
    </div>
  )
}
