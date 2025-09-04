import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface PostThumbnailInputProps {
  field: UseFormRegisterReturn
  error?: string
  isLoading?: boolean
}

export default function PostThumbnailInput({
  field,
  error,
  isLoading = false
}: PostThumbnailInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="thumbnailUrl">썸네일 URL</Label>
      <Input
        id="thumbnailUrl"
        placeholder="https://example.com/image.jpg"
        disabled={isLoading}
        {...field}
        className={error ? 'border-destructive' : ''}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
