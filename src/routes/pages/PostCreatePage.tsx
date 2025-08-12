import usePostCreateForm from '@/hooks/form/usePostCreateForm'
import { Save, Globe, Lock } from 'lucide-react'
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
import MarkDownEditor from '@/components/MarkDownEditor'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

// 더미 시리즈 데이터
const seriesList = [
  { id: 1, name: 'React 심화 학습' },
  { id: 2, name: 'TypeScript 완전 정복' },
  { id: 3, name: 'Next.js 실전 가이드' },
  { id: 4, name: 'UI/UX 디자인 패턴' }
]

export default function PostCreatePage() {
  const { register, handleSubmit, watch, setValue, errors, onSubmit } =
    usePostCreateForm()
  const watchedValues = watch()

  // content 필드는 RHF 기본값이 있으므로 setValue로 제어 가능

  // 선택된 시리즈 정보
  const selectedSeries = seriesList.find(
    series => series.id === watchedValues.seriesId
  )

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

                {/* 마크다운 미리보기 TODO 컴포넌트 분리 */}
                <div
                  className="prose dark:prose-invert max-w-none"
                  style={{
                    fontFamily:
                      '"FC Script","Kosugi Maru","FC Sans","Noto Sans SC","Noto Sans TC","Noto Sans JP",ui-rounded,system-ui-rounded,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"SF Pro Text","SF UI Text","Segoe UI","Segoe UI Emoji",Roboto,Meiryo,"Microsoft YaHei","Microsoft YaHei UI","Microsoft JhengHei","Microsoft JhengHei UI","Apple SD Gothic Neo",NanumGothic,"나눔고딕","Malgun Gothic","맑은 고딕",fantasy',
                    fontSize: '16px',
                    lineHeight: '1.7'
                  }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      // 제목 스타일링 (h1-h6)
                      h1: ({ children, ...props }) => (
                        <h1
                          className="text-3xl font-bold mb-4 mt-6 first:mt-0 text-primary"
                          {...props}>
                          {children}
                        </h1>
                      ),
                      h2: ({ children, ...props }) => (
                        <h2
                          className="text-2xl font-bold mb-3 mt-5 text-primary"
                          {...props}>
                          {children}
                        </h2>
                      ),
                      h3: ({ children, ...props }) => (
                        <h3
                          className="text-xl font-bold mb-2 mt-4 text-primary"
                          {...props}>
                          {children}
                        </h3>
                      ),
                      h4: ({ children, ...props }) => (
                        <h4
                          className="text-lg font-bold mb-2 mt-3 text-primary"
                          {...props}>
                          {children}
                        </h4>
                      ),
                      h5: ({ children, ...props }) => (
                        <h5
                          className="text-base font-bold mb-1 mt-3 text-primary"
                          {...props}>
                          {children}
                        </h5>
                      ),
                      h6: ({ children, ...props }) => (
                        <h6
                          className="text-sm font-bold mb-1 mt-2 text-primary"
                          {...props}>
                          {children}
                        </h6>
                      ),
                      // 볼드 텍스트 스타일링
                      strong: ({ children, ...props }) => (
                        <strong
                          style={{ backgroundColor: '#d9ff7d' }}
                          className="font-bold px-1 py-0.5 rounded"
                          {...props}>
                          {children}
                        </strong>
                      ),
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
                            className="bg-muted px-1 py-0.5 rounded text-sm text-primary"
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
                      // 링크 스타일링
                      a: ({ href, children, ...props }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#01329d' }}
                          className="hover:brightness-125 transition-all duration-200 underline"
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
                      ),
                      // 순서 없는 리스트 (ul)
                      ul: ({ children, ...props }) => (
                        <ul
                          className="list-disc pl-6 mb-3 space-y-1"
                          {...props}>
                          {children}
                        </ul>
                      ),
                      // 순서 있는 리스트 (ol)
                      ol: ({ children, ...props }) => (
                        <ol
                          className="list-decimal pl-6 mb-3 space-y-1"
                          {...props}>
                          {children}
                        </ol>
                      ),
                      // 리스트 아이템 (li)
                      li: ({ children, ...props }) => (
                        <li
                          className="leading-relaxed"
                          {...props}>
                          {children}
                        </li>
                      ),
                      // 테이블
                      table: ({ children, ...props }) => (
                        <div className="overflow-x-auto mb-4">
                          <table
                            className="min-w-full border-collapse border border-border"
                            {...props}>
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children, ...props }) => (
                        <thead
                          className="bg-muted"
                          {...props}>
                          {children}
                        </thead>
                      ),
                      tbody: ({ children, ...props }) => (
                        <tbody {...props}>{children}</tbody>
                      ),
                      tr: ({ children, ...props }) => (
                        <tr
                          className="border-b border-border"
                          {...props}>
                          {children}
                        </tr>
                      ),
                      th: ({ children, ...props }) => (
                        <th
                          className="border border-border px-3 py-2 text-left font-semibold"
                          {...props}>
                          {children}
                        </th>
                      ),
                      td: ({ children, ...props }) => (
                        <td
                          className="border border-border px-3 py-2"
                          {...props}>
                          {children}
                        </td>
                      ),
                      // 수평선
                      hr: ({ ...props }) => (
                        <hr
                          className="my-6 border-t border-border"
                          {...props}
                        />
                      ),
                      // 프리포맷 텍스트 (코드 블록 컨테이너)
                      pre: ({ children, ...props }) => (
                        <pre
                          className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm"
                          {...props}>
                          {children}
                        </pre>
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
