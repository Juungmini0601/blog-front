import type { UseFormRegisterReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'

interface SeriesNameInputProps {
  field: UseFormRegisterReturn
  error?: string
}

export default function SeriesNameInput({
  error,
  field
}: SeriesNameInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">시리즈 이름</Label>
      <Input
        id="name"
        placeholder="시리즈 이름을 입력하세요"
        {...field}
        className={error ? 'border-destructive' : ''}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
