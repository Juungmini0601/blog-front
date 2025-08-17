import { useQuery } from '@tanstack/react-query'
import { getUserSeries } from '@/api/series'

function useGetUserSeries(userId: number) {
  return useQuery({
    queryKey: ['series', 'user', userId],
    queryFn: async () => {
      const response = await getUserSeries(userId)
      return response.data
    },
    enabled: !!userId // userId가 있을 때만 실행
  })
}

export { useGetUserSeries }
