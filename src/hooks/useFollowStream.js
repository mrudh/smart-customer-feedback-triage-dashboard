import { useEffect, useRef } from 'react'

function getScrollParent(element) {
  let node = element.parentElement
  while (node) {
    const { overflowY } = getComputedStyle(node)
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) return node
    node = node.parentElement
  }
  return null
}

export function useFollowStream(sentinelRef, active, trigger) {
  const following = useRef(false)

  useEffect(() => {
    if (!active) return
    following.current = true
    const stop = () => {
      following.current = false
    }
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchmove', stop, { passive: true })
    return () => {
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchmove', stop)
    }
  }, [active])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!following.current || !sentinel) return
    const container = getScrollParent(sentinel)
    if (!container) return
    const overflowBelow = sentinel.getBoundingClientRect().bottom - container.getBoundingClientRect().bottom
    if (overflowBelow > 0) container.scrollTop += overflowBelow + 16
  }, [trigger, active, sentinelRef])
}
