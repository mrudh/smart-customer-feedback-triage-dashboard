import { delay } from '@/utils/delay'
import { AiRequestError } from '@/features/ai/services'
import { makeFeedback } from '@/test/fixtures'
import { createAiStore } from './aiStore'

const RESPONSE = ['### Sentiment\n', '**Negative** - upset.\n\n', '### Suggested category\n', '**Delivery** - late.']

function fakeProvider(chunks, opts = {}) {
  return {
    id: 'fake',
    label: 'Fake',
    async *streamAnalysis({ signal }) {
      for (const [i, chunk] of chunks.entries()) {
        await delay(opts.gapMs ?? 5, signal)
        if (opts.failAfter === i) throw new AiRequestError('rate_limit', 'Slow down')
        yield chunk
      }
    },
  }
}

const item = makeFeedback()

describe('aiStore', () => {
  it('streams to completion and parses a suggestion', async () => {
    const store = createAiStore(fakeProvider(RESPONSE))
    const run = store.getState().startAnalysis(item)
    expect(store.getState().analyses[item.id]?.status).toBe('connecting')
    await run
    const analysis = store.getState().analyses[item.id]
    expect(analysis.status).toBe('complete')
    expect(analysis.markdown).toBe(RESPONSE.join(''))
    expect(analysis.suggestion).toEqual({ sentiment: 'negative', category: 'delivery' })
  })

  it('keeps partial text and marks the run cancelled when the user stops it', async () => {
    const store = createAiStore(fakeProvider(RESPONSE, { gapMs: 20 }))
    const run = store.getState().startAnalysis(item)
    await delay(50)
    store.getState().cancelAnalysis(item.id)
    await run
    const analysis = store.getState().analyses[item.id]
    expect(analysis.status).toBe('cancelled')
    expect(analysis.markdown.length).toBeGreaterThan(0)
    expect(analysis.markdown.length).toBeLessThan(RESPONSE.join('').length)
  })

  it('surfaces typed provider errors', async () => {
    const store = createAiStore(fakeProvider(RESPONSE, { failAfter: 2 }))
    await store.getState().startAnalysis(item)
    const analysis = store.getState().analyses[item.id]
    expect(analysis.status).toBe('error')
    expect(analysis.error).toMatchObject({ kind: 'rate_limit', retryable: true })
    expect(analysis.markdown).toBe(RESPONSE.slice(0, 2).join(''))
  })

  it('lets a newer run supersede an older one without mixing their text', async () => {
    const store = createAiStore(fakeProvider(RESPONSE, { gapMs: 15 }))
    const first = store.getState().startAnalysis(item)
    await delay(20)
    const second = store.getState().startAnalysis(item)
    await Promise.all([first, second])
    const analysis = store.getState().analyses[item.id]
    expect(analysis.status).toBe('complete')
    expect(analysis.markdown).toBe(RESPONSE.join(''))
  })

  it('runs analyses for different items independently', async () => {
    const store = createAiStore(fakeProvider(RESPONSE))
    const other = makeFeedback({ id: 'ofb_other' })
    await Promise.all([store.getState().startAnalysis(item), store.getState().startAnalysis(other)])
    expect(store.getState().analyses[item.id]?.status).toBe('complete')
    expect(store.getState().analyses[other.id]?.status).toBe('complete')
  })
})
