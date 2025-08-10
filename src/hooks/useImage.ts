import { useMutation } from '@tanstack/react-query'
import { getImageUploadUrl } from '@/api/image.ts'
import { useModalStore } from '@/store/modalStore.ts'

function useImageUpload() {
  const { openModal } = useModalStore()

  return useMutation({
    mutationFn: (filename: string) => getImageUploadUrl(filename),
    onError: () => {
      openModal('에러', '이미지 업로드 URL 생성 중 문제가 발생했습니다!')
    }
  })
}

function useImage() {
  const imageUploadMutation = useImageUpload()

  return {
    imageUploadMutation
  }
}

export default useImage
