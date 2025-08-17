import { z } from 'zod'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useUpdateSeries } from '@/hooks/useSeries'
import useUserAPI from '@/hooks/useUser'
import { useModalStore } from '@/store/modalStore'

const updateSeriesSchema = z.object({
  name: z
    .string()
    .min(1, '시리즈 이름은 필수입니다')
    .max(50, '시리즈 이름은 50자를 초과할 수 없습니다')
})

export type UpdateSeriesFormValues = z.infer<typeof updateSeriesSchema>

export default function useUpdateSeriesForm(seriesId: number) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset
  } = useForm<UpdateSeriesFormValues>({
    resolver: zodResolver(updateSeriesSchema),
    defaultValues: { name: '' }
  })

  const navigate = useNavigate()
  const { user } = useUserAPI()
  const { openModal } = useModalStore()
  const updateSeriesMutation = useUpdateSeries()

  const onSubmit: SubmitHandler<UpdateSeriesFormValues> = useCallback(
    values => {
      updateSeriesMutation.mutate(
        {
          seriesId,
          request: values
        },
        {
          onSuccess: () => {
            const userId = user?.userId
            if (userId) {
              navigate(`/blog/${userId}/posts`)
            } else {
              navigate('/')
            }
          },
          onError: () => {
            openModal('에러', '시리즈 수정에 실패했습니다. 잠시 후 다시 시도해주세요.')
            reset()
          }
        }
      )
    },
    [navigate, openModal, reset, seriesId, updateSeriesMutation, user?.userId]
  )

  const isLoading = updateSeriesMutation.isPending || isSubmitting

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isLoading,
    onSubmit,
    setValue
  }
}
