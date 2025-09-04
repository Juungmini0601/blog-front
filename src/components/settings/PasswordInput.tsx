import type { UseFormRegisterReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'

interface PasswordInputProps {
  field: UseFormRegisterReturn
  error?: string
  isLoading: boolean
}

export default function PasswordInput({
  field,
  error,
  isLoading
}: PasswordInputProps) {
  return (
    <div>
      <Label
        htmlFor="password"
        className="block text-sm font-medium text-gray-700 mb-2">
        비밀번호
      </Label>
      <Input
        id="password"
        type="password"
        placeholder="비밀번호를 입력하세요"
        aria-invalid={!!error}
        aria-describedby="password-error"
        disabled={isLoading}
        {...field}
      />
      {error && (
        <p
          id="password-error"
          className="mt-1 text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
