import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CommentFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isAuthenticated?: boolean
  className?: string
  submitText?: string
}

export default function CommentForm({
  value,
  onChange,
  onSubmit,
  isAuthenticated = false,
  className,
  submitText = '댓글 등록'
}: CommentFormProps) {
  const disabled = !isAuthenticated

  return (
    <div className={cn('space-y-2', className)}>
      <Textarea
        placeholder={
          isAuthenticated ? '댓글을 입력하세요' : '로그인 후 댓글 작성 가능'
        }
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />
      <div className="flex justify-end">
        <Button
          className="cursor-pointer"
          onClick={onSubmit}
          disabled={disabled}>
          {submitText}
        </Button>
      </div>
    </div>
  )
}
