import type { CreateUserRequest } from '@/type/users.ts'
import { apiClient } from '@/api/index.ts'

async function postRegisterUser(request: CreateUserRequest) {
  return apiClient.post('/v1/users', { ...request })
}

export { postRegisterUser }
