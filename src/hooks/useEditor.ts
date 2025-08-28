import { useCallback, useRef } from 'react'
import useImage from '@/hooks/useImage'
import { useModalStore } from '@/store/modalStore'

export interface UseEditorParams {
  value: string
  onChange: (next_value: string) => void
}

export interface UseEditorReturn {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  insertMarkdown: (before: string, after?: string) => void
  insertLinePrefix: (prefix: string) => void
  insertTextAtCursor: (text: string) => void
  handlePaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => Promise<void>
}

/**
 * 마크다운 에디터 공용 로직 훅
 * - 선택 영역 래핑, 접두사 삽입, 커서 삽입
 * - 클립보드 이미지 자동 업로드 및 마크다운 삽입
 */
export default function useEditor(params: UseEditorParams): UseEditorReturn {
  const { value, onChange } = params
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { imageUploadMutation } = useImage()
  const { openModal } = useModalStore()

  /** 선택 영역을 before/after로 감싸기 */
  const insertMarkdown = useCallback(
    (before: string, after: string = '') => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)
      const newText = before + selectedText + after

      const newValue =
        value.substring(0, start) + newText + value.substring(end)
      onChange(newValue)

      // 바로 할 경우 제대로 선택이 안되서, 약간의 지연을 두고 선택
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + selectedText.length
        )
      }, 1)
    },
    [onChange, value]
  )

  /** 줄 단위 접두사 삽입 */
  const insertLinePrefix = useCallback(
    (prefix: string) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      const beforeSelection = value.slice(0, start)
      const selectedText = value.slice(start, end)
      const afterSelection = value.slice(end)

      const lines = selectedText.split('\n')
      const prefixedLines = lines.map(line => prefix + line)
      const newSelection = prefixedLines.join('\n')

      const newValue = beforeSelection + newSelection + afterSelection
      onChange(newValue)

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start, start + newSelection.length)
      }, 1)
    },
    [onChange, value]
  )

  /** 커서 위치에 텍스트 삽입 */
  const insertTextAtCursor = useCallback(
    (text: string) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      const newValue = value.substring(0, start) + text + value.substring(end)
      onChange(newValue)

      setTimeout(() => {
        const newCursor = start + text.length
        textarea.focus()
        textarea.setSelectionRange(newCursor, newCursor)
      }, 0)
    },
    [onChange, value]
  )

  /** 클립보드 이미지 업로드 후 마크다운 삽입 */
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      try {
        const items = e.clipboardData?.items
        if (!items) return

        if (items.length !== 1) {
          throw new Error('이미지 붙여 넣기 중 오류가 발생 했습니다!')
        }

        const item = items[0]
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file) {
            const uploadResult = await imageUploadMutation.mutateAsync(
              file.name
            )

            if (!uploadResult.data) {
              throw new Error('이미지 업로드 URL 생성 실패')
            }

            await fetch(uploadResult.data.uploadUrl, {
              method: 'PUT',
              headers: { 'Content-Type': file.type },
              body: file
            })

            const markdownImage = `![이미지](${uploadResult.data.accessUrl})`
            insertTextAtCursor(markdownImage)
          }
        }
      } catch (error) {
        console.error(error)
        openModal(
          '에러',
          '이미지 붙여넣기 중 오류가 발생했습니다. 다시 시도해 주세요.'
        )
      }
    },
    [imageUploadMutation, insertTextAtCursor, openModal]
  )

  return {
    textareaRef,
    insertMarkdown,
    insertLinePrefix,
    insertTextAtCursor,
    handlePaste
  }
}
