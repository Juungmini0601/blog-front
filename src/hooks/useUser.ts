import { useMutation, useQuery } from '@tanstack/react-query'
import type { CreateUserRequest, UpdateUserRequest } from '@/type/users.ts'
import { getMe, postRegisterUser, putUpdateUser } from '@/api/users.ts'

export const LOGIN_USER_KEY = 'LOGIN_USER'

function useRegisterUser() {
  return useMutation({
    mutationFn: (request: CreateUserRequest) => postRegisterUser(request)
  })
}

function useUpdateUser() {
  return useMutation({
    mutationFn: (request: UpdateUserRequest) => putUpdateUser(request)
  })
}

function useGetMe() {
  const { data } = useQuery({
    queryFn: getMe,
    queryKey: [LOGIN_USER_KEY]
  })

  return data
}

function useUserAPI() {
  const registerUserMutation = useRegisterUser()
  const updateUserMutation = useUpdateUser()
  const getUserResponse = useGetMe()

  return {
    user: {
      ...getUserResponse?.data
    },
    registerUserMutation,
    updateUserMutation
  }
}

export default useUserAPI
