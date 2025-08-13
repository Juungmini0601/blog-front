import { z } from 'zod'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo } from 'react'
import { useGetPostDetail, useUpdatePost } from '@/hooks/usePost'
import { useNavigate } from 'react-router'
import { useModalStore } from '@/store/modalStore'

const updatePostFormSchema = z.object({
  title: z
    .string()
    .min(1, '제목은 필수입니다')
    .max(255, '제목은 255자를 초과할 수 없습니다'),
  content: z.string().min(1, '내용은 필수입니다'),
  thumbnailUrl: z
    .url('올바른 URL 형식이 아닙니다')
    .optional()
    .or(z.literal('')),
  isPublic: z.boolean(),
  seriesId: z.number().optional()
})

type UpdatePostFormSchema = z.infer<typeof updatePostFormSchema>

export default function usePostUpdateForm(postId: number) {
  const navigate = useNavigate()
  const { openModal } = useModalStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<UpdatePostFormSchema>({
    resolver: zodResolver(updatePostFormSchema),
    defaultValues: {
      title: '',
      content: '',
      thumbnailUrl: '',
      isPublic: true,
      seriesId: undefined
    }
  })

  const { data, isLoading } = useGetPostDetail(postId)
  const updatePostMutation = useUpdatePost()

  useEffect(() => {
    if (data) {
      reset({
        title: data.title || '',
        content: data.content || '',
        thumbnailUrl: data.thumbnailUrl || '',
        isPublic: data.isPublic,
        seriesId: data.seriesId || undefined
      })
    }
  }, [data, reset])

  const onSubmit: SubmitHandler<UpdatePostFormSchema> = useCallback(
    values => {
      updatePostMutation.mutate(
        { postId, request: values },
        {
          onSuccess: () => {
            navigate(`/post/${postId}`)
          },
          onError: () => {
            openModal(
              '에러',
              '게시글 수정에 실패했습니다. 잠시후 다시 시도 해주세요'
            )
          }
        }
      )
    },
    [navigate, openModal, postId, updatePostMutation]
  )

  const isLoadingAll = useMemo(
    () => isLoading || updatePostMutation.isPending || isSubmitting,
    [isLoading, updatePostMutation.isPending, isSubmitting]
  )

  return {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    onSubmit,
    isLoading: isLoadingAll
  }
}
