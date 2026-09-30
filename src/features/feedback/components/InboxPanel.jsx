import clsx from 'clsx'
import { useCallback } from 'react'
import { useVisibleFeedback } from '@/features/feedback/hooks/useVisibleFeedback'
import { useFeedbackStore } from '@/features/feedback/feedbackStore'
import { FeedbackListItem } from './FeedbackListItem'
import { EmptyInboxState, ListSkeleton, LoadErrorState, NoResultsState } from './InboxStates'
import { InboxToolbar } from './InboxToolbar'

const NEXT_KEYS = new Set(['ArrowDown', 'j'])
const PREV_KEYS = new Set(['ArrowUp', 'k'])

export function InboxPanel({ onOpenFilters, className }) {
  const loadStatus = useFeedbackStore((s) => s.loadStatus)
  const loadError = useFeedbackStore((s) => s.loadError)
  const hasAnyItems = useFeedbackStore((s) => s.items.length > 0)
  const selectedId = useFeedbackStore((s) => s.selectedId)
  const selectFeedback = useFeedbackStore((s) => s.selectFeedback)
  const loadFeedback = useFeedbackStore((s) => s.loadFeedback)
  const clearFilters = useFeedbackStore((s) => s.clearFilters)
  const setFilter = useFeedbackStore((s) => s.setFilter)

  const { visible, statusCounts, totalInView, isStale } = useVisibleFeedback()

  const handleKeyDown = useCallback(
    (event) => {
      const step = NEXT_KEYS.has(event.key) ? 1 : PREV_KEYS.has(event.key) ? -1 : 0
      if (!step || visible.length === 0) return
      event.preventDefault()
      const current = visible.findIndex((item) => item.id === selectedId)
      const nextIndex = Math.min(visible.length - 1, Math.max(0, current === -1 ? 0 : current + step))
      const nextId = visible[nextIndex].id
      selectFeedback(nextId)
      event.currentTarget.querySelector(`[data-feedback-id="${nextId}"]`)?.focus()
    },
    [visible, selectedId, selectFeedback],
  )

  const resetAll = () => {
    clearFilters()
    setFilter('status', 'all')
    setFilter('view', 'all')
  }

  const isLoading = loadStatus === 'idle' || loadStatus === 'loading'

  let body
  if (isLoading) body = <ListSkeleton />
  else if (loadStatus === 'error') body = <LoadErrorState message={loadError ?? ''} onRetry={loadFeedback} />
  else if (!hasAnyItems) body = <EmptyInboxState />
  else if (visible.length === 0) body = <NoResultsState onClear={resetAll} />
  else
    body = (
      <ul
        aria-label="Feedback items"
        onKeyDown={handleKeyDown}
        className={clsx('flex flex-col gap-3 p-4 transition-opacity', isStale && 'opacity-70')}
      >
        {visible.map((item) => (
          <FeedbackListItem key={item.id} item={item} selected={item.id === selectedId} onSelect={selectFeedback} />
        ))}
      </ul>
    )

  return (
    <section
      id="feedback-inbox"
      tabIndex={-1}
      aria-label="Feedback inbox"
      aria-busy={isLoading}
      className={clsx(
        'flex min-h-0 flex-col overflow-hidden rounded-2xl border border-line bg-white focus:outline-none',
        className,
      )}
    >
      <InboxToolbar
        subtitle={
          isLoading
            ? 'Loading feedback…'
            : loadStatus === 'error'
              ? 'Unavailable'
              : `${visible.length} feedback ${visible.length === 1 ? 'item' : 'items'}`
        }
        statusCounts={statusCounts}
        totalInView={totalInView}
        onOpenFilters={onOpenFilters}
      />

      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-canvas/40">{body}</div>
    </section>
  )
}
