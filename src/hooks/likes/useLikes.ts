import { useModalStore } from '@/store/modalStore'
import { usePostAPI } from '@/hooks/usePost'

export function useLikes(postId: number) {
  const { openModal } = useModalStore()
  const { likeMutation } = usePostAPI()

  const handleLikePost = async () => {
    try {
      await likeMutation.mutateAsync({ postId, isLiked: false })
    } catch (error) {
      console.error(error)
      openModal('알림', '요청 처리 중 문제가 발생했습니다.')
    }
  }

  const handleUnlikePost = async () => {
    try {
      await likeMutation.mutateAsync({ postId, isLiked: true })
    } catch (error) {
      console.error(error)
      openModal('알림', '요청 처리 중 문제가 발생했습니다.')
    }
  }

  return { handleLikePost, handleUnlikePost }
}

export default useLikes
