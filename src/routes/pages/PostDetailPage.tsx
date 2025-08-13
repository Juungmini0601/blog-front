import { useDeletePost, useGetPostDetail } from '@/hooks/usePost'
import { useNavigate, useParams } from 'react-router'
import MarkdownPreview from '@/components/MarkdownPreview'
import { format } from 'date-fns'
import { Separator } from '@radix-ui/react-separator'
import { useModalStore } from '@/store/modalStore'
import { type GetPostResponse } from '@/type/post'
import Confirm from '@/components/Confirm'

function MenuText({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <span
      className="cursor-pointer hover:text-primary"
      onClick={onClick}>
      {text}
    </span>
  )
}

function PostDetail({ data }: { data: GetPostResponse }) {
  const { openModal } = useModalStore()
  const formattedDate = format(new Date(data.createdAt), 'yyyy년 MM월 dd일')
  const navigate = useNavigate()
  const deletePostMutation = useDeletePost()

  const handleDeletePost = async () => {
    await deletePostMutation.mutateAsync(data.postId)
    navigate('/')
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {data.title}
        </h1>

        <div className="flex flex-wrap justify-between items-center  gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">
              {data.userNickname}
            </span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MenuText
              text="통계"
              onClick={() =>
                openModal('통계', '아직 구현되지 않은 기능입니다 ㅠㅠ')
              }
            />
            <MenuText
              text="수정"
              onClick={() => navigate(`/posts/${data.postId}/update`)}
            />
            <Confirm
              title="삭제"
              description="이 게시글을 삭제하시겠습니까?"
              confirmText="삭제"
              cancelText="취소"
              onConfirm={handleDeletePost}
              trigger={<MenuText text="삭제" />}
            />
          </div>
        </div>
      </div>

      <Separator className="my-4 border" />

      {/* 콘텐츠: Markdown 렌더 */}
      <article className="prose dark:prose-invert max-w-none">
        <MarkdownPreview content={data.content} />
      </article>
    </div>
  )
}

function NotFound() {
  return <div>게시글을 찾을 수 없습니다.</div>
}
/**
 * 게시글 상세 페이지
 * - URL의 postId로 데이터를 조회하여 제목/작성자/날짜/액션, 좋아요 버튼, 본문(Markdown) 렌더링
 */
export default function PostDetailPage() {
  const { postId } = useParams()
  const numberPostId = Number(postId)

  if (!postId) {
    return <NotFound />
  }

  const { data, isLoading } = useGetPostDetail(numberPostId)

  if (isLoading || !data) {
    return (
      <div className="container mx-auto px-4 py-10">불러오는 중입니다...</div>
    )
  }

  return <PostDetail data={data} />
}
