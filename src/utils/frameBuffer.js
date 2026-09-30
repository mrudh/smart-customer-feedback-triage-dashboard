const schedule = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (cb) => setTimeout(cb, 16)
const unschedule = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : (id) => clearTimeout(id)

export function createFrameBuffer(commit) {
  let pending = ''
  let frame = null

  const flush = () => {
    if (frame !== null) {
      unschedule(frame)
      frame = null
    }
    if (!pending) return
    const text = pending
    pending = ''
    commit(text)
  }

  return {
    push(text) {
      pending += text
      if (frame === null) frame = schedule(flush)
    },
    flush,
    dispose() {
      if (frame !== null) unschedule(frame)
      frame = null
      pending = ''
    },
  }
}
