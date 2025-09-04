import { Globe, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import MarkdownPreview from '@/components/posts/MarkdownPreview.tsx'

interface PostPreviewProps {
  title?: string
  thumbnailUrl?: string
  content: string
  isPublic: boolean
  selectedSeries?: {
    name: string
    seriesId: number
  } | null
}

export default function PostPreview({
  title,
  thumbnailUrl,
  content,
  isPublic,
  selectedSeries
}: PostPreviewProps) {
  return (
    <div className="xl:col-span-5">
      <Card className="sticky top-6">
        <CardContent className="space-y-4">
          {/* 글 메타정보 미리보기 */}
          <div className="space-y-2 pb-4 border-b">
            <h1 className="text-2xl font-bold text-primary">
              {title || '제목을 입력하세요'}
            </h1>

            {/* 썸네일 이미지 */}
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
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
                {isPublic ? (
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

          <MarkdownPreview content={content} />
        </CardContent>
      </Card>
    </div>
  )
}
