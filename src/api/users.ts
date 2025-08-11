import type {
  CreateUserRequest,
  GetUserResponse,
  UpdateUserRequest,
  UpdateUserResponse
} from '@/type/users.ts'
import { apiClient, type ApiResponse } from '@/api/index.ts'

async function postRegisterUser(request: CreateUserRequest) {
  return apiClient.post('/v1/users/register', { ...request })
}

async function getMe(): Promise<ApiResponse<GetUserResponse>> {
  return apiClient.get('/v1/users/me')
}

async function putUpdateUser(request: UpdateUserRequest) {
  return apiClient.put<UpdateUserResponse>('/v1/users/update', { ...request })
}

async function deleteUser() {
  return apiClient.delete('/v1/users/remove')
}

export { postRegisterUser, getMe, putUpdateUser, deleteUser }
