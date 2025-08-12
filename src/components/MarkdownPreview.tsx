import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

export interface MarkdownPreviewProps {
  content: string
  placeholder?: string
  className?: string
  style?: React.CSSProperties
}

/**
 * 마크다운 미리보기 컴포넌트
 * - ReactMarkdown + GFM + 줄바꿈 + 코드 하이라이트
 * - 제목/링크/이미지 등 기본 요소 스타일 포함
 */
export default function MarkdownPreview({
  content,
  placeholder = '*내용을 입력하면 여기에 미리보기가 표시됩니다.*',
  className,
  style
}: MarkdownPreviewProps) {
  return (
    <div
      className={`prose dark:prose-invert max-w-none ${className || ''}`}
      style={{
        fontFamily:
          '"FC Script","Kosugi Maru","FC Sans","Noto Sans SC","Noto Sans TC","Noto Sans JP",ui-rounded,system-ui-rounded,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"SF Pro Text","SF UI Text","Segoe UI","Segoe UI Emoji",Roboto,Meiryo,"Microsoft YaHei","Microsoft YaHei UI","Microsoft JhengHei","Microsoft JhengHei UI","Apple SD Gothic Neo",NanumGothic,"나눔고딕","Malgun Gothic","맑은 고딕",fantasy',
        fontSize: '16px',
        lineHeight: '1.7',
        ...style
      }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children, ...props }) => (
            <h1
              className="text-3xl font-bold mb-4 mt-6 first:mt-0 text-primary"
              {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="text-2xl font-bold mb-3 mt-5 text-primary"
              {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="text-xl font-bold mb-2 mt-4 text-primary"
              {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="text-lg font-bold mb-2 mt-3 text-primary"
              {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5
              className="text-base font-bold mb-1 mt-3 text-primary"
              {...props}>
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6
              className="text-sm font-bold mb-1 mt-2 text-primary"
              {...props}>
              {children}
            </h6>
          ),
          strong: ({ children, ...props }) => (
            <strong
              style={{ backgroundColor: '#d9ff7d' }}
              className="font-bold px-1 py-0.5 rounded"
              {...props}>
              {children}
            </strong>
          ),
          code: ({ className, children, ...props }) => {
            const isCodeBlock = /language-(\w+)/.test(className || '')
            return isCodeBlock ? (
              <code
                className={className}
                {...props}>
                {children}
              </code>
            ) : (
              <code
                className="bg-muted px-1 py-0.5 rounded text-sm text-primary"
                {...props}>
                {children}
              </code>
            )
          },
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-primary/20 bg-muted/30 pl-4 py-2 italic"
              {...props}>
              {children}
            </blockquote>
          ),
          img: ({ alt, ...props }) => (
            <img
              className="max-w-full h-auto rounded-lg"
              alt={alt || '이미지'}
              {...props}
            />
          ),
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#01329d' }}
              className="hover:brightness-125 transition-all duration-200 underline"
              {...props}>
              {children}
            </a>
          ),
          p: ({ children, ...props }) => (
            <p
              className="leading-relaxed mb-3 last:mb-0"
              {...props}>
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul
              className="list-disc pl-6 mb-3 space-y-1"
              {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              className="list-decimal pl-6 mb-3 space-y-1"
              {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li
              className="leading-relaxed"
              {...props}>
              {children}
            </li>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table
                className="min-w-full border-collapse border border-border"
                {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead
              className="bg-muted"
              {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody {...props}>{children}</tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr
              className="border-b border-border"
              {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th
              className="border border-border px-3 py-2 text-left font-semibold"
              {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="border border-border px-3 py-2"
              {...props}>
              {children}
            </td>
          ),
          hr: ({ ...props }) => (
            <hr
              className="my-6 border-t border-border"
              {...props}
            />
          ),
          pre: ({ children, ...props }) => (
            <pre
              className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm"
              {...props}>
              {children}
            </pre>
          )
        }}>
        {content || placeholder}
      </ReactMarkdown>
    </div>
  )
}
