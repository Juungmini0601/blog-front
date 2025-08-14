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

// 게시글 목록 아이템 타입
export interface PostItem {
  postId: number
  thumbnailUrl: string | null
  createdAt: string
  content: string
  userId: number
  nickname: string
  profileImageUrl: string | null
  commentCount: number
  likeCount: number
}

// 게시글 목록 조회 파라미터 (커서 기반)
export interface GetPostsParams {
  // 서버가 요구하는 커서 파라미터 이름: lastPostId
  lastPostId?: number
}
