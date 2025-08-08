import { useMutation } from '@tanstack/react-query'
import type { LoginRequest } from '@/type/auth.ts'
import { postLogin } from '@/api/auth.ts'

function useLogin() {
  return useMutation({
    mutationFn: (request: LoginRequest) => postLogin(request)
  })
}

function useAuthAPI() {
  const userLoginMutation = useLogin()

  return {
    userLoginMutation
  }
}

export default useAuthAPI
