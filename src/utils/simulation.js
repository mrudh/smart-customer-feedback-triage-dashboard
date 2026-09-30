export function hasSimulation(flag) {
  if (typeof window === 'undefined') return false
  const raw = new URLSearchParams(window.location.search).get('simulate') ?? ''
  return raw
    .split(',')
    .map((s) => s.trim())
    .includes(flag)
}
