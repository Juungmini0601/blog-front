import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface EmailInputProps {
  field: UseFormRegisterReturn
  error?: string
  isLoading: boolean
}

export default function EmailInput({
  error,
  isLoading,
  field
}: EmailInputProps) {
  return (
    <div>
      <Label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700 mb-2">
        이메일
      </Label>
      <Input
        id="email"
        type="email"
        placeholder="example@email.com"
        aria-invalid={!!error}
        aria-describedby="email-error"
        disabled={isLoading}
        {...field}
      />
      {error && (
        <p
          id="email-error"
          className="mt-1 text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
