import type { UseFormRegisterReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'

interface NicknameInputProps {
  field: UseFormRegisterReturn
  error?: string
  isLoading: boolean
}

export default function NicknameInput({
  error,
  isLoading,
  field
}: NicknameInputProps) {
  return (
    <div>
      <Label
        htmlFor="nickname"
        className="block text-sm font-medium text-gray-700 mb-2">
        닉네임
      </Label>
      <Input
        id="nickname"
        type="text"
        placeholder="닉네임을 입력하세요"
        aria-invalid={!!error}
        aria-describedby="nickname-error"
        disabled={isLoading}
        {...field}
      />
      {error && (
        <p
          id="nickname-error"
          className="mt-1 text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
