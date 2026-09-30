import { Sparkles } from 'lucide-react'
import { CATEGORY_META, SENTIMENT_META, STATUS_META, UNCLASSIFIED_LABEL } from '@/features/feedback/feedback.constants'
import { useFeedbackStore } from '@/features/feedback/feedbackStore'
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUSES, SENTIMENTS } from '@/features/feedback/feedback.model'
import { Select } from '@/components/ui/Select'

const NONE = ''

export function TriageControls({ item }) {
  const updateTriage = useFeedbackStore((s) => s.updateTriage)
  const { status, category, sentiment, classifiedBy } = item.triage
  const update = (patch) => updateTriage(item.id, patch, 'agent')

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="Status" htmlFor="triage-status">
          <Select
            id="triage-status"
            value={status}
            onChange={(e) => update({ status: e.target.value })}
            leading={<span className={`block size-2.5 rounded-full ${STATUS_META[status].dot}`} />}
          >
            {FEEDBACK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Category" htmlFor="triage-category">
          <Select
            id="triage-category"
            value={category ?? NONE}
            onChange={(e) => update({ category: e.target.value || null })}
          >
            <option value={NONE}>Uncategorised</option>
            {FEEDBACK_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_META[c].label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Sentiment" htmlFor="triage-sentiment">
          <Select
            id="triage-sentiment"
            value={sentiment ?? NONE}
            onChange={(e) => update({ sentiment: e.target.value || null })}
            leading={
              <span
                className={`block size-2.5 rounded-full ${sentiment ? SENTIMENT_META[sentiment].dot : 'ring-1 ring-slate-400 ring-inset'}`}
              />
            }
          >
            <option value={NONE}>{UNCLASSIFIED_LABEL}</option>
            {SENTIMENTS.map((s) => (
              <option key={s} value={s}>
                {SENTIMENT_META[s].label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      {classifiedBy === 'ai' && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-brand-700">
          <Sparkles aria-hidden className="size-3.5" />
          Category and sentiment applied from AI suggestions
        </p>
      )}
    </div>
  )
}

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
    </div>
  )
}
