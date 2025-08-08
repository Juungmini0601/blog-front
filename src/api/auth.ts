import type { LoginRequest } from '@/type/auth.ts'
import { apiClient } from '@/api/index.ts'

async function postLogin(request: LoginRequest) {
  return apiClient.post('/v1/auth/login', { ...request })
}

export { postLogin }
