import { z } from 'zod'
import useUserAPI from '@/hooks/useUser.ts'
import { useCallback } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModalStore } from '@/store/modalStore.ts'
import { useNavigate } from 'react-router'
import type { ApiResponse, ErrorMessage } from '@/api'

const registerSchema = z.object({
  email: z
    .email({ error: '이메일을 입력해주세요.' })
    .min(1, '이메일을 입력해주세요.'),
  nickname: z
    .string({ error: '닉네임을 입력해주세요.' })
    .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
    .max(20, '닉네임은 최대 20자까지 가능합니다.'),
  password: z
    .string({ error: '비밀번호를 입력해주세요.' })
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .max(64, '비밀번호는 최대 64자까지 가능합니다.')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      '비밀번호는 영문자와 숫자를 각각 최소 1자 이상 포함해야 합니다.'
    )
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function useUserRegisterForm() {
  const { registerUserMutation } = useUserAPI()
  const { openModal } = useModalStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { email: '', nickname: '', password: '' }
  })

  const onSubmit: SubmitHandler<RegisterFormValues> = useCallback(
    values => {
      registerUserMutation.mutate(values, {
        onSuccess: () => {
          openModal('회원 가입', '회원 가입이 완료 되었습니다!')
          navigate('/login')
        },
        onError: err => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const errorResponse = err?.response?.data as ApiResponse<ErrorMessage>
          const message =
            errorResponse.error?.message || '알 수 없는 오류가 발생했습니다.'

          openModal('회원 가입 실패', message)
          reset()
        }
      })
    },
    [navigate, openModal, registerUserMutation, reset]
  )

  const isLoading = registerUserMutation.isPending || isSubmitting

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
