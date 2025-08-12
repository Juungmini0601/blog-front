import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Loader2, User } from 'lucide-react'
import useUserAPI, { LOGIN_USER_KEY } from '@/hooks/useUser.ts'
import useImage from '@/hooks/useImage.ts'
import { useUserUpdateForm } from '@/hooks/form/useUserUpdateForm.ts'
import ImageUploader from '@/components/ImageUploader.tsx'
import NicknameInput from '@/components/NicknameInput.tsx'
import GithubUrlInput from '@/components/GithubUrlInput.tsx'
import IntroductionInput from '@/components/IntroductionInput.tsx'
import { useEffect } from 'react'
import Confirm from '@/components/Confirm.tsx'
import queryClient from '@/api/queryClient.ts'
import { useNavigate } from 'react-router'

export default function SettingsPage() {
  const { user, deleteUserMutation } = useUserAPI()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isLoading,
    onSubmit,
    watch,
    setValue
  } = useUserUpdateForm()

  const { imageUploadMutation } = useImage()
  const profileImageUrl = watch('profileImageUrl')

  // 프로필 이미지 관리
  const handleImageUpload = async (file: File) => {
    const uploadResponse = await imageUploadMutation.mutateAsync(file.name)

    if (uploadResponse.data) {
      const { uploadUrl, accessUrl } = uploadResponse.data

      await fetch(uploadUrl, {
        method: 'PUT',
        body: file
      })

      setValue('profileImageUrl', accessUrl)
      return
    }
  }

  const handleImageRemove = () => {
    setValue('profileImageUrl', '')
  }

  const handleConfirmDelete = async () => {
    await deleteUserMutation.mutateAsync()
    queryClient.removeQueries({ queryKey: [LOGIN_USER_KEY] })
    navigate('/login')
  }

  useEffect(() => {
    if (user) {
      setValue('nickname', user.nickname as string)
      setValue('introduction', user.introduction)
      setValue('githubUrl', user.githubUrl)
      setValue('profileImageUrl', user.profileImageUrl)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

              {/* 우측 폼 필드 영역 */}
              <div className="space-y-6">
                <NicknameInput
                  field={register('nickname')}
                  error={errors.nickname?.message}
                  isLoading={isLoading}
                />

                <IntroductionInput
                  field={register('introduction')}
                  error={errors.introduction?.message}
                  isLoading={isLoading}
                />

                <GithubUrlInput
                  field={register('githubUrl')}
                  error={errors.githubUrl?.message}
                  isLoading={isLoading}
                />

                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  readOnly
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500">
                  이메일은 변경할 수 없습니다.
                </p>

                <Separator />

                <div className="flex space-x-4">
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="flex-1 cursor-pointer">
                    {isSubmitting && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    저장
                  </Button>

                  <Confirm
                    title="회원 탈퇴"
                    description="이 작업은 되돌릴 수 없습니다. 모든 데이터가 영구적으로 삭제됩니다."
                    confirmText="탈퇴"
                    cancelText="취소"
                    isLoading={deleteUserMutation.isPending}
                    onConfirm={handleConfirmDelete}
                    trigger={
                      <Button
                        variant="outline"
                        className="flex-1 cursor-pointer"
                        disabled={deleteUserMutation.isPending}>
                        {deleteUserMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        회원 탈퇴
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
