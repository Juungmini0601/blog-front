import { useMutation } from '@tanstack/react-query'
import type { CreateUserRequest } from '@/type/users.ts'
import { postRegisterUser } from '@/api/users.ts'

function useRegisterUser() {
  return useMutation({
    mutationFn: (request: CreateUserRequest) => postRegisterUser(request)
  })
}

function useUserAPI() {
  const registerUserMutation = useRegisterUser()

  return {
    registerUserMutation
  }
}

export default useUserAPI
