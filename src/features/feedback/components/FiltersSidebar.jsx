import clsx from 'clsx'
import { Calendar, Flame, Inbox, Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { CATEGORY_META, SENTIMENT_META, UNCLASSIFIED_LABEL, VIEW_META } from '@/features/feedback/feedback.constants'
import { countBy, countActiveFilters, matchesView } from '@/features/feedback/utils/filterFeedback'
import { useFeedbackStore } from '@/features/feedback/feedbackStore'
import { FEEDBACK_CATEGORIES, SENTIMENTS } from '@/features/feedback/feedback.model'
import { INBOX_VIEWS } from '@/features/feedback/filters.model'
import { Select } from '@/components/ui/Select'

const VIEW_ICONS = { all: Inbox, needs_triage: Sparkles, priority: Flame }

const DATE_LABELS = {
  all: 'All time',
  today: 'Today',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
}

export function FiltersSidebar({ onNavigate }) {
  const items = useFeedbackStore((s) => s.items)
  const filters = useFeedbackStore((s) => s.filters)
  const setFilter = useFeedbackStore((s) => s.setFilter)
  const toggleFilterValue = useFeedbackStore((s) => s.toggleFilterValue)
  const clearFilters = useFeedbackStore((s) => s.clearFilters)

  const counts = useMemo(
    () => ({
      views: Object.fromEntries(INBOX_VIEWS.map((v) => [v, items.filter((i) => matchesView(i, v)).length])),
      sentiment: countBy(items, (i) => i.triage.sentiment ?? 'unclassified'),
      category: countBy(items, (i) => i.triage.category ?? 'unclassified'),
    }),
    [items],
  )
  const activeCount = countActiveFilters(filters)

  return (
    <div className="flex flex-col gap-6 p-4">
      <nav aria-label="Views">
        <ul className="flex flex-col gap-1">
          {INBOX_VIEWS.map((view) => {
            const Icon = VIEW_ICONS[view]
            const active = filters.view === view
            return (
              <li key={view}>
                <button
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  title={VIEW_META[view].description}
                  onClick={() => {
                    setFilter('view', view)
                    onNavigate?.()
                  }}
                  className={clsx(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active ? 'bg-brand-100 text-brand-800' : 'text-ink hover:bg-brand-50',
                  )}
                >
                  <Icon aria-hidden className={clsx('size-5', active ? 'text-brand-700' : 'text-muted')} />
                  <span className="flex-1 text-left">{VIEW_META[view].label}</span>
                  <CountBadge value={counts.views[view] ?? 0} active={active} />
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <hr className="border-line" />

      <section aria-labelledby="filters-heading" className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 id="filters-heading" className="text-base font-semibold">
            Filters
          </h2>
          <button
            type="button"
            onClick={clearFilters}
            disabled={activeCount === 0 && !filters.query}
            className="text-sm font-medium text-brand-700 hover:underline disabled:cursor-default disabled:text-muted disabled:no-underline"
          >
            Clear all
          </button>
        </div>

        <FilterGroup legend="Sentiment">
          {SENTIMENTS.map((s) => (
            <FilterCheckbox
              key={s}
              label={SENTIMENT_META[s].label}
              dot={SENTIMENT_META[s].dot}
              count={counts.sentiment[s] ?? 0}
              checked={filters.sentiments.includes(s)}
              onChange={() => toggleFilterValue('sentiments', s)}
            />
          ))}
          <FilterCheckbox
            label={UNCLASSIFIED_LABEL}
            dot="bg-white ring-1 ring-slate-400 ring-inset"
            count={counts.sentiment.unclassified ?? 0}
            checked={filters.sentiments.includes('unclassified')}
            onChange={() => toggleFilterValue('sentiments', 'unclassified')}
          />
        </FilterGroup>

        <FilterGroup legend="Category">
          {FEEDBACK_CATEGORIES.map((c) => (
            <FilterCheckbox
              key={c}
              label={CATEGORY_META[c].label}
              count={counts.category[c] ?? 0}
              checked={filters.categories.includes(c)}
              onChange={() => toggleFilterValue('categories', c)}
            />
          ))}
          <FilterCheckbox
            label="Uncategorised"
            count={counts.category.unclassified ?? 0}
            checked={filters.categories.includes('unclassified')}
            onChange={() => toggleFilterValue('categories', 'unclassified')}
          />
        </FilterGroup>

        <div>
          <label htmlFor="date-range" className="mb-2 block text-sm font-semibold">
            Date received
          </label>
          <Select
            id="date-range"
            value={filters.dateRange}
            onChange={(e) => setFilter('dateRange', e.target.value)}
            leading={<Calendar className="size-4 text-muted" />}
          >
            {Object.entries(DATE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </section>
    </div>
  )
}

function CountBadge({ value, active }) {
  return (
    <span
      className={clsx(
        'min-w-7 rounded-full px-2 py-0.5 text-center text-xs font-medium tabular-nums',
        active ? 'bg-white text-brand-800' : 'bg-slate-100 text-muted',
      )}
    >
      {value}
    </span>
  )
}

function FilterGroup({ legend, children }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      <div className="flex flex-col">{children}</div>
    </fieldset>
  )
}

function FilterCheckbox({ label, count, checked, onChange, dot }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-md px-1 py-1.5 text-sm hover:bg-brand-25">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 cursor-pointer rounded border-line accent-brand-700"
      />

      {dot && <span aria-hidden className={clsx('size-2.5 rounded-full', dot)} />}
      <span className="flex-1">{label}</span>
      <span className="text-xs text-muted tabular-nums">{count}</span>
    </label>
  )
}
