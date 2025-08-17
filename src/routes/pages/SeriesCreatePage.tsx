import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import useCreateSeriesForm from '@/hooks/form/useCreateSeriesForm'
import { Loader2, Save } from 'lucide-react'

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
            <div className="space-y-2">
              <Label htmlFor="name">시리즈 이름 *</Label>
              <Input
                id="name"
                placeholder="시리즈 이름을 입력하세요"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
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
