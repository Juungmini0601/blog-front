export interface CreatePostRequest {
  title: string
  content: string
  thumbnailUrl?: string
  isPublic?: boolean
  seriesId?: number
}

export interface CreatePostResponse {
  postId: number
  userId: number
  title: string
  content: string
  thumbnailUrl: string
  isPublic: boolean
  viewCount: number
  seriesId: number
  createdAt: string
  updatedAt: string
}
