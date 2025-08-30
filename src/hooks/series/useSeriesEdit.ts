import { useNavigate } from 'react-router'
import useUserAPI from '@/hooks/useUser.ts'
import useUpdateSeriesForm from '@/hooks/form/useUpdateSeriesForm.ts'
import { useDeleteSeries, useGetSeries } from '@/hooks/useSeries.ts'
import { useEffect } from 'react'

export default function useSeriesEdit(seriesId: number) {
  const navigate = useNavigate()
  const { user } = useUserAPI()
  const formHook = useUpdateSeriesForm(seriesId)

  const { data: sereis, isLoading, error } = useGetSeries(seriesId)
  const deleteSeriesMutation = useDeleteSeries()

  useEffect(() => {
    if (sereis) {
      formHook.setValue('name', sereis.name)
    }
  }, [formHook, sereis])

  const handleConfirmDelete = async () => {
    await deleteSeriesMutation.mutateAsync(seriesId)
    const userId = user?.userId
    if (userId) navigate(`/blog/${userId}/posts`)
    else navigate('/')
  }

  return {
    isLoading,
    hasError: error,
    sereis,
    formProps: formHook,
    deleteProps: {
      deleteSeriesMutation,
      onConfirmDelete: handleConfirmDelete
    }
  }
}
