const DAY_MS = 24 * 60 * 60 * 1000

export const needsTriage = (item) => item.triage.sentiment === null || item.triage.category === null

const VIEW_PREDICATES = {
  all: () => true,
  needs_triage: needsTriage,
  priority: (item) => item.triage.sentiment === 'negative' && item.triage.status !== 'resolved',
}

export const matchesView = (item, view) => VIEW_PREDICATES[view](item)

function startOfRange(range, now) {
  switch (range) {
    case 'all':
      return null
    case 'today': {
      const start = new Date(now)
      start.setHours(0, 0, 0, 0)
      return start.getTime()
    }
    case '7d':
      return now.getTime() - 7 * DAY_MS
    case '30d':
      return now.getTime() - 30 * DAY_MS
  }
}

function matchesQuery(item, normalisedQuery) {
  if (!normalisedQuery) return true
  const haystack = [
    item.customer.name,
    item.customer.email,
    item.orderNumber ?? '',
    item.orderNumber ? `#${item.orderNumber}` : '',
    item.subject,
    item.message,
  ]
    .join(' ')
    .toLowerCase()
  return normalisedQuery.split(/\s+/).every((term) => haystack.includes(term))
}

export function applyNonStatusFilters(items, filters, now = new Date()) {
  const query = filters.query.trim().toLowerCase()
  const from = startOfRange(filters.dateRange, now)
  const sentiments = new Set(filters.sentiments)
  const categories = new Set(filters.categories)

  return items.filter((item) => {
    if (!matchesView(item, filters.view)) return false
    if (from !== null && new Date(item.receivedAt).getTime() < from) return false
    if (sentiments.size && !sentiments.has(item.triage.sentiment ?? 'unclassified')) return false
    if (categories.size && !categories.has(item.triage.category ?? 'unclassified')) return false
    return matchesQuery(item, query)
  })
}

export function sortFeedback(items, sort) {
  const direction = sort === 'newest' ? -1 : 1
  // ISO strings sort lexicographically in chronological order.
  return [...items].sort((a, b) => (a.receivedAt < b.receivedAt ? -direction : direction))
}

export function selectVisibleFeedback(items, filters, now = new Date()) {
  const filtered = applyNonStatusFilters(items, filters, now).filter(
    (item) => filters.status === 'all' || item.triage.status === filters.status,
  )
  return sortFeedback(filtered, filters.sort)
}

export function countBy(items, key) {
  const counts = {}
  for (const item of items) {
    const k = key(item)
    counts[k] = (counts[k] ?? 0) + 1
  }
  return counts
}

export function countActiveFilters(filters) {
  return filters.sentiments.length + filters.categories.length + (filters.dateRange === 'all' ? 0 : 1)
}
