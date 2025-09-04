import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import MarkDownEditor from '@/components/posts/MarkDownEditor.tsx'
import PostTitleInput from '@/components/posts/PostTitleInput.tsx'
import PostThumbnailInput from '@/components/posts/PostThumbnailInput.tsx'
import PostSeriesInput from '@/components/posts/PostSeriesInput.tsx'
import PostPublicInput from '@/components/posts/PostPublicInput.tsx'
import PostPreview from '@/components/posts/PostPreview.tsx'
import { useParams } from 'react-router'
import usePostUpdateForm from '@/hooks/form/usePostUpdateForm'
import { useGetUserSeries } from '@/hooks/useSeries'
import useUserAPI from '@/hooks/useUser'

export default function PostUpdatePage() {
  const { postId } = useParams()
  const numberPostId = Number(postId)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    onSubmit,
    isLoading
  } = usePostUpdateForm(numberPostId)

  const watchedValues = watch()

  // 사용자 시리즈 불러오기 및 선택된 시리즈 계산
  const { user } = useUserAPI()
  const userId = user?.userId
  const { data: userSeries = [] } = useGetUserSeries(userId ? userId : 0)
  const selectedSeries = userSeries?.find(
    s => s.seriesId === watchedValues.seriesId
  )

  if (!postId) {
    return (
      <div className="container mx-auto px-4 py-10">잘못된 접근입니다.</div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">불러오는 중입니다...</div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 space-y-6">
            <Card>
              <CardContent className="space-y-4">
                <PostTitleInput
                  field={register('title')}
                  error={errors?.title?.message}
                  currentLength={watchedValues.title?.length || 0}
                  isLoading={isLoading}
                />

                <PostThumbnailInput
                  field={register('thumbnailUrl')}
                  error={errors.thumbnailUrl?.message}
                  isLoading={isLoading}
                />

                <div className="flex justify-between">
                  <PostSeriesInput
                    value={watchedValues.seriesId}
                    onChange={value => setValue('seriesId', value)}
                    series={userSeries || []}
                    isLoading={isLoading}
                    error={errors.seriesId?.message}
                  />

                  <PostPublicInput
                    checked={watchedValues.isPublic}
                    onCheckedChange={checked => setValue('isPublic', checked)}
                    isLoading={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>내용 수정</CardTitle>
              </CardHeader>
              <CardContent>
                <MarkDownEditor
                  value={watchedValues.content}
                  onChange={v =>
                    setValue('content', v, {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }
                  errorMessage={errors.content?.message}
                />
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  onClick={handleSubmit(onSubmit)}>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
              </CardFooter>
            </Card>
          </div>

          <PostPreview
            title={watchedValues.title}
            thumbnailUrl={watchedValues.thumbnailUrl}
            content={watchedValues.content}
            isPublic={watchedValues.isPublic}
            selectedSeries={selectedSeries}
          />
        </div>
      </div>
    </div>
  )
}
