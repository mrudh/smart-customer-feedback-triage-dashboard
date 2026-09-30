import { useDeferredValue, useMemo } from 'react'
import { applyNonStatusFilters, countBy, sortFeedback } from '@/features/feedback/utils/filterFeedback'
import { useFeedbackStore } from '@/features/feedback/feedbackStore'

export function useVisibleFeedback() {
  const items = useFeedbackStore((s) => s.items)
  const filters = useFeedbackStore((s) => s.filters)
  const deferredFilters = useDeferredValue(filters)

  const withoutStatus = useMemo(() => applyNonStatusFilters(items, deferredFilters), [items, deferredFilters])

  const visible = useMemo(
    () =>
      sortFeedback(
        deferredFilters.status === 'all'
          ? withoutStatus
          : withoutStatus.filter((item) => item.triage.status === deferredFilters.status),
        deferredFilters.sort,
      ),
    [withoutStatus, deferredFilters.status, deferredFilters.sort],
  )

  const statusCounts = useMemo(() => countBy(withoutStatus, (item) => item.triage.status), [withoutStatus])

  return { visible, statusCounts, totalInView: withoutStatus.length, isStale: filters !== deferredFilters }
}
