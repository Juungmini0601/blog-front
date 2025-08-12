import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Bold,
  Italic,
  Link as LinkIcon,
  Code,
  ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  List
} from 'lucide-react'
import useEditor from '@/hooks/useEditor'

export interface MarkDownEditorProps {
  value: string
  onChange: (nextValue: string) => void
  errorMessage?: string
}

/**
 * 마크다운 에디터 컴포넌트
 * - 툴바, Textarea, 오류 표시
 */
export default function MarkDownEditor({
  value,
  onChange,
  errorMessage
}: MarkDownEditorProps) {
  const { textareaRef, insertMarkdown, insertLinePrefix, handlePaste } =
    useEditor({ value, onChange })

  const toolbar_actions = [
    {
      icon: Heading1,
      onClick: () => insertLinePrefix('# '),
      tooltip: '제목 1'
    },
    {
      icon: Heading2,
      onClick: () => insertLinePrefix('## '),
      tooltip: '제목 2'
    },
    {
      icon: Heading3,
      onClick: () => insertLinePrefix('### '),
      tooltip: '제목 3'
    },
    {
      icon: Bold,
      onClick: () => insertMarkdown('**', '**'),
      tooltip: '굵게'
    },
    {
      icon: Italic,
      onClick: () => insertMarkdown('*', '*'),
      tooltip: '기울임'
    },
    {
      icon: Code,
      onClick: () => insertMarkdown('`', '`'),
      tooltip: '인라인 코드'
    },
    {
      icon: LinkIcon,
      onClick: () => insertMarkdown('[링크 텍스트](', ')'),
      tooltip: '링크'
    },
    { icon: List, onClick: () => insertLinePrefix('- '), tooltip: '목록' },
    {
      icon: ImageIcon,
      onClick: () => insertMarkdown('![이미지 설명](', ')'),
      tooltip: '이미지'
    }
  ]

  return (
    <div>
      <div className="flex items-center gap-1 pt-2 border-t">
        {toolbar_actions.map((action, index) => (
          <Button
            className="cursor-pointer"
            key={index}
            variant="ghost"
            size="sm"
            onClick={action.onClick}
            title={action.tooltip}>
            <action.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      <div className="space-y-2 mt-2">
        <Textarea
          id="content"
          placeholder="마크다운으로 내용을 작성하세요..."
          className={`min-h-[400px] font-mono whitespace-pre-wrap resize-none leading-relaxed ${errorMessage ? 'border-destructive' : ''}`}
          style={{
            lineHeight: '1.6',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap'
          }}
          value={value}
          onChange={e => onChange(e.target.value)}
          ref={textareaRef}
          onPaste={handlePaste}
        />
        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
      </div>
    </div>
  )
}
