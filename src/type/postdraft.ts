export interface CreatePostDraftRequest {
  title: string
  content: string
  thumbnailUrl?: string
  isPublic?: boolean
  seriesId?: number
}

export interface UpdatePostDraftRequest {
  title: string
  content: string
  thumbnailUrl?: string
  isPublic?: boolean
  seriesId?: number
}

export interface CreatePostDraftResponse {
  postDraftId: number
  userId: number
  title: string
  content: string
  thumbnailUrl: string | null
  isPublic: boolean
  seriesId: number | null
  createdAt: string
  updatedAt: string
}

export interface UpdatePostDraftResponse {
  postDraftId: number
  userId: number
  title: string
  content: string
  thumbnailUrl: string | null
  isPublic: boolean
  seriesId: number | null
  createdAt: string
  updatedAt: string
}

export interface PostDraftItem {
  postDraftId: number
  title: string
  content: string
  thumbnailUrl: string | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
  userId: number
  nickname: string
  profileImageUrl: string | null
  seriesId: number | null
  seriesName: string | null
}
