import { apiClient } from '@/api/index.ts'
import type { ImageUploadResponse } from '@/type/image.ts'

async function getImageUploadUrl(filename: string) {
  return apiClient.get<ImageUploadResponse>('/api/v1/images/upload-url', {
    filename
  })
}

export { getImageUploadUrl }
