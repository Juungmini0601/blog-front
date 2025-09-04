import { useDeletePost, useGetPostDetail } from '@/hooks/usePost'
import { Link, useNavigate, useParams } from 'react-router'
import MarkdownPreview from '@/components/posts/MarkdownPreview.tsx'
import { format } from 'date-fns'
import { Separator } from '@radix-ui/react-separator'
import { type GetPostResponse } from '@/type/post'
import Confirm from '@/components/shared/Confirm.tsx'
import { Button } from '@/components/ui/button'
import CommentForm from '@/components/comments/CommentForm'
import useUserAPI from '@/hooks/useUser'
import { useCommentsController } from '@/hooks/comments/useComment'
import { useLikes } from '@/hooks/likes/useLikes'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart } from 'lucide-react'
import CommentList from '@/components/comments/CommentList'

function MenuText({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <span
      className="cursor-pointer hover:text-primary"
      onClick={onClick}>
      {text}
    </span>
  )
}

function PostDetail({
  data,
  postId
}: {
  data: GetPostResponse
  postId: number
}) {
  const formattedDate = format(new Date(data.createdAt), 'yyyy년 MM월 dd일')
  const navigate = useNavigate()
  const deletePostMutation = useDeletePost()
  const { user } = useUserAPI()

  const { handleLikePost, handleUnlikePost } = useLikes(postId)
  const {
    comments,
    isCommentsLoading,
    newComment,
    setNewComment,
    editingCommentId,
    setEditingCommentId,
    editingContent,
    setEditingContent,
    handleCreateComment,
    startEdit,
    saveEdit,
    removeComment
  } = useCommentsController(postId)

  const handleDeletePost = async () => {
    await deletePostMutation.mutateAsync(postId)
    navigate('/')
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {data.title}
        </h1>

        <div className="pt-4 flex flex-wrap justify-between items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Link to={`/blog/${data.userId}/posts`}>
              <span className="font-medium text-foreground">
                {data.userNickname}
              </span>
            </Link>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
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

      <div className="my-8">
        <div className="flex items-center gap-8">
          {/* 프로필 이미지: 없으면 기본 아이콘 */}
          <Avatar className="w-20 h-20">
            {data.userProfileImageUrl ? (
              <AvatarImage
                src={data.userProfileImageUrl}
                alt="프로필 이미지"
              />
            ) : (
              <AvatarFallback>
                {/* 기본 아이콘: 이니셜 또는 유저 아이콘 */}
                <span className="text-lg">{data.userNickname?.[0] || 'U'}</span>
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <Link to={`/blog/${data.userId}/posts`}>
              <div className="font-semibold text-lg">{data.userNickname}</div>
            </Link>
            {/* 자기소개가 있을 때만 표시 */}
            {data.userIntroduction && (
              <div className="text-sm text-muted-foreground mt-1">
                {data.userIntroduction}
              </div>
            )}
          </div>
        </div>
        <Separator className="my-6" />
      </div>

      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          {data.isLiked ? (
            <Button
              onClick={handleUnlikePost}
              className="cursor-pointer">
              <Heart className="w-5 h-5 fill-current" />
              <span>{data.likeCount}</span>
            </Button>
          ) : (
            <Button
              onClick={handleLikePost}
              className="cursor-pointer">
              <Heart className="w-5 h-5" />
              <span>{data.likeCount}</span>
            </Button>
          )}
        </div>

        <CommentForm
          value={newComment}
          onChange={value => setNewComment(value)}
          onSubmit={handleCreateComment}
          isAuthenticated={!!user?.userId}
        />

        <Separator className="my-4 border" />

        <CommentList
          comments={comments}
          isLoading={isCommentsLoading}
          currentUserId={user?.userId}
          editingCommentId={editingCommentId}
          editingContent={editingContent}
          onChangeEditingContent={value => setEditingContent(value)}
          onStartEdit={(id, content) => startEdit(id, content)}
          onSaveEdit={saveEdit}
          onCancelEdit={() => {
            setEditingCommentId(null)
            setEditingContent('')
          }}
          onDelete={id => removeComment(id)}
        />
      </div>
    </div>
  )
}

function NotFound() {
  return <div>게시글을 찾을 수 없습니다.</div>
}

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

  return (
    <PostDetail
      data={data}
      postId={numberPostId}
    />
  )
}
