import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface PostTitleInputProps {
  field: UseFormRegisterReturn
  error?: string
  currentLength: number
  maxLength?: number
  isLoading?: boolean
}

export default function PostTitleInput({
  field,
  error,
  currentLength,
  maxLength = 255,
  isLoading = false
}: PostTitleInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="title">제목 *</Label>
      <Input
        id="title"
        placeholder="글 제목을 입력하세요"
        disabled={isLoading}
        {...field}
        className={error ? 'border-destructive' : ''}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        {currentLength}/{maxLength}자
      </p>
    </div>
  )
}
