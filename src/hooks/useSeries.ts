import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createSeries,
  deleteSeries,
  getSeries,
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

function useGetSeries(seriesId: number) {
  return useQuery({
    queryKey: ['series', seriesId],
    queryFn: async () => {
      const response = await getSeries(seriesId)
      return response.data
    },
    enabled: !!seriesId
  })
}

function useCreateSeries() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateSeriesRequest) => createSeries(request),
    onSuccess: () => {
      // 시리즈 관련 쿼리 전반 무효화 (사용자별 시리즈 목록 포함)
      queryClient.invalidateQueries({ queryKey: ['series'] })
    }
  })
}

function useUpdateSeries() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      seriesId,
      request
    }: {
      seriesId: number
      request: CreateSeriesRequest
    }) => updateSeries(seriesId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] })
    }
  })
}

function useDeleteSeries() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (seriesId: number) => deleteSeries(seriesId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] })
    }
  })
}

export {
  useGetUserSeries,
  useGetSeries,
  useCreateSeries,
  useUpdateSeries,
  useDeleteSeries
}
