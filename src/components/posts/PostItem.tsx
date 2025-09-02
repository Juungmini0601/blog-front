import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/card.tsx'
import PostItemThumbnail from '@/components/posts/PostItemThumbnail.tsx'
import PostItemBody from '@/components/posts/PostItemBody.tsx'
import PostItemFooter from '@/components/posts/PostItemFooter.tsx'

interface PostItemProps {
  postId: number
  thumbnailUrl?: string | null
  title?: string
  content: string
  createdAt: string
  profileImageUrl?: string | null
  nickname: string
  commentCount: number
  likeCount: number
}

export default function PostItem({
  postId,
  thumbnailUrl,
  title,
  content,
  createdAt,
  profileImageUrl,
  nickname,
  likeCount,
  commentCount
}: PostItemProps) {
  const navigate = useNavigate()

  return (
    <Card
      className="cursor-pointer py-0 overflow-hidden transition hover:shadow-md"
      onClick={() => navigate(`/post/${postId}`)}>
      <PostItemThumbnail thumbnailUrl={thumbnailUrl} />

      <PostItemBody
        title={title}
        content={content}
        createdAt={createdAt}
      />

      <PostItemFooter
        profileImageUrl={profileImageUrl}
        nickname={nickname}
        commentCount={commentCount}
        likeCount={likeCount}
      />
    </Card>
  )
}
