import type { UseFormRegisterReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'

interface GithubUrlInputProps {
  field: UseFormRegisterReturn
  error?: string
  isLoading: boolean
}

export default function GithubUrlInput({
  error,
  isLoading,
  field
}: GithubUrlInputProps) {
  return (
    <div>
      <Label
        htmlFor="github-url"
        className="block text-sm font-medium text-gray-700 mb-2">
        Github URL
      </Label>
      <Input
        id="githubUrl"
        type="text"
        placeholder="깃허브URL을 입력하세요"
        aria-invalid={!!error}
        aria-describedby="githuburl-error"
        disabled={isLoading}
        {...field}
      />
      {error && (
        <p
          id="githuburl-error"
          className="mt-1 text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
