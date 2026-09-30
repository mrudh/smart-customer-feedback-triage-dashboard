import clsx from 'clsx'
import { ArrowLeft, MousePointerClick, Quote } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { CHANNEL_META } from '@/features/feedback/feedback.constants'
import { formatFullTimestamp } from '@/utils/format'
import { selectSelectedItem, useFeedbackStore } from '@/features/feedback/feedbackStore'
import { AiAssistantPanel } from '@/features/ai/components/AiAssistantPanel'
import { Avatar } from '@/components/ui/Avatar'
import { DetailActions } from './DetailActions'
import { NotesSection } from './NotesSection'
import { TriageControls } from './TriageControls'

export function FeedbackDetailPanel({ className }) {
  const item = useFeedbackStore(selectSelectedItem)
  const selectFeedback = useFeedbackStore((s) => s.selectFeedback)

  return (
    <section
      aria-label="Feedback detail"
      className={clsx('flex min-h-0 flex-col overflow-hidden rounded-2xl border border-line bg-white', className)}
    >
      {item ? (
        <FeedbackDetail
          key={item.id}
          item={item}
          onBack={() => {
            const id = item.id
            selectFeedback(null)
            requestAnimationFrame(() => document.querySelector(`[data-feedback-id="${id}"]`)?.focus())
          }}
        />
      ) : (
        <NoSelection />
      )}
    </section>
  )
}

const SINGLE_PANE_QUERY = '(max-width: 1023px)'

function FeedbackDetail({ item, onBack }) {
  const ChannelIcon = CHANNEL_META[item.channel].icon
  const headingRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia?.(SINGLE_PANE_QUERY).matches) headingRef.current?.focus()
  }, [])

  return (
    <>
      <div className="relative flex-1 overflow-y-auto">
        <div className="border-b border-line px-4 py-2 lg:hidden">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Back to inbox
          </button>
        </div>

        <article className="flex flex-col gap-6 p-4 sm:p-6">
          <header className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={item.customer.name} size="lg" />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{item.customer.name}</p>
                  <a
                    href={`mailto:${item.customer.email}`}
                    className="truncate text-sm text-muted hover:text-brand-700"
                  >
                    {item.customer.email}
                  </a>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                <ChannelIcon aria-hidden className="size-3.5" />
                {CHANNEL_META[item.channel].label}
              </span>
            </div>

            <div>
              <h2
                ref={headingRef}
                tabIndex={-1}
                className="text-2xl font-bold tracking-tight text-balance focus:outline-none"
              >
                {item.subject}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {item.orderNumber ? <>Order #{item.orderNumber}</> : 'No order linked'}
                <span aria-hidden className="mx-2 text-line">
                  |
                </span>
                <time dateTime={item.receivedAt}>{formatFullTimestamp(item.receivedAt)}</time>
              </p>
            </div>

            <blockquote className="relative rounded-xl bg-canvas p-4 pl-11 text-[15px] leading-relaxed ring-1 ring-line">
              <Quote aria-hidden className="absolute top-4 left-4 size-4 rotate-180 fill-brand-300 text-brand-300" />
              {item.message}
            </blockquote>
          </header>

          <TriageControls item={item} />
          <AiAssistantPanel item={item} />
          <NotesSection item={item} />
        </article>
      </div>
      <DetailActions item={item} />
    </>
  )
}

function NoSelection() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <MousePointerClick className="size-7" />
      </span>
      <p className="font-semibold">Select feedback to triage</p>
      <p className="max-w-xs text-sm text-muted">
        Pick an item from the inbox to read it, run the AI assistant and update its status. Use ↑ / ↓ to move between
        items.
      </p>
    </div>
  )
}
