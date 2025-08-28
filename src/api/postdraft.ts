import type {
  CreatePostDraftRequest,
  CreatePostDraftResponse,
  UpdatePostDraftRequest,
  UpdatePostDraftResponse,
  PostDraftItem
} from '@/type/postdraft'
import { apiClient } from '@/api/index'

async function postCreatePostDraft(request: CreatePostDraftRequest) {
  return apiClient.post<CreatePostDraftResponse>('/v1/postdrafts', {
    ...request
  })
}

async function putUpdatePostDraft(
  postDraftId: number,
  request: UpdatePostDraftRequest
) {
  return apiClient.put<UpdatePostDraftResponse>(
    `/v1/postdrafts/${postDraftId}`,
    { ...request }
  )
}

async function getPostDrafts(params?: { lastPostDraftId?: number }) {
  return apiClient.getCursor<PostDraftItem, number>('/v1/postdrafts', params)
}

async function deletePostDraft(postDraftId: number) {
  return apiClient.delete<void>(`/v1/postdrafts/${postDraftId}`)
}

export {
  postCreatePostDraft,
  putUpdatePostDraft,
  getPostDrafts,
  deletePostDraft
}
