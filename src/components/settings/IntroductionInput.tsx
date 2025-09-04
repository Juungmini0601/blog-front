import type { UseFormRegisterReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'

interface IntroductionInputProps {
  field: UseFormRegisterReturn
  error?: string
  isLoading: boolean
}

export default function IntroductionInput({
  error,
  isLoading,
  field
}: IntroductionInputProps) {
  return (
    <div>
      <Label htmlFor="introduction">자기소개</Label>
      <Textarea
        id="introduction"
        rows={4}
        placeholder="자기소개를 입력하세요"
        aria-invalid={!!error}
        aria-describedby="introduction-error"
        disabled={isLoading}
        {...field}
      />
      {error && (
        <p
          id="introduction-error"
          className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
