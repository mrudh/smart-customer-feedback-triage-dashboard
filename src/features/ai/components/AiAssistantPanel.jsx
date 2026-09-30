import { CircleAlert, RefreshCw, Sparkles, Square } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { useFollowStream } from '@/hooks/useFollowStream'
import { CATEGORY_META, SENTIMENT_META } from '@/features/feedback/feedback.constants'
import { formatTime } from '@/utils/format'
import { selectAnalysis, useAiStore } from '@/features/ai/aiStore'
import { useFeedbackStore } from '@/features/feedback/feedbackStore'
import { useToastStore } from '@/components/ui/toastStore'
import { isAnalysisActive } from '@/features/ai/ai.model'
import { Button } from '@/components/ui/Button'
import { AnalysisStatusBadge } from './AnalysisStatusBadge'
import { StreamingMarkdown } from './StreamingMarkdown'
import { SuggestionReview } from './SuggestionReview'

const ANNOUNCEMENTS = {
  connecting: 'Generating AI analysis…',
  complete: 'AI analysis complete.',
  cancelled: 'AI analysis stopped.',
  error: 'AI analysis failed.',
}

export function AiAssistantPanel({ item }) {
  const analysis = useAiStore(selectAnalysis(item.id))
  const startAnalysis = useAiStore((s) => s.startAnalysis)
  const cancelAnalysis = useAiStore((s) => s.cancelAnalysis)
  const rateAnalysis = useAiStore((s) => s.rateAnalysis)
  const setReview = useAiStore((s) => s.setReview)
  const updateTriage = useFeedbackStore((s) => s.updateTriage)
  const restoreTriage = useFeedbackStore((s) => s.restoreTriage)
  const showToast = useToastStore((s) => s.showToast)

  const { status, markdown, error, suggestion } = analysis
  const active = isAnalysisActive(status)
  const hasText = markdown.length > 0
  const endRef = useRef(null)
  useFollowStream(endRef, active, `${status}:${markdown.length}`)

  const start = useCallback(() => void startAnalysis(item), [item, startAnalysis])

  // Esc key stops generation
  useEffect(() => {
    if (!active) return
    const onKey = (e) => e.key === 'Escape' && cancelAnalysis(item.id)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, cancelAnalysis, item.id])

  const applyReviewed = (draft) => {
    const snapshot = item.triage
    const acceptedAsIs =
      draft.sentiment === (suggestion?.sentiment ?? null) && draft.category === (suggestion?.category ?? null)

    updateTriage(
      item.id,
      {
        ...(draft.sentiment && { sentiment: draft.sentiment }),
        ...(draft.category && { category: draft.category }),
      },
      acceptedAsIs ? 'ai' : 'agent',
    )
    setReview(item.id, 'applied')

    showToast({
      message: acceptedAsIs ? 'AI suggestions applied' : 'Edited suggestions applied',
      description: [
        draft.sentiment && SENTIMENT_META[draft.sentiment].label,
        draft.category && CATEGORY_META[draft.category].label,
      ]
        .filter(Boolean)
        .join(' · '),
      action: {
        label: 'Undo',
        onAction: () => {
          restoreTriage(item.id, snapshot)
          setReview(item.id, 'pending')
        },
      },
    })
  }

  return (
    <section
      aria-labelledby="ai-assistant-heading"
      className="rounded-2xl border border-brand-100 bg-gradient-to-b from-brand-50/80 to-brand-25 p-4 sm:p-5"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-56 flex-1 items-start gap-3">
          <Sparkles aria-hidden className="mt-0.5 size-6 shrink-0 text-brand-600" />
          <div>
            <h3 id="ai-assistant-heading" className="text-lg font-semibold">
              AI Assistant
            </h3>
            <p className="text-sm text-muted">Summarise this feedback and suggest a category and sentiment.</p>
          </div>
        </div>
        {active ? (
          <Button
            onClick={() => cancelAnalysis(item.id)}
            icon={<Square className="size-3.5 fill-current" />}
            aria-keyshortcuts="Escape"
          >
            Stop generating
          </Button>
        ) : status === 'idle' ? (
          <Button variant="primary" onClick={start} icon={<Sparkles className="size-4" />}>
            Summarise & categorise
          </Button>
        ) : (
          <Button onClick={start} icon={<RefreshCw className="size-4" />}>
            Regenerate
          </Button>
        )}
      </header>

      <p className="sr-only" aria-live="polite">
        {ANNOUNCEMENTS[status] ?? ''}
        {status === 'error' && error ? ` ${error.message}` : ''}
      </p>

      {status !== 'idle' && (
        <div className="mt-4 rounded-xl bg-white/70 p-4 ring-1 ring-brand-100">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              <Sparkles aria-hidden className="size-4 text-brand-600" />
              AI Analysis
            </span>
            <AnalysisStatusBadge status={status} />
            <span className="ml-auto text-xs text-muted">
              {analysis.provider}
              {analysis.completedAt && status === 'complete' && ` · Generated ${formatTime(analysis.completedAt)}`}
            </span>
          </div>

          <div aria-busy={active} className="min-h-24">
            {status === 'connecting' && !hasText ? (
              <ConnectingSkeleton />
            ) : (
              <StreamingMarkdown markdown={markdown} streaming={active} />
            )}
          </div>

          {status === 'cancelled' && (
            <p className="mt-3 text-sm text-muted">
              Generation stopped{hasText ? ' - showing the partial response' : ''}.
            </p>
          )}

          {status === 'error' && error && (
            <div
              role="alert"
              className="mt-3 flex items-start gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-900 ring-1 ring-red-200"
            >
              <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              <div className="flex-1">
                <p>{error.message}</p>
                {hasText && <p className="mt-0.5 text-red-800/80">The partial response above may be incomplete.</p>}
              </div>
              {error.retryable && (
                <Button size="sm" variant="danger" onClick={start} icon={<RefreshCw className="size-3.5" />}>
                  Retry
                </Button>
              )}
            </div>
          )}

          {status === 'complete' && (
            <SuggestionReview
              key={analysis.completedAt ?? 0}
              suggestion={suggestion}
              review={analysis.review}
              rating={analysis.rating}
              onApply={applyReviewed}
              onDismiss={() => setReview(item.id, 'dismissed')}
              onReopen={() => setReview(item.id, 'pending')}
              onRate={(rating) => rateAnalysis(item.id, rating)}
            />
          )}
        </div>
      )}
      <div ref={endRef} aria-hidden className="h-px scroll-mb-4" />
    </section>
  )
}

function ConnectingSkeleton() {
  return (
    <div className="flex flex-col gap-2.5" aria-hidden>
      <div className="skeleton h-3 w-24" />
      <div className="skeleton h-3.5 w-full" />
      <div className="skeleton h-3.5 w-11/12" />
      <div className="skeleton mt-2 h-3 w-20" />
      <div className="skeleton h-3.5 w-4/5" />
    </div>
  )
}
