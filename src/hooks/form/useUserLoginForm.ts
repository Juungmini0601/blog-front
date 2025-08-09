import { z } from 'zod'
import useAuthAPI from '@/hooks/useAuth.ts'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useModalStore } from '@/store/modalStore.ts'
import { useNavigate } from 'react-router'
import type { ApiResponse, ErrorMessage } from '@/api'

const loginSchema = z.object({
  email: z
    .email({ error: '이메일을 입력해주세요.' })
    .min(1, '이메일을 입력해주세요.'),
  password: z
    .string({ error: '비밀번호를 입력해주세요.' })
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .max(64, '비밀번호는 최대 64자까지 가능합니다.')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      '비밀번호는 영문자와 숫자를 각각 최소 1자 이상 포함해야 합니다.'
    )
})

type LoginFormValues = z.infer<typeof loginSchema>

export function useLoginForm() {
  const { userLoginMutation } = useAuthAPI()
  const { openModal } = useModalStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '' }
  })

  const onSubmit: SubmitHandler<LoginFormValues> = useCallback(
    values => {
      userLoginMutation.mutate(values, {
        onSuccess: () => {
          openModal('로그인', '로그인이 완료 되었습니다!')
          navigate('/')
        },
        onError: err => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const errorResponse = err?.response?.data as ApiResponse<ErrorMessage>
          const message =
            errorResponse.error?.message || '알 수 없는 오류가 발생했습니다.'

          openModal('로그인 실패', message)
          reset()
        }
      })
    },
    [navigate, openModal, reset, userLoginMutation]
  )

  const isLoading = userLoginMutation.isPending || isSubmitting

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isLoading,
    onSubmit,
    reset
  }
}
