import { Globe, Lock, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import MarkDownEditor from '@/components/posts/MarkDownEditor.tsx'
import MarkdownPreview from '@/components/posts/MarkdownPreview.tsx'
import usePostCreate from '@/hooks/posts/usePostCreate.ts'

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
          {/* 좌측 에디터 영역 */}
          <div className="xl:col-span-7 space-y-6">
            {/* 글 메타정보 입력 카드 */}
            <Card>
              <CardContent className="space-y-4">
                {/* 제목 입력 */}
                <div className="space-y-2">
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    placeholder="글 제목을 입력하세요"
                    {...register('title')}
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {watchedValues.title?.length || 0}/255자
                  </p>
                </div>

                {/* 썸네일 URL 입력 */}
                <div className="space-y-2">
                  <Label htmlFor="thumbnailUrl">썸네일 URL</Label>
                  <Input
                    id="thumbnailUrl"
                    placeholder="https://example.com/image.jpg"
                    {...register('thumbnailUrl')}
                    className={errors.thumbnailUrl ? 'border-destructive' : ''}
                  />
                  {errors.thumbnailUrl && (
                    <p className="text-sm text-destructive">
                      {errors.thumbnailUrl.message}
                    </p>
                  )}
                </div>

                {/* 시리즈 선택 */}
                <div className="space-y-2">
                  <Label htmlFor="seriesId">시리즈</Label>
                  <Select
                    value={watchedValues.seriesId?.toString() || 'none'}
                    onValueChange={value =>
                      setValue(
                        'seriesId',
                        value === 'none' ? undefined : Number.parseInt(value)
                      )
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="시리즈를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        className="cursor-pointer"
                        value="none">
                        시리즈 없음
                      </SelectItem>
                      {userSeries?.map(series => (
                        <SelectItem
                          className="cursor-pointer"
                          key={series.seriesId}
                          value={series.seriesId.toString()}>
                          {series.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 공개/비공개 설정 */}
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Switch
                    id="isPublic"
                    checked={watchedValues.isPublic}
                    onCheckedChange={checked => setValue('isPublic', checked)}
                  />
                  <Label
                    htmlFor="isPublic"
                    className="flex items-center gap-2">
                    {watchedValues.isPublic ? (
                      <>
                        <Globe className="h-4 w-4" />
                        공개
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        비공개
                      </>
                    )}
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* 내용 작성 카드 */}
            <Card>
              <CardHeader>
                <CardTitle>내용 작성</CardTitle>
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

          {/* 우측 미리보기 영역 */}
          <div className="xl:col-span-5">
            <Card className="sticky top-6">
              <CardContent className="space-y-4">
                {/* 글 메타정보 미리보기 */}
                <div className="space-y-2 pb-4 border-b">
                  <h1 className="text-2xl font-bold text-primary">
                    {watchedValues.title || '제목을 입력하세요'}
                  </h1>

                  {/* 썸네일 이미지 */}
                  {watchedValues.thumbnailUrl && (
                    <img
                      src={watchedValues.thumbnailUrl}
                      alt="썸네일"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={e => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}

                  {/* 시리즈 및 공개 상태 표시 */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {selectedSeries && (
                      <span className="bg-secondary px-2 py-1 rounded">
                        {selectedSeries.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      {watchedValues.isPublic ? (
                        <>
                          <Globe className="h-3 w-3" />
                          공개
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3" />
                          비공개
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <MarkdownPreview content={watchedValues.content} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
