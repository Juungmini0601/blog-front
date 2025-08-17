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

// 특정 유저 정보를 조회하는 훅
export function useGetUserById(userId?: number) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) throw new Error('유효하지 않은 사용자 식별자입니다.')
      const response = await getUser(userId)
      return response.data
    },
    enabled: !!userId
  })
}
