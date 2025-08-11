import usePostCreateForm from '@/hooks/form/usePostCreateForm'
import { useCallback, useRef, useState } from 'react'
import {
  Bold,
  Italic,
  Link,
  Code,
  ImageIcon,
  Save,
  Eye,
  Globe,
  Lock,
  Heading1,
  Heading2,
  Heading3,
  List
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
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import useImage from '@/hooks/useImage'
import { ResultType } from '@/api/index'

// 더미 시리즈 데이터
const seriesList = [
  { id: 1, name: 'React 심화 학습' },
  { id: 2, name: 'TypeScript 완전 정복' },
  { id: 3, name: 'Next.js 실전 가이드' },
  { id: 4, name: 'UI/UX 디자인 패턴' }
]

export default function PostCreatePage() {
  // 미리보기 모드 상태 (모바일에서 에디터/미리보기 전환용)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // 폼 상태 관리
  const { register, handleSubmit, watch, setValue, errors, onSubmit } =
    usePostCreateForm()
  const watchedValues = watch()

  // 텍스트 영역 참조 (마크다운 에디터용)
  const { ref: content_rhf_ref, ...content_register } = register('content')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // 이미지 업로드 훅
  const { imageUploadMutation } = useImage()

  /**
   * 마크다운 문법 삽입 함수
   * 선택된 텍스트를 지정된 마크다운 문법으로 감싸는 기능
   */
  const insertMarkdown = useCallback(
    (before: string, after: string = '') => {
      const textarea = textareaRef.current
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

      // 커서 위치 조정 (삽입된 텍스트 내부로 이동)
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

  /**
   * 줄 단위 접두사 삽입 함수
   * 헤딩(#), 리스트(-) 등을 각 줄 앞에 추가하는 기능
   */
  const insertLinePrefix = useCallback(
    (prefix: string) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const value = textarea.value

      const beforeSelection = value.slice(0, start)
      const selection = value.slice(start, end)
      const afterSelection = value.slice(end)

      // 선택된 텍스트를 줄 단위로 분리하여 각 줄에 접두사 추가
      const lines = selection.split('\n')
      const prefixedLines = lines.map(line => prefix + line)
      const newSelection = prefixedLines.join('\n')

      const newValue = beforeSelection + newSelection + afterSelection
      setValue('content', newValue)

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start, start + newSelection.length)
      }, 0)
    },
    [setValue]
  )

  /**
   * 커서 위치에 텍스트 삽입 함수
   * 이미지 URL 등을 현재 커서 위치에 삽입하는 기능
   */
  const insertTextAtCursor = useCallback(
    (text: string) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const value = textarea.value

      const newValue = value.substring(0, start) + text + value.substring(end)
      setValue('content', newValue)

      setTimeout(() => {
        const newCursor = start + text.length
        textarea.focus()
        textarea.setSelectionRange(newCursor, newCursor)
      }, 0)
    },
    [setValue]
  )

  // 마크다운 에디터 툴바 버튼 설정
  const toolbarActions = [
    {
      icon: Heading1,
      action: () => insertLinePrefix('# '),
      tooltip: '제목 1'
    },
    {
      icon: Heading2,
      action: () => insertLinePrefix('## '),
      tooltip: '제목 2'
    },
    {
      icon: Heading3,
      action: () => insertLinePrefix('### '),
      tooltip: '제목 3'
    },
    {
      icon: Bold,
      action: () => insertMarkdown('**', '**'),
      tooltip: '굵게'
    },
    {
      icon: Italic,
      action: () => insertMarkdown('*', '*'),
      tooltip: '기울임'
    },
    {
      icon: Code,
      action: () => insertMarkdown('`', '`'),
      tooltip: '인라인 코드'
    },
    {
      icon: Link,
      action: () => insertMarkdown('[링크 텍스트](', ')'),
      tooltip: '링크'
    },
    {
      icon: List,
      action: () => insertLinePrefix('- '),
      tooltip: '목록'
    },
    {
      icon: ImageIcon,
      action: () => insertMarkdown('![이미지 설명](', ')'),
      tooltip: '이미지'
    }
  ]

  // 선택된 시리즈 정보
  const selectedSeries = seriesList.find(
    series => series.id === watchedValues.seriesId
  )

  /**
   * 클립보드 이미지 붙여넣기 처리 함수
   * 이미지를 클립보드에서 붙여넣으면 자동으로 업로드하고 마크다운 삽입
   */
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      try {
        const items = e.clipboardData?.items
        if (!items) return

        // 클립보드 아이템 중 이미지 파일 찾기
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          if (item.kind === 'file' && item.type.startsWith('image/')) {
            e.preventDefault()
            const file = item.getAsFile()
            if (!file) continue

            // 이미지 업로드 URL 발급
            const uploadResult = await imageUploadMutation.mutateAsync(
              file.name
            )
            if (
              uploadResult.result !== ResultType.SUCCESS ||
              !uploadResult.data
            ) {
              throw new Error('이미지 업로드 URL 생성 실패')
            }

            // 실제 파일 업로드 (S3 등)
            await fetch(uploadResult.data.uploadUrl, {
              method: 'PUT',
              headers: { 'Content-Type': file.type },
              body: file
            })

            // 마크다운 이미지 문법으로 삽입
            const markdownImage = `![이미지](${uploadResult.data.accessUrl})`
            insertTextAtCursor(markdownImage)
            break
          }
        }
      } catch (error) {
        console.error('이미지 붙여넣기 오류:', error)
        alert('이미지 붙여넣기 중 오류가 발생했습니다. 다시 시도해 주세요.')
      }
    },
    [imageUploadMutation, insertTextAtCursor]
  )

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">새 글 작성</h1>
            <div className="flex items-center gap-2">
              {/* 모바일용 미리보기 전환 버튼 */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="xl:hidden">
                <Eye className="h-4 w-4 mr-2" />
                {isPreviewMode ? '편집' : '미리보기'}
              </Button>
              {/* 저장 버튼 */}
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
            {/* 글 메타정보 입력 카드 */}
            <Card>
              <CardHeader>
                <CardTitle>글 정보</CardTitle>
              </CardHeader>
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

                {/* 공개/비공개 설정 */}
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
                {/* 마크다운 에디터 툴바 */}
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
                    className={`min-h-[400px] font-mono whitespace-pre-wrap resize-none leading-relaxed ${errors.content ? 'border-destructive' : ''}`}
                    style={{
                      lineHeight: '1.6',
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}
                    {...content_register}
                    ref={el => {
                      // React Hook Form의 ref와 로컬 ref를 병합
                      if (typeof content_rhf_ref === 'function') {
                        content_rhf_ref(el)
                      } else if (content_rhf_ref) {
                        // @ts-expect-error: 타입 호환성 문제 해결
                        content_rhf_ref.current = el
                      }
                      textareaRef.current = el
                    }}
                    onPaste={handlePaste}
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
                {/* 글 메타정보 미리보기 */}
                <div className="space-y-2 pb-4 border-b">
                  <h1 className="text-2xl font-bold">
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

                {/* 마크다운 미리보기 */}
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      // 코드 블록 스타일링
                      code: ({ className, children, ...props }) => {
                        const isCodeBlock = /language-(\w+)/.test(
                          className || ''
                        )
                        return isCodeBlock ? (
                          <code
                            className={className}
                            {...props}>
                            {children}
                          </code>
                        ) : (
                          <code
                            className="bg-muted px-1 py-0.5 rounded text-sm"
                            {...props}>
                            {children}
                          </code>
                        )
                      },
                      // 인용문 스타일링
                      blockquote: ({ children, ...props }) => (
                        <blockquote
                          className="border-l-4 border-primary/20 bg-muted/30 pl-4 py-2 italic"
                          {...props}>
                          {children}
                        </blockquote>
                      ),
                      // 이미지 반응형 처리
                      img: ({ alt, ...props }) => (
                        <img
                          className="max-w-full h-auto rounded-lg"
                          alt={alt || '이미지'}
                          {...props}
                        />
                      ),
                      // 링크 외부 열기 설정
                      a: ({ href, children, ...props }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                          {...props}>
                          {children}
                        </a>
                      ),
                      // 문단 처리 - 개행 보존 및 문단 간 여백
                      p: ({ children, ...props }) => (
                        <p
                          className="leading-relaxed mb-3 last:mb-0"
                          {...props}>
                          {children}
                        </p>
                      )
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
