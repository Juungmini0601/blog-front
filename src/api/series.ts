import { apiClient, type ApiResponse } from '@/api/index.ts'
import type { SeriesItemResponse } from '@/type/series.ts'

async function getUserSeries(
  userId: number
): Promise<ApiResponse<SeriesItemResponse[]>> {
  return apiClient.get(`/v1/series/${userId}`)
}

export { getUserSeries }
