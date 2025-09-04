import NicknameInput from '@/components/settings/NicknameInput.tsx'
import IntroductionInput from '@/components/settings/IntroductionInput.tsx'
import GithubUrlInput from '@/components/settings/GithubUrlInput.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Button } from '@/components/ui/button.tsx'
import Confirm from '@/components/shared/Confirm.tsx'
import { Loader2 } from 'lucide-react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

interface FormSectionProps {
  register: UseFormRegister<any>
  errors: FieldErrors
  isLoading: boolean
  isSubmitting: boolean
  userEmail?: string
  onSubmit: () => void
  onConfirmDelete: () => void
  isDeleting: boolean
}

export default function FormSection({
  register,
  errors,
  isLoading,
  isSubmitting,
  userEmail,
  onSubmit,
  onConfirmDelete,
  isDeleting
}: FormSectionProps) {
  return (
    <div className="space-y-6">
      <NicknameInput
        field={register('nickname')}
        error={errors.nickname?.message as string}
        isLoading={isLoading}
      />

      <IntroductionInput
        field={register('introduction')}
        error={errors.introduction?.message as string}
        isLoading={isLoading}
      />

      <GithubUrlInput
        field={register('githubUrl')}
        error={errors.githubUrl?.message as string}
        isLoading={isLoading}
      />

      <div>
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          value={userEmail || ''}
          readOnly
          className="bg-gray-50"
        />
        <p className="text-sm text-gray-500">이메일은 변경할 수 없습니다.</p>
      </div>

      <Separator />

      <div className="flex space-x-4">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 cursor-pointer">
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          저장
        </Button>

        <Confirm
          title="회원 탈퇴"
          description="이 작업은 되돌릴 수 없습니다. 모든 데이터가 영구적으로 삭제됩니다."
          confirmText="탈퇴"
          cancelText="취소"
          isLoading={isDeleting}
          onConfirm={onConfirmDelete}
          trigger={
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              회원 탈퇴
            </Button>
          }
        />
      </div>
    </div>
  )
}
