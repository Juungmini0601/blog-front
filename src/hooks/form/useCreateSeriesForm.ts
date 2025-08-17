import { z } from 'zod'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useCreateSeries } from '@/hooks/useSeries'
import { useNavigate } from 'react-router'
import useUserAPI from '@/hooks/useUser'
import { useModalStore } from '@/store/modalStore'

const createSeriesSchema = z.object({
  name: z
    .string()
    .min(1, '시리즈 이름은 필수입니다')
    .max(50, '시리즈 이름은 50자를 초과할 수 없습니다')
})

export type CreateSeriesFormValues = z.infer<typeof createSeriesSchema>

export default function useCreateSeriesForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<CreateSeriesFormValues>({
      resolver: zodResolver(createSeriesSchema),
      defaultValues: { name: '' }
    })

  const navigate = useNavigate()
  const { user } = useUserAPI()
  const { openModal } = useModalStore()
  const createSeriesMutation = useCreateSeries()

  const onSubmit: SubmitHandler<CreateSeriesFormValues> = useCallback(
    values => {
      createSeriesMutation.mutate(values, {
        onSuccess: () => {
          const userId = user?.userId
          if (userId) {
            navigate(`/blog/${userId}/posts`)
          } else {
            navigate('/')
          }
        },
        onError: () => {
          openModal('에러', '시리즈 생성에 실패했습니다. 잠시 후 다시 시도해주세요.')
          reset()
        }
      })
    },
    [createSeriesMutation, navigate, openModal, reset, user?.userId]
  )

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit
  }
}
