import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Save, Trash2 } from 'lucide-react'
import useUpdateSeriesForm from '@/hooks/form/useUpdateSeriesForm'
import useUserAPI from '@/hooks/useUser'
import { useGetUserSeries, useDeleteSeries } from '@/hooks/useSeries'
import Confirm from '@/components/Confirm'

export default function SeriesEditPage() {
  const { seriesId } = useParams()
  const navigate = useNavigate()
  const numberSeriesId = Number(seriesId)
  const { user } = useUserAPI()

  const { register, handleSubmit, errors, isSubmitting, isLoading, onSubmit, setValue } =
    useUpdateSeriesForm(numberSeriesId)

  const userId = user?.userId ?? 0
  const { data: seriesList, isLoading: isSeriesLoading, error: seriesError } = useGetUserSeries(userId)

  const currentSeries = useMemo(() => {
    return (seriesList ?? []).find(s => s.seriesId === numberSeriesId)
  }, [seriesList, numberSeriesId])

  useEffect(() => {
    if (currentSeries) {
      setValue('name', currentSeries.name)
    }
  }, [currentSeries, setValue])

  const deleteSeriesMutation = useDeleteSeries()

  if (!seriesId || Number.isNaN(numberSeriesId)) {
    return <div className="container mx-auto px-4 py-10">잘못된 접근입니다.</div>
  }

  if (isSeriesLoading) {
    return <div className="container mx-auto px-4 py-10">불러오는 중입니다...</div>
  }

  if (seriesError || !currentSeries) {
    return (
      <div className="container mx-auto px-4 py-10">
        시리즈 정보를 불러올 수 없습니다.
      </div>
    )
  }

  const handleConfirmDelete = async () => {
    await deleteSeriesMutation.mutateAsync(numberSeriesId)
    const uid = user?.userId
    if (uid) navigate(`/blog/${uid}/posts`)
    else navigate('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>시리즈 수정</CardTitle>
            <Confirm
              title="시리즈 삭제"
              description="이 작업은 되돌릴 수 없습니다. 해당 시리즈와 연결된 정보가 영향을 받을 수 있습니다."
              confirmText="삭제"
              cancelText="취소"
              isLoading={deleteSeriesMutation.isPending}
              onConfirm={handleConfirmDelete}
              trigger={
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  disabled={deleteSeriesMutation.isPending}
                >
                  {deleteSeriesMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  삭제
                </Button>
              }
            />
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">시리즈 이름 *</Label>
              <Input
                id="name"
                placeholder="시리즈 이름을 입력하세요"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button
              className="cursor-pointer"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || isLoading}
            >
              {(isSubmitting || isLoading) ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              저장
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
