import type { CreateUserRequest, GetUserResponse } from '@/type/users.ts'
import { apiClient, type ApiResponse } from '@/api/index.ts'

async function postRegisterUser(request: CreateUserRequest) {
  return apiClient.post('/v1/users/register', { ...request })
}

async function getMe(): Promise<ApiResponse<GetUserResponse>> {
  return apiClient.get('/v1/users/me')
}

export { postRegisterUser, getMe }
