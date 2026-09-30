import clsx from 'clsx'
import { Check, CheckCheck, RotateCcw, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useId, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { CATEGORY_META, SENTIMENT_META, UNCLASSIFIED_LABEL } from '@/features/feedback/feedback.constants'
import { FEEDBACK_CATEGORIES, SENTIMENTS } from '@/features/feedback/feedback.model'

export function SuggestionReview(props) {
  const { review, rating, onRate } = props

  return (
    <div className="mt-4 border-t border-brand-100 pt-4">
      {review === 'pending' && <ReviewForm {...props} />}
      {review === 'applied' && (
        <Outcome icon={<CheckCheck className="size-4 text-green-700" />} text="Triage applied to this feedback." />
      )}
      {review === 'dismissed' && (
        <Outcome
          text="Suggestion dismissed - no changes were made."
          action={
            <Button size="sm" onClick={props.onReopen} icon={<RotateCcw className="size-3.5" />}>
              Review again
            </Button>
          }
        />
      )}

      <div className="mt-3 flex items-center gap-1" role="group" aria-label="Rate this analysis">
        <span className="mr-1 text-xs text-muted">Was this analysis helpful?</span>
        <RateButton label="Helpful" active={rating === 'up'} onClick={() => onRate(rating === 'up' ? null : 'up')}>
          <ThumbsUp className="size-4" />
        </RateButton>
        <RateButton
          label="Not helpful"
          active={rating === 'down'}
          onClick={() => onRate(rating === 'down' ? null : 'down')}
        >
          <ThumbsDown className="size-4" />
        </RateButton>
      </div>
    </div>
  )
}

function ReviewForm({ suggestion, onApply, onDismiss }) {
  const [draft, setDraft] = useState({
    sentiment: suggestion?.sentiment ?? null,
    category: suggestion?.category ?? null,
  })
  const id = useId()
  const nothingToApply = draft.sentiment === null && draft.category === null

  return (
    <form
      aria-labelledby={`${id}-title`}
      onSubmit={(event) => {
        event.preventDefault()
        if (!nothingToApply) onApply(draft)
      }}
      className="rounded-xl bg-white p-4 ring-1 ring-line"
    >
      <p id={`${id}-title`} className="font-semibold">
        Suggested triage - review before applying
      </p>
      <p className="mt-0.5 text-sm text-muted">
        {suggestion
          ? 'Change anything that doesn’t look right. Nothing is saved until you apply.'
          : 'The AI didn’t give a clear sentiment or category - choose them yourself, or dismiss.'}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <DraftField
          id={`${id}-sentiment`}
          label="Sentiment"
          suggestedLabel={suggestion?.sentiment ? SENTIMENT_META[suggestion.sentiment].label : null}
          edited={draft.sentiment !== (suggestion?.sentiment ?? null)}
        >
          <Select
            id={`${id}-sentiment`}
            value={draft.sentiment ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, sentiment: e.target.value || null }))}
            leading={
              <span
                className={clsx(
                  'block size-2.5 rounded-full',
                  draft.sentiment ? SENTIMENT_META[draft.sentiment].dot : 'ring-1 ring-slate-400 ring-inset',
                )}
              />
            }
          >
            <option value="">{UNCLASSIFIED_LABEL}</option>
            {SENTIMENTS.map((s) => (
              <option key={s} value={s}>
                {SENTIMENT_META[s].label}
              </option>
            ))}
          </Select>
        </DraftField>

        <DraftField
          id={`${id}-category`}
          label="Category"
          suggestedLabel={suggestion?.category ? CATEGORY_META[suggestion.category].label : null}
          edited={draft.category !== (suggestion?.category ?? null)}
        >
          <Select
            id={`${id}-category`}
            value={draft.category ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value || null }))}
          >
            <option value="">Uncategorised</option>
            {FEEDBACK_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_META[c].label}
              </option>
            ))}
          </Select>
        </DraftField>
      </div>

      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button onClick={onDismiss} className="w-full sm:w-auto">
          Dismiss
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={nothingToApply}
          icon={<Check className="size-4" />}
          className="w-full sm:w-auto"
        >
          Apply
        </Button>
      </div>
    </form>
  )
}

function DraftField({ id, label, suggestedLabel, edited, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {edited && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-900 ring-1 ring-amber-200 ring-inset">
            Edited
          </span>
        )}
      </div>
      {children}
      {edited && <p className="mt-1 text-xs text-muted">AI suggested: {suggestedLabel ?? 'nothing'}</p>}
    </div>
  )
}

function Outcome({ icon, text, action }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-line">
      {icon}
      <p className="flex-1">{text}</p>
      {action}
    </div>
  )
}

function RateButton({ label, active, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={onClick}
      className={clsx(
        'inline-flex size-9 items-center justify-center rounded-lg transition-colors',
        active ? 'bg-brand-100 text-brand-700' : 'text-muted hover:bg-brand-50 hover:text-brand-700',
      )}
    >
      {children}
    </button>
  )
}
