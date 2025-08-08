import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 20 * 1000
    },
    mutations: {
      retry: false
    }
  }
})

export async function ensureQueryData<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>
): Promise<T> {
  return queryClient.ensureQueryData({
    queryKey,
    queryFn
  })
}

export default queryClient
