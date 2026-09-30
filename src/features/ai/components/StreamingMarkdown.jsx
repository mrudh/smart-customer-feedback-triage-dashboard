import clsx from 'clsx'
import { memo } from 'react'
import Markdown from 'react-markdown'
import { balanceStreamingMarkdown } from '@/features/ai/utils/streamingMarkdown'

const components = {
  h1: 'h4',
  h2: 'h4',
  h3: ({ children }) => (
    <h4 className="!mt-4 !mb-1 text-[11px] font-semibold tracking-wider !text-brand-700 uppercase first:!mt-0">
      {children}
    </h4>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow">
      {children}
    </a>
  ),
}

export const StreamingMarkdown = memo(function StreamingMarkdown({ markdown, streaming }) {
  return (
    <div
      className={clsx(
        'prose prose-sm max-w-none text-ink prose-p:my-1 prose-strong:text-ink prose-ul:my-1 prose-li:my-0.5',
        streaming && 'streaming-caret',
      )}
    >
      <Markdown components={components}>{streaming ? balanceStreamingMarkdown(markdown) : markdown}</Markdown>
    </div>
  )
})
