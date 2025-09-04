import { Globe, Lock } from 'lucide-react'
import { Label } from '@/components/ui/label.tsx'
import { Switch } from '@/components/ui/switch'

interface PostPublicInputProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  isLoading?: boolean
}

export default function PostPublicInput({
  checked,
  onCheckedChange,
  isLoading = false
}: PostPublicInputProps) {
  return (
    <div className="flex items-center space-x-2 cursor-pointer">
      <Switch
        id="isPublic"
        className="cursor-pointer"
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={isLoading}
      />
      <Label
        htmlFor="isPublic"
        className="flex items-center gap-2 cursor-pointer">
        {checked ? (
          <>
            <Globe className="h-4 w-4" />
            공개
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            비공개
          </>
        )}
      </Label>
    </div>
  )
}
