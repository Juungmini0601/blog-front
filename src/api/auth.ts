import type { LoginRequest } from '@/type/auth.ts'
import { apiClient } from '@/api/index.ts'

async function postLogin(request: LoginRequest) {
  return apiClient.post('/v1/auth/login', { ...request })
}

async function postLogout() {
  return apiClient.post('/v1/auth/logout')
}

export { postLogin, postLogout }
