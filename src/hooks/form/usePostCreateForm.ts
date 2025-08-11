import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCallback } from 'react'

const createPostFormSchema = z.object({
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

type CreatePostFormSchema = z.infer<typeof createPostFormSchema>

export default function usePostCreateForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreatePostFormSchema>({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: {
      title: '',
      content: '',
      thumbnailUrl: '',
      isPublic: true,
      seriesId: undefined
    }
  })
  // TODO mutation 추가
  const onSubmit: SubmitHandler<CreatePostFormSchema> = useCallback(values => {
    console.log(values)
  }, [])

  return {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    onSubmit
  }
}
