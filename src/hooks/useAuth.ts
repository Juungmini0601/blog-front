import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { LoginRequest } from '@/type/auth.ts'
import { postLogin, postLogout } from '@/api/auth.ts'
import { LOGIN_USER_KEY } from '@/hooks/useUser.ts'
import { useNavigate } from 'react-router'

function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: LoginRequest) => postLogin(request),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: [LOGIN_USER_KEY] })
    }
  })
}

function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => postLogout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: [LOGIN_USER_KEY] })
      navigate('/')
    }
  })
}

function useAuthAPI() {
  const userLoginMutation = useLogin()
  const userLogoutMutation = useLogout()

  return {
    userLoginMutation,
    userLogoutMutation
  }
}

export default useAuthAPI
