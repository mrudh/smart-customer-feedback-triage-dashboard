import clsx from 'clsx'
import { ArrowDownUp, Search, SlidersHorizontal, X } from 'lucide-react'
import { STATUS_META, VIEW_META } from '@/features/feedback/feedback.constants'
import { countActiveFilters } from '@/features/feedback/utils/filterFeedback'
import { useFeedbackStore } from '@/features/feedback/feedbackStore'
import { FEEDBACK_STATUSES } from '@/features/feedback/feedback.model'

export function InboxToolbar({ subtitle, statusCounts, totalInView, onOpenFilters }) {
  const filters = useFeedbackStore((s) => s.filters)
  const setFilter = useFeedbackStore((s) => s.setFilter)
  const activeFilterCount = countActiveFilters(filters)

  const tabs = [
    { value: 'all', label: 'All', count: totalInView },
    ...FEEDBACK_STATUSES.map((s) => ({ value: s, label: STATUS_META[s].label, count: statusCounts[s] ?? 0 })),
  ]

  return (
    <div className="@container flex flex-col gap-3 border-b border-line p-4">
      <div className="flex flex-col gap-3 @md:flex-row @md:items-start @md:justify-between xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-bold">
            {filters.view === 'all' ? 'Customer feedback' : VIEW_META[filters.view].label}
          </h2>
          <p className="text-sm text-muted" aria-live="polite">
            {subtitle}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onOpenFilters}
            className="relative inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium ring-1 ring-line ring-inset hover:bg-brand-25 xl:hidden"
          >
            <SlidersHorizontal aria-hidden className="size-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-brand-700 px-1.5 text-[11px] leading-5 text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <label className="relative inline-flex h-9 items-center rounded-lg ring-1 ring-line ring-inset hover:bg-brand-25">
            <span className="sr-only">Sort order</span>
            <ArrowDownUp aria-hidden className="pointer-events-none absolute left-2.5 size-4 text-muted" />
            <select
              value={filters.sort}
              onChange={(e) => setFilter('sort', e.target.value)}
              className="h-full cursor-pointer appearance-none bg-transparent pr-3 pl-8 text-[13px] font-medium"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>
      </div>

      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          value={filters.query}
          onChange={(e) => setFilter('query', e.target.value)}
          placeholder="Search by customer, order number or keyword…"
          aria-label="Search feedback"
          className="h-10 w-full rounded-lg bg-white pr-9 pl-9 text-sm ring-1 ring-line ring-inset placeholder:text-muted/80 hover:ring-brand-300 [&::-webkit-search-cancel-button]:hidden"
        />

        {filters.query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setFilter('query', '')}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div role="group" aria-label="Filter by status" className="relative -mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
        {tabs.map((tab) => {
          const selected = filters.status === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter('status', tab.value)}
              className={clsx(
                'inline-flex h-8 shrink-0 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium ring-1 transition-colors ring-inset',
                selected ? 'bg-brand-100 text-brand-800 ring-brand-300' : 'bg-white ring-line hover:bg-brand-25',
              )}
            >
              {tab.label}
              <span className={clsx('text-xs tabular-nums', selected ? 'text-brand-700' : 'text-muted')}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
