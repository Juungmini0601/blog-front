import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import {
  deletePostDraft,
  getPostDrafts,
  postCreatePostDraft,
  putUpdatePostDraft
} from '@/api/postdraft'
import type {
  CreatePostDraftRequest,
  PostDraftItem,
  UpdatePostDraftRequest
} from '@/type/postdraft'
import type { CursorResponse } from '@/api'

const postDraftKeys = {
  all: ['postdrafts'] as const,
  infinite: () => [...postDraftKeys.all, 'infinite'] as const
}

function useInfinitePostDraftsQuery(enabled: boolean = true) {
  return useInfiniteQuery<
    CursorResponse<PostDraftItem, number>,
    Error,
    CursorResponse<PostDraftItem, number>,
    ReturnType<typeof postDraftKeys.infinite>,
    number | undefined
  >({
    queryKey: postDraftKeys.infinite(),
    initialPageParam: undefined as number | undefined,
    queryFn: async ({ pageParam }) => {
      return getPostDrafts(
        pageParam !== undefined ? { lastPostDraftId: pageParam } : undefined
      )
    },
    enabled,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.nextCursor : undefined
  })
}

function useCreatePostDraftMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreatePostDraftRequest) =>
      postCreatePostDraft(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postDraftKeys.all })
    }
  })
}

function useUpdatePostDraftMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      postDraftId,
      request
    }: {
      postDraftId: number
      request: UpdatePostDraftRequest
    }) => putUpdatePostDraft(postDraftId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postDraftKeys.all })
    }
  })
}

function useDeletePostDraftMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postDraftId: number) => deletePostDraft(postDraftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postDraftKeys.all })
    }
  })
}

export {
  useInfinitePostDraftsQuery,
  useCreatePostDraftMutation,
  useUpdatePostDraftMutation,
  useDeletePostDraftMutation
}
