import { useMutation, useQuery } from '@tanstack/react-query'
import type { CreateUserRequest, UpdateUserRequest } from '@/type/users.ts'
import {
  deleteUser,
  getMe,
  postRegisterUser,
  putUpdateUser
} from '@/api/users.ts'

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

function useDeleteUser() {
  return useMutation({
    mutationFn: () => deleteUser()
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
  const deleteUserMutation = useDeleteUser()
  const getUserResponse = useGetMe()

  return {
    user: {
      ...getUserResponse?.data
    },
    registerUserMutation,
    updateUserMutation,
    deleteUserMutation
  }
}

export default useUserAPI
