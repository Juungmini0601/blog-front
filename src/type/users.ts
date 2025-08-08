export interface CreateUserRequest {
  email: string
  nickname: string
  password: string
}

export interface CreateUserResponse {
  userId: number
  email: string
  nickname: string
  profileImageUrl: string | null
  githubUrl: string | null
  introduction: string | null
}

export interface User {
  userId: number
  email: string
  nickname: string
  password: string
  profileImageUrl?: string
  githubUrl?: string
  introduction?: string
}
