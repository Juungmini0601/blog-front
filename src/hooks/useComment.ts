import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateCommentRequest, UpdateCommentRequest } from '@/type/comment'
import {
  deleteComment,
  getComments,
  postCreateComment,
  putUpdateComment
} from '@/api/comment'

const COMMENT_LIST_KEY = 'comments'

/**
 * 댓글 목록 조회 훅
 */
function useGetComments(postId: number) {
  return useQuery({
    queryKey: [COMMENT_LIST_KEY, postId],
    queryFn: async () => {
      const response = await getComments(postId)
      return response.data ?? []
    }
  })
}

/**
 * 댓글 생성 훅
 */
function useCreateComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateCommentRequest) => postCreateComment(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [COMMENT_LIST_KEY, variables.postId]
      })
    }
  })
}

/**
 * 댓글 수정 훅
 */
function useUpdateComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      commentId,
      request
    }: {
      commentId: number
      request: UpdateCommentRequest
    }) => putUpdateComment(commentId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENT_LIST_KEY] })
    }
  })
}

/**
 * 댓글 삭제 훅
 */
function useDeleteComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId }: { commentId: number; postId: number }) =>
      deleteComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [COMMENT_LIST_KEY, variables.postId]
      })
    }
  })
}

export { useGetComments, useCreateComment, useUpdateComment, useDeleteComment }
