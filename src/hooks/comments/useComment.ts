import { useState } from 'react'
import { useModalStore } from '@/store/modalStore'
import {
  useCreateComment,
  useDeleteComment,
  useGetComments,
  useUpdateComment
} from '@/hooks/useComment'

// This hook composes existing comment hooks and local UI state for PostDetailPage.
// It centralizes comment CRUD handlers and editing state management.
export function useCommentsController(postId: number) {
  const { openModal } = useModalStore()

  // Server state
  const { data: comments = [], isLoading: isCommentsLoading } = useGetComments(postId)
  const createCommentMutation = useCreateComment()
  const updateCommentMutation = useUpdateComment()
  const deleteCommentMutation = useDeleteComment()

  // Local UI state
  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState('')

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      openModal('알림', '내용을 입력해주세요.')
      return
    }
    try {
      await createCommentMutation.mutateAsync({ postId, content: newComment })
      setNewComment('')
    } catch (error) {
      console.error(error)
      openModal('알림', '댓글 작성 중 문제가 발생했습니다.')
    }
  }

  const startEdit = (commentId: number, content: string) => {
    setEditingCommentId(commentId)
    setEditingContent(content)
  }

  const saveEdit = async () => {
    if (!editingCommentId) return
    if (!editingContent.trim()) {
      openModal('알림', '내용을 입력해주세요.')
      return
    }
    try {
      await updateCommentMutation.mutateAsync({
        commentId: editingCommentId,
        request: { content: editingContent }
      })
      setEditingCommentId(null)
      setEditingContent('')
    } catch (error) {
      console.error(error)
      openModal('알림', '댓글 수정 중 문제가 발생했습니다.')
    }
  }

  const removeComment = async (commentId: number) => {
    try {
      await deleteCommentMutation.mutateAsync({ commentId, postId })
    } catch (error) {
      console.error(error)
      openModal('알림', '댓글 삭제 중 문제가 발생했습니다.')
    }
  }

  return {
    // server state
    comments,
    isCommentsLoading,

    // local state
    newComment,
    setNewComment,
    editingCommentId,
    setEditingCommentId,
    editingContent,
    setEditingContent,

    // handlers
    handleCreateComment,
    startEdit,
    saveEdit,
    removeComment
  }
}

export default useCommentsController
