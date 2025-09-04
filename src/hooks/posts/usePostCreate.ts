import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { useModalStore } from '@/store/modalStore'
import usePostCreateForm from '@/hooks/form/usePostCreateForm'
import { useGetUserSeries } from '@/hooks/useSeries'
import useUserAPI from '@/hooks/useUser'
import {
  useCreatePostDraftMutation,
  useDeletePostDraftMutation,
  useUpdatePostDraftMutation
} from '@/hooks/usePostdraft'
import type { PostDraftItem } from '@/type/postdraft'

export default function usePostCreate() {
  const { openModal } = useModalStore()
  const location = useLocation()

  // 임시 저장 상태
  const [draftId, setDraftId] = useState<number | undefined>(undefined)

  // 임시 저장 관련 뮤테이션
  const { mutate: createPostDraft, isPending: isCreatingDraft } =
    useCreatePostDraftMutation()
  const { mutate: updatePostDraft, isPending: isUpdatingDraft } =
    useUpdatePostDraftMutation()
  const { mutate: deletePostDraft } = useDeletePostDraftMutation()

  // 폼 관리
  const { register, handleSubmit, watch, setValue, errors, onSubmit } =
    usePostCreateForm({
      onSuccess: () => {
        if (draftId) {
          // 게시글 저장 성공 시, 임시 저장본이 있으면 삭제
          deletePostDraft(draftId)
        }
      }
    })

  const watchedValues = watch()

  // 사용자 정보 및 시리즈 조회
  const { user } = useUserAPI()
  const userId = user?.userId
  const { data: userSeries = [] } = useGetUserSeries(userId ? userId : 0)

  // 선택된 시리즈 정보
  const selectedSeries = userSeries?.find(
    series => series.seriesId === watchedValues.seriesId
  )

  // 라우팅 상태에서 임시글 불러오기
  useEffect(() => {
    const state = location.state as { draft?: PostDraftItem } | null
    const draft = state?.draft
    if (draft) {
      setDraftId(draft.postDraftId)
      setValue('title', draft.title)
      setValue('content', draft.content)
      setValue('thumbnailUrl', draft.thumbnailUrl ?? '')
      setValue('isPublic', draft.isPublic)
      setValue('seriesId', draft.seriesId ?? undefined)
    }
  }, [location.state, setValue])

  // 임시 저장 핸들러
  const handleSaveDraft = () => {
    const payload = {
      title: watchedValues.title || '',
      content: watchedValues.content || '',
      thumbnailUrl: watchedValues.thumbnailUrl || undefined,
      isPublic: watchedValues.isPublic,
      seriesId: watchedValues.seriesId
    }

    if (draftId) {
      updatePostDraft(
        {
          postDraftId: draftId,
          request: payload
        },
        {
          onSuccess: () => {
            openModal('임시 저장', '임시 저장이 완료되었습니다.')
          }
        }
      )
    } else {
      createPostDraft(payload, {
        onSuccess: res => {
          const newId = res.data?.postDraftId
          if (newId) setDraftId(newId)
          openModal('임시 저장', '임시 저장이 완료되었습니다.')
        }
      })
    }
  }

  // 폼 제출 핸들러
  const handleFormSubmit = handleSubmit(onSubmit)

  return {
    // 폼 관련
    register,
    setValue,
    errors,
    watchedValues,

    // 사용자 및 시리즈 데이터
    userSeries,
    selectedSeries,

    // 임시 저장 관련
    handleSaveDraft,
    isCreatingDraft,
    isUpdatingDraft,

    // 폼 제출
    handleFormSubmit
  }
}
