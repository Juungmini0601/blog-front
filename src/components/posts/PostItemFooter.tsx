import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'

interface PostItemFooterProps {
  profileImageUrl?: string | null
  nickname: string
  commentCount: number
  likeCount: number
}

interface AuthorProfileProps {
  profileImageUrl?: string | null
  nickname: string
}

function AuthorProfile({ profileImageUrl, nickname }: AuthorProfileProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-7 w-7">
        <AvatarImage src={profileImageUrl ?? undefined} />
        <AvatarFallback>{nickname?.[0] ?? 'U'}</AvatarFallback>
      </Avatar>

      <span className="font-medium text-foreground">{nickname}</span>
    </div>
  )
}

export default function PostItemFooter({
  profileImageUrl,
  nickname,
  commentCount,
  likeCount
}: PostItemFooterProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground border-t-1 p-2">
      <AuthorProfile
        nickname={nickname}
        profileImageUrl={profileImageUrl}
      />

      <div className="flex items-center gap-2">
        <span>댓글 {commentCount}</span>
        <span>좋아요 {likeCount}</span>
      </div>
    </div>
  )
}
