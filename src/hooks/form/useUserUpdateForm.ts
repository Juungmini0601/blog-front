import { z } from 'zod'
import useUserAPI from '@/hooks/useUser.ts'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { useCallback } from 'react'
import type { ApiResponse, ErrorMessage } from '@/api'
import { useModalStore } from '@/store/modalStore.ts'

export const updateUserSchema = z.object({
  nickname: z
    .string({ error: '닉네임은 필수 입력값입니다' })
    .min(2, '닉네임은 2자 이상 20자 이하로 입력해주세요')
    .max(20, '닉네임은 2자 이상 20자 이하로 입력해주세요'),
  profileImageUrl: z
    .string()
    .max(255, '프로필 이미지 URL은 255자를 초과할 수 없습니다')
    .nullable()
    .optional(),
  githubUrl: z
    .string()
    .max(255, 'Github URL은 255자를 초과할 수 없습니다')
    .nullable()
    .optional(),
  introduction: z
    .string()
    .max(100, '자기소개는 100자를 초과할 수 없습니다')
    .nullable()
    .optional()
})

type UpdateUserSchema = z.infer<typeof updateUserSchema>

export function useUserUpdateForm() {
  const { updateUserMutation } = useUserAPI()
  const { openModal } = useModalStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      nickname: '',
      profileImageUrl: '',
      githubUrl: '',
      introduction: ''
    }
  })

  const onSubmit: SubmitHandler<UpdateUserSchema> = useCallback(
    values => {
      updateUserMutation.mutate(values, {
        onSuccess: () => {
          openModal('회원 정보 수정', '회원 정보 수정이 완료 되었습니다!')
          navigate('/')
        },
        onError: err => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const errorResponse = err?.response?.data as ApiResponse<ErrorMessage>
          const message =
            errorResponse.error?.message || '알 수 없는 오류가 발생했습니다.'

          openModal('회원 정보 수정 실패', message)
          reset()
        }
      })
    },
    [navigate, openModal, updateUserMutation, reset]
  )

  const isLoading = updateUserMutation.isPending || isSubmitting

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isLoading,
    onSubmit,
    reset,
    watch,
    setValue
  }
}
