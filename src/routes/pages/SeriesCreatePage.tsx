import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import useCreateSeriesForm from '@/hooks/form/useCreateSeriesForm'
import { Loader2, Save } from 'lucide-react'
import SeriesNameInput from '@/components/series/SeriesNameInput.tsx'

export default function SeriesCreatePage() {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } =
    useCreateSeriesForm()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>시리즈 생성</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SeriesNameInput
              field={register('name')}
              error={errors?.name?.message}
            />
          </CardContent>
          <CardFooter>
            <Button
              className="cursor-pointer"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}>
              {isSubmitting ? (
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
