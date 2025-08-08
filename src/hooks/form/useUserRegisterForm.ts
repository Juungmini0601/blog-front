import { z } from 'zod'
import useUserAPI from '@/hooks/useUser.ts'
import { useCallback, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

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
  const [serverError, setServerError] = useState<string | null>(null)

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
      setServerError(null)
      registerUserMutation.mutate(values, {
        onSuccess: () => {
          alert('회원가입이 완료되었습니다!')
          reset()
        },
        onError: err => {
          alert(err.message)
        }
      })
    },
    [registerUserMutation, reset]
  )

  const isLoading = registerUserMutation.isPending || isSubmitting

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isLoading,
    serverError,
    onSubmit,
    reset
  }
}
