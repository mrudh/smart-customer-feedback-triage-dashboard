import { makeFeedback } from '@/test/fixtures'
import { DEFAULT_FILTERS } from '@/features/feedback/filters.model'
import { needsTriage, selectVisibleFeedback } from './filterFeedback'

const NOW = new Date('2026-09-26T12:00:00.000Z')

const items = [
  makeFeedback({ id: 'a', subject: 'Missing items', receivedAt: '2026-09-26T09:00:00.000Z' }),
  makeFeedback({
    id: 'b',
    subject: 'Great driver',
    customer: { id: 'c2', name: 'Emma Harris', email: 'emma@gmail.com' },
    orderNumber: '1111',
    receivedAt: '2026-09-20T09:00:00.000Z',
    triage: { status: 'resolved', sentiment: 'positive', category: 'delivery' },
  }),
  makeFeedback({
    id: 'c',
    subject: 'Refund late',
    receivedAt: '2026-08-01T09:00:00.000Z',
    triage: { status: 'in_progress', sentiment: 'negative', category: 'refund' },
  }),
]

const ids = (filters) => selectVisibleFeedback(items, { ...DEFAULT_FILTERS, ...filters }, NOW).map((i) => i.id)

describe('selectVisibleFeedback', () => {
  it('sorts newest first by default and oldest first on request', () => {
    expect(ids({})).toEqual(['a', 'b', 'c'])
    expect(ids({ sort: 'oldest' })).toEqual(['c', 'b', 'a'])
  })

  it('filters by status, sentiment (incl. unclassified) and category', () => {
    expect(ids({ status: 'resolved' })).toEqual(['b'])
    expect(ids({ sentiments: ['unclassified'] })).toEqual(['a'])
    expect(ids({ sentiments: ['positive', 'negative'] })).toEqual(['b', 'c'])
    expect(ids({ categories: ['refund'] })).toEqual(['c'])
  })

  it('searches name, order number and text with AND semantics', () => {
    expect(ids({ query: 'emma' })).toEqual(['b'])
    expect(ids({ query: '#1111' })).toEqual(['b'])
    expect(ids({ query: 'refund late' })).toEqual(['c'])
    expect(ids({ query: 'refund emma' })).toEqual([])
  })

  it('applies saved views and date ranges', () => {
    expect(ids({ view: 'needs_triage' })).toEqual(['a'])
    expect(ids({ view: 'priority' })).toEqual(['c'])
    expect(ids({ dateRange: '7d' })).toEqual(['a', 'b'])
  })
})

describe('needsTriage', () => {
  it('is true when either sentiment or category is missing', () => {
    expect(needsTriage(makeFeedback({ triage: { sentiment: 'neutral' } }))).toBe(true)
    expect(needsTriage(makeFeedback({ triage: { sentiment: 'neutral', category: 'other' } }))).toBe(false)
  })
})
