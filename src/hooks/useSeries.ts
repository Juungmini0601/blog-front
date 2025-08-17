import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createSeries,
  deleteSeries,
  getUserSeries,
  updateSeries
} from '@/api/series'
import type { CreateSeriesRequest } from '@/type/series.ts'

function useGetUserSeries(userId: number) {
  return useQuery({
    queryKey: ['series', 'user', userId],
    queryFn: async () => {
      const response = await getUserSeries(userId)
      return response.data
    },
    enabled: !!userId
  })
}

function useCreateSeries() {
  return useMutation({
    mutationFn: (request: CreateSeriesRequest) => createSeries(request)
  })
}

function useUpdateSeries() {
  return useMutation({
    mutationFn: ({
      seriesId,
      request
    }: {
      seriesId: number
      request: CreateSeriesRequest
    }) => updateSeries(seriesId, request)
  })
}

function useDeleteSeries() {
  return useMutation({
    mutationFn: (seriesId: number) => deleteSeries(seriesId)
  })
}

export { useGetUserSeries, useCreateSeries, useUpdateSeries, useDeleteSeries }
