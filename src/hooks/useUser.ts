import { useMutation, useQuery } from '@tanstack/react-query'
import type { CreateUserRequest } from '@/type/users.ts'
import { getMe, postRegisterUser } from '@/api/users.ts'

export const LOGIN_USER_KEY = 'LOGIN_USER'

function useRegisterUser() {
  return useMutation({
    mutationFn: (request: CreateUserRequest) => postRegisterUser(request)
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
  const getMeQuery = useGetMe()
  const getUserResponse = useGetMe()

  return {
    user: {
      ...getUserResponse?.data
    },
    registerUserMutation,
    getMeQuery
  }
}

export default useUserAPI
