import React, { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

interface ImageUploaderProps {
  imageUrl: string | null | undefined
  handleImageUpload: (file: File) => void
  handleImageRemove: () => void
}

export default function ImageUploader({
  imageUrl,
  handleImageUpload,
  handleImageRemove
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)

    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file)
    }
  }

  const handleImageRemoveCallback = () => {
    handleImageRemove()

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">
          이미지를 드래그하여 업로드하거나
        </p>
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mb-2 cursor-pointer">
          이미지 업로드
        </Button>
        <p className="text-xs text-gray-500">PNG, JPG, WEBP (최대 5MB)</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="프로필 이미지 선택"
      />

      {imageUrl && (
        <Button
          type="button"
          variant="secondary"
          onClick={handleImageRemoveCallback}
          className="w-full cursor-pointer">
          <X className="w-4 h-4 mr-2" />
          이미지 제거
        </Button>
      )}
    </div>
  )
}
