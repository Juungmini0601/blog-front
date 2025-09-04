import { useParams } from 'react-router'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Save, Trash2 } from 'lucide-react'
import Confirm from '@/components/shared/Confirm.tsx'
import SeriesNameInput from '@/components/series/SeriesNameInput.tsx'
import useSeriesEdit from '@/hooks/series/useSeriesEdit.ts'

export default function SeriesEditPage() {
  const { seriesId } = useParams()
  const numberSeriesId = Number(seriesId)

  const { isLoading, hasError, formProps, deleteProps } =
    useSeriesEdit(numberSeriesId)

  const { register, handleSubmit, errors, isSubmitting, onSubmit } = formProps
  const { deleteSeriesMutation, onConfirmDelete: handleConfirmDelete } =
    deleteProps

  if (!seriesId || Number.isNaN(numberSeriesId)) {
    return (
      <div className="container mx-auto px-4 py-10">잘못된 접근입니다.</div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">불러오는 중입니다...</div>
    )
  }

  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-10">
        시리즈 정보를 불러올 수 없습니다.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>시리즈 수정</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <SeriesNameInput
              field={register('name')}
              error={errors.name?.message}
            />
          </CardContent>

          <CardFooter>
            <div className="flex items-center gap-4">
              <Button
                className="cursor-pointer"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                저장
              </Button>

              <Confirm
                title="시리즈 삭제"
                description="해당 시리즈와 연결된 정보가 영향을 받을 수 있습니다."
                confirmText="삭제"
                cancelText="취소"
                isLoading={deleteSeriesMutation.isPending}
                onConfirm={handleConfirmDelete}
                trigger={
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    disabled={deleteSeriesMutation.isPending}>
                    {deleteSeriesMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    삭제
                  </Button>
                }
              />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
