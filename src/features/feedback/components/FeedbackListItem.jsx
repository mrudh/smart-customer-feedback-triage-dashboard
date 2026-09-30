import clsx from 'clsx'
import { Sparkles } from 'lucide-react'
import { memo } from 'react'
import { CATEGORY_META, SENTIMENT_META, STATUS_META, UNCLASSIFIED_LABEL } from '@/features/feedback/feedback.constants'
import { formatInboxTime } from '@/utils/format'
import { useAiStore } from '@/features/ai/aiStore'
import { isAnalysisActive } from '@/features/ai/ai.model'
import { Avatar } from '@/components/ui/Avatar'
import { Pill } from '@/components/ui/Pill'

export const FeedbackListItem = memo(function FeedbackListItem({ item, selected, onSelect }) {
  const analysing = useAiStore((s) => isAnalysisActive(s.analyses[item.id]?.status ?? 'idle'))
  const { sentiment, category, status } = item.triage
  const isNew = status === 'new'

  return (
    <li>
      <button
        type="button"
        data-feedback-id={item.id}
        aria-current={selected ? 'true' : undefined}
        onClick={() => onSelect(item.id)}
        className={clsx(
          'group relative flex w-full gap-3 rounded-xl border p-4 text-left transition-colors',
          selected
            ? 'border-brand-400 bg-brand-50 shadow-[inset_4px_0_0_var(--color-brand-600)]'
            : 'border-line bg-white hover:border-brand-200 hover:bg-brand-25',
        )}
      >
        <Avatar name={item.customer.name} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className={clsx('truncate text-[15px]', isNew ? 'font-semibold' : 'font-medium')}>
              {isNew && <span className="sr-only">Unread: </span>}
              {item.subject}
            </h3>
            <time dateTime={item.receivedAt} className="shrink-0 text-xs text-muted">
              {formatInboxTime(item.receivedAt)}
            </time>
          </div>
          <p className="mt-0.5 truncate text-[13px] text-muted">
            {item.customer.name}
            {item.orderNumber && <> • Order #{item.orderNumber}</>}
          </p>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-ink/80">{item.message}</p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {sentiment ? (
              <Pill tone={SENTIMENT_META[sentiment].pill} dot={SENTIMENT_META[sentiment].dot}>
                {SENTIMENT_META[sentiment].label}
              </Pill>
            ) : (
              <Pill dashed>{UNCLASSIFIED_LABEL}</Pill>
            )}
            {category && <Pill>{CATEGORY_META[category].label}</Pill>}
            {analysing && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-700">
                <Sparkles aria-hidden className="size-3.5 animate-pulse" />
                Analysing…
              </span>
            )}
            <Pill tone={STATUS_META[status].pill} className="ml-auto">
              {STATUS_META[status].label}
            </Pill>
          </div>
        </div>
      </button>
    </li>
  )
})
