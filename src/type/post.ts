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

export interface GetPostResponse {
  postId: number
  userId: number
  userNickname: string
  userProfileImageUrl: string | null
  userIntroduction: string | null
  title: string
  content: string
  thumbnailUrl: string
  isPublic: boolean
  isLiked: boolean
  likeCount: number
  seriesId: number | null
  createdAt: string
  updatedAt: string
}

export interface UpdatePostRequest {
  title: string
  content: string
  thumbnailUrl?: string
  isPublic?: boolean
  seriesId?: number
}

export interface PostItem {
  postId: number
  thumbnailUrl: string | null
  createdAt: string
  title?: string
  content: string
  userId: number
  nickname: string
  profileImageUrl: string | null
  commentCount: number
  likeCount: number
}

export interface GetPostsParams {
  lastPostId?: number
}

export interface GetUserPostsParams {
  userId: number
  lastPostId?: number
}

export interface GetSeriesPostsParams {
  seriesId: number
  lastPostId?: number
}
