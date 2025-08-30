export interface CreateUserRequest {
  email: string
  nickname: string
  password: string
}

export interface GetUserResponse {
  userId: number
  email: string
  nickname: string
  profileImageUrl: string | null
  githubUrl: string | null
  introduction: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdateUserRequest {
  nickname: string
  profileImageUrl?: string | null
  githubUrl?: string | null
  introduction?: string | null
}

export interface UpdateUserResponse {
  userId: number
  email: string
  nickname: string
  profileImageUrl: string | null
  githubUrl: string | null
  introduction: string | null
  createdAt: string
  updatedAt: string
}
