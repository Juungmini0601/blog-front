import { apiClient, type ApiResponse } from '@/api/index.ts'
import type { CreateSeriesRequest, SeriesItemResponse } from '@/type/series.ts'

async function getUserSeries(
  userId: number
): Promise<ApiResponse<SeriesItemResponse[]>> {
  return apiClient.get(`/v1/series/${userId}`)
}

async function createSeries(request: CreateSeriesRequest) {
  return apiClient.post('/v1/series', { ...request })
}

async function updateSeries(seriesId: number, request: CreateSeriesRequest) {
  return apiClient.put(`/v1/series/${seriesId}`, { ...request })
}

async function deleteSeries(seriesId: number) {
  return apiClient.delete(`/v1/series/${seriesId}`)
}

export { getUserSeries, createSeries, updateSeries, deleteSeries }
