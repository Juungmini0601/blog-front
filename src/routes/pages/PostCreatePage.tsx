import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import MarkDownEditor from '@/components/posts/MarkDownEditor.tsx'
import usePostCreate from '@/hooks/posts/usePostCreate.ts'
import PostTitleInput from '@/components/posts/PostTitleInput.tsx'
import PostThumbnailInput from '@/components/posts/PostThumbnailInput.tsx'
import PostSeriesInput from '@/components/posts/PostSeriesInput.tsx'
import PostPublicInput from '@/components/posts/PostPublicInput.tsx'
import PostPreview from '@/components/posts/PostPreview.tsx'

export default function PostCreatePage() {
  const {
    register,
    setValue,
    errors,
    watchedValues,
    userSeries,
    selectedSeries,
    handleSaveDraft,
    isCreatingDraft,
    isUpdatingDraft,
    handleFormSubmit
  } = usePostCreate()

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
                  isLoading={isCreatingDraft || isUpdatingDraft}
                />

                <PostThumbnailInput
                  field={register('thumbnailUrl')}
                  error={errors.thumbnailUrl?.message}
                  isLoading={isCreatingDraft || isUpdatingDraft}
                />

                <div className="flex justify-between">
                  <PostSeriesInput
                    value={watchedValues.seriesId}
                    onChange={value => setValue('seriesId', value)}
                    series={userSeries || []}
                    isLoading={isCreatingDraft || isUpdatingDraft}
                    error={errors.seriesId?.message}
                  />

                  <PostPublicInput
                    checked={watchedValues.isPublic}
                    onCheckedChange={checked => setValue('isPublic', checked)}
                    isLoading={isCreatingDraft || isUpdatingDraft}
                  />
                </div>

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

              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  disabled={isCreatingDraft || isUpdatingDraft}
                  onClick={handleSaveDraft}>
                  임시 저장
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  onClick={handleFormSubmit}>
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
