import { LOGIN_USER_KEY } from '@/hooks/useUser.ts'
import queryClient from '@/api/queryClient.ts'
import { redirect } from 'react-router'
import type { ApiResponse } from '@/api'

interface User {
  userId: number
  email: string
  nickname: string
  profileImageUrl: string | null
  githubUrl: string
  introduction: string
  createdAt: string
  updatedAt: string
}

function hasData(response: unknown): response is ApiResponse<unknown> {
  return typeof response === 'object' && response !== null && 'data' in response
}

function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'userId' in data &&
    'email' in data &&
    'nickname' in data
  )
}

export async function requireAuth() {
  const userData = queryClient.getQueryData([LOGIN_USER_KEY])

  if (!hasData(userData) || !isUser(userData.data)) {
    return redirect('/login')
  }

  return userData.data
}
