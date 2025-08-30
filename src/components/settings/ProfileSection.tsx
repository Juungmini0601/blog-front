import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { User } from 'lucide-react'
import ImageUploader from '@/components/ImageUploader.tsx'

interface ProfileSectionProps {
  profileImageUrl: string
  handleImageUpload: (file: File) => Promise<void>
  handleImageRemove: () => void
}

export default function ProfileSection({
  profileImageUrl,
  handleImageUpload,
  handleImageRemove
}: ProfileSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative inline-block">
          <Avatar className="w-44 h-44 mx-auto">
            <AvatarImage
              src={profileImageUrl || undefined}
              alt="프로필 이미지"
            />
            <AvatarFallback className="text-4xl">
              <User className="w-16 h-16" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <ImageUploader
        imageUrl={profileImageUrl}
        handleImageUpload={handleImageUpload}
        handleImageRemove={handleImageRemove}
      />
    </div>
  )
}
