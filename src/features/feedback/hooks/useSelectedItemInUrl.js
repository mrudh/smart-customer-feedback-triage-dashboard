import { useEffect, useRef } from 'react'
import { useFeedbackStore } from '@/features/feedback/feedbackStore'

export const ITEM_PARAM = 'item'

function readItemParam() {
  return new URLSearchParams(window.location.search).get(ITEM_PARAM)
}

function writeItemParam(id, mode) {
  const url = new URL(window.location.href)
  if (id) url.searchParams.set(ITEM_PARAM, id)
  else url.searchParams.delete(ITEM_PARAM)
  if (url.href === window.location.href) return
  window.history[mode === 'push' ? 'pushState' : 'replaceState'](window.history.state, '', url)
}

const itemExists = (id) => useFeedbackStore.getState().items.some((item) => item.id === id)

export function useSelectedItemInUrl() {
  const loadStatus = useFeedbackStore((s) => s.loadStatus)
  const selectedId = useFeedbackStore((s) => s.selectedId)
  const selectFeedback = useFeedbackStore((s) => s.selectFeedback)
  const hydrated = useRef(false)
  const previousId = useRef(null)

  useEffect(() => {
    if (hydrated.current || loadStatus !== 'ready') return
    hydrated.current = true
    const id = readItemParam()
    if (!id) return
    if (itemExists(id)) {
      previousId.current = id
      selectFeedback(id)
    } else {
      writeItemParam(null, 'replace')
    }
  }, [loadStatus, selectFeedback])

  useEffect(() => {
    if (!hydrated.current) return
    const movingBetweenItems = previousId.current !== null && selectedId !== null
    previousId.current = selectedId
    writeItemParam(selectedId, movingBetweenItems ? 'replace' : 'push')
  }, [selectedId])

  useEffect(() => {
    const onPopState = () => {
      const id = readItemParam()
      const next = id && itemExists(id) ? id : null
      previousId.current = next
      selectFeedback(next)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [selectFeedback])
}
