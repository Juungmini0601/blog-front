import usePostCreateForm from '@/hooks/form/usePostCreateForm'
import { useCallback, useState } from 'react'
import {
  Bold,
  Italic,
  Link,
  Code,
  ImageIcon,
  Save,
  Eye,
  Globe,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Textarea } from '@/components/ui/textarea'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'

// 더미 시리즈 데이터
const seriesList = [
  { id: 1, name: 'React 심화 학습' },
  { id: 2, name: 'TypeScript 완전 정복' },
  { id: 3, name: 'Next.js 실전 가이드' },
  { id: 4, name: 'UI/UX 디자인 패턴' }
]

export default function PostCreatePage() {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const { register, handleSubmit, watch, setValue, errors, onSubmit } =
    usePostCreateForm()
  const watchedValues = watch()

  // TODO 초기 데이터 로드
  // TODO AutoSave
  // TODO 단축ㄷ키

  // 마크다운 에디터 툴바
  const insertMarkdown = useCallback(
    (before: string, after: string) => {
      const textarea = document.getElementById('content') as HTMLTextAreaElement
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = textarea.value.substring(start, end)
      const newText = before + selectedText + after

      const newValue =
        textarea.value.substring(0, start) +
        newText +
        textarea.value.substring(end)
      setValue('content', newValue)

      // 커서 위치 조정
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + selectedText.length
        )
      }, 0)
    },
    [setValue]
  )

  const toolbarActions = [
    { icon: Bold, action: () => insertMarkdown('**', '**'), tooltip: '굵게' },
    { icon: Italic, action: () => insertMarkdown('*', '*'), tooltip: '기울임' },
    {
      icon: Code,
      action: () => insertMarkdown('`', '`'),
      tooltip: '인라인 코드'
    },
    {
      icon: Link,
      action: () => insertMarkdown('[', '](url)'),
      tooltip: '링크'
    },
    // { icon: List, action: () => insertMarkdown('- '), tooltip: '리스트' },
    {
      icon: ImageIcon,
      action: () => insertMarkdown('![alt](', ')'),
      tooltip: '이미지'
    }
  ]

  const selectedSeries = seriesList.find(
    series => series.id === watchedValues.seriesId
  )

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">새 글 작성</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="xl:hidden">
                <Eye className="h-4 w-4 mr-2" />
                {isPreviewMode ? '편집' : '미리보기'}
              </Button>
              <Button
                variant="outline"
                onClick={handleSubmit(onSubmit)}>
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* 좌측 에디터 영역 */}
          <div
            className={`xl:col-span-7 space-y-6 ${isPreviewMode ? 'hidden xl:block' : ''}`}>
            {/* 메타 정보 카드 */}
            <Card>
              <CardHeader>
                <CardTitle>글 정보</CardTitle>
              </CardHeader>
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

            {/* 내용 작성 카드 */}
            <Card>
              <CardHeader>
                <CardTitle>내용 작성</CardTitle>
                {/* 마크다운 툴바 */}
                <div className="flex items-center gap-1 pt-2 border-t">
                  {toolbarActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={action.action}
                      title={action.tooltip}>
                      <action.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Textarea
                    id="content"
                    placeholder="마크다운으로 내용을 작성하세요..."
                    className={`min-h-[400px] font-mono ${errors.content ? 'border-destructive' : ''}`}
                    {...register('content')}
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive">
                      {errors.content.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 우측 미리보기 영역 */}
          <div
            className={`xl:col-span-5 ${!isPreviewMode ? 'hidden xl:block' : ''}`}>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>미리보기</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 메타 정보 미리보기 */}
                <div className="space-y-2 pb-4 border-b">
                  <h1 className="text-2xl font-bold">
                    {watchedValues.title || '제목을 입력하세요'}
                  </h1>

                  {watchedValues.thumbnailUrl && (
                    <img
                      src={watchedValues.thumbnailUrl || '/placeholder.svg'}
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

                {/* 마크다운 미리보기 */}
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // 코드 블록/인라인을 className의 language- 유무로 구분하여 스타일링
                      code: ({ node, className, children, ...props }) => {
                        const isBlock = /language-(\w+)/.test(className || '')
                        return isBlock ? (
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                            <code
                              className={className}
                              {...props}>
                              {children}
                            </code>
                          </pre>
                        ) : (
                          <code
                            className="bg-muted px-1 py-0.5 rounded text-sm"
                            {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}>
                    {watchedValues.content ||
                      '*내용을 입력하면 여기에 미리보기가 표시됩니다.*'}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
