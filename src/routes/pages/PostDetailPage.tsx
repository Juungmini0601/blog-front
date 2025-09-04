import { useDeletePost, useGetPostDetail, usePostAPI } from '@/hooks/usePost'
import { Link, useNavigate, useParams } from 'react-router'
import MarkdownPreview from '@/components/posts/MarkdownPreview.tsx'
import { format } from 'date-fns'
import { Separator } from '@radix-ui/react-separator'
import { useModalStore } from '@/store/modalStore'
import { type GetPostResponse } from '@/type/post'
import Confirm from '@/components/shared/Confirm.tsx'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import useUserAPI from '@/hooks/useUser'
import {
  useCreateComment,
  useDeleteComment,
  useGetComments,
  useUpdateComment
} from '@/hooks/useComment'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart } from 'lucide-react'

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
  const { openModal } = useModalStore()
  const formattedDate = format(new Date(data.createdAt), 'yyyy년 MM월 dd일')
  const navigate = useNavigate()
  const deletePostMutation = useDeletePost()
  const { likeMutation } = usePostAPI()
  const { user } = useUserAPI()
  const { data: comments = [], isLoading: isCommentsLoading } =
    useGetComments(postId)

  const createCommentMutation = useCreateComment()
  const updateCommentMutation = useUpdateComment()
  const deleteCommentMutation = useDeleteComment()
  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState('')

  const handleDeletePost = async () => {
    await deletePostMutation.mutateAsync(postId)
    navigate('/')
  }

  // 좋아요 추가
  const handleLikePost = async () => {
    try {
      await likeMutation.mutateAsync({ postId, isLiked: false })
    } catch (error) {
      console.error(error)
      openModal('알림', '요청 처리 중 문제가 발생했습니다.')
    }
  }

  // 좋아요 취소
  const handleUnlikePost = async () => {
    try {
      await likeMutation.mutateAsync({ postId, isLiked: true })
    } catch (error) {
      console.error(error)
      openModal('알림', '요청 처리 중 문제가 발생했습니다.')
    }
  }

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      openModal('알림', '내용을 입력해주세요.')
      return
    }
    try {
      await createCommentMutation.mutateAsync({
        postId,
        content: newComment
      })
      setNewComment('')
    } catch (error) {
      console.error(error)
      openModal('알림', '댓글 작성 중 문제가 발생했습니다.')
    }
  }

  const startEdit = (commentId: number, content: string) => {
    setEditingCommentId(commentId)
    setEditingContent(content)
  }

  const saveEdit = async () => {
    if (!editingCommentId) return
    if (!editingContent.trim()) {
      openModal('알림', '내용을 입력해주세요.')
      return
    }
    try {
      await updateCommentMutation.mutateAsync({
        commentId: editingCommentId,
        request: { content: editingContent }
      })
      setEditingCommentId(null)
      setEditingContent('')
    } catch (error) {
      console.error(error)
      openModal('알림', '댓글 수정 중 문제가 발생했습니다.')
    }
  }

  /**
   * 댓글 삭제 (Confirm 컴포넌트에서 호출)
   */
  const removeComment = async (commentId: number) => {
    try {
      await deleteCommentMutation.mutateAsync({ commentId, postId })
    } catch (error) {
      console.error(error)
      openModal('알림', '댓글 삭제 중 문제가 발생했습니다.')
    }
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

      {/* 좋아요 & 댓글 입력 */}
      {/* 
        좋아요 여부(isLiked)에 따라 버튼을 다르게 보여줍니다.
        - isLiked가 true면 "좋아요 취소" 버튼, false면 "좋아요" 버튼을 노출합니다.
        - 좋아요 수는 항상 표시합니다.
        - 예외 상황(데이터 없음 등)도 고려합니다.
      */}
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

        <div className="space-y-2">
          <Textarea
            placeholder={
              user?.userId ? '댓글을 입력하세요' : '로그인 후 댓글 작성 가능'
            }
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            disabled={!user?.userId}
          />
          <div className="flex justify-end">
            <Button
              className="cursor-pointer"
              onClick={handleCreateComment}
              disabled={!user?.userId}>
              댓글 등록
            </Button>
          </div>
        </div>

        <Separator className="my-4 border" />

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {isCommentsLoading ? (
            <div>댓글을 불러오는 중입니다...</div>
          ) : comments.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              첫 댓글을 남겨보세요!
            </div>
          ) : (
            comments.map(comment => {
              const isOwner = user?.userId === comment.userId
              const isEditing = editingCommentId === comment.commentId
              return (
                <div
                  key={comment.commentId}
                  className="rounded-md border p-3">
                  {/* 댓글 헤더: 프로필 [이름 작성시간] [수정 삭제] */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        {comment.profileImageUrl ? (
                          <AvatarImage
                            src={comment.profileImageUrl}
                            alt="프로필 이미지"
                          />
                        ) : (
                          <AvatarFallback>
                            <span className="text-xs">
                              {comment.nickname?.[0] || 'U'}
                            </span>
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground mr-2">
                          {comment.nickname}
                        </span>
                        <span>
                          {format(
                            new Date(comment.createdAt),
                            'yyyy.MM.dd HH:mm'
                          )}
                        </span>
                      </div>
                    </div>
                    {isOwner && (
                      <div className="flex items-center gap-3 text-sm">
                        {isEditing ? (
                          <>
                            <MenuText
                              text="저장"
                              onClick={saveEdit}
                            />
                            <MenuText
                              text="취소"
                              onClick={() => {
                                setEditingCommentId(null)
                                setEditingContent('')
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <MenuText
                              text="수정"
                              onClick={() =>
                                startEdit(comment.commentId, comment.content)
                              }
                            />
                            <Confirm
                              title="댓글 삭제"
                              description="이 댓글을 삭제하시겠습니까?"
                              confirmText="삭제"
                              cancelText="취소"
                              onConfirm={() => removeComment(comment.commentId)}
                              trigger={<MenuText text="삭제" />}
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    {isEditing ? (
                      <Textarea
                        value={editingContent}
                        onChange={e => setEditingContent(e.target.value)}
                      />
                    ) : (
                      <p className="whitespace-pre-wrap leading-6">
                        {comment.content}
                      </p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
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
