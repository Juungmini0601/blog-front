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
import { useParams } from 'react-router'
import usePostUpdateForm from '@/hooks/form/usePostUpdateForm'

// TODO 변경 예정 더미 시리즈 데이터
const seriesList = [
  { id: 1, name: 'React 심화 학습' },
  { id: 2, name: 'TypeScript 완전 정복' },
  { id: 3, name: 'Next.js 실전 가이드' },
  { id: 4, name: 'UI/UX 디자인 패턴' }
]

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
  const selectedSeries = seriesList.find(
    series => series.id === watchedValues.seriesId
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
                      <SelectItem value="none">시리즈 없음</SelectItem>
                      {seriesList.map(series => (
                        <SelectItem
                          key={series.id}
                          value={series.id.toString()}>
                          {series.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
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

          <div className="xl:col-span-5">
            <Card className="sticky top-6">
              <CardContent className="space-y-4">
                <div className="space-y-2 pb-4 border-b">
                  <h1 className="text-2xl font-bold text-primary">
                    {watchedValues.title || '제목을 입력하세요'}
                  </h1>

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
