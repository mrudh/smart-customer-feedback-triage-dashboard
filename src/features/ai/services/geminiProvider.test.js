import { makeFeedback, streamOf } from '@/test/fixtures'
import { createGeminiProvider } from './geminiProvider'
import { AiRequestError } from './provider'

const sse = (obj) => `data: ${JSON.stringify(obj)}\n\n`
const textChunk = (text, extra = {}) => sse({ candidates: [{ content: { parts: [{ text }] }, ...extra }] })

async function collect(iterable) {
  let out = ''
  for await (const chunk of iterable) out += chunk
  return out
}

describe('geminiProvider', () => {
  const provider = createGeminiProvider('gemini-2.5-flash')
  const run = () => collect(provider.streamAnalysis({ item: makeFeedback(), signal: new AbortController().signal }))

  afterEach(() => vi.unstubAllGlobals())

  it('posts to the same-origin proxy and yields text parts, skipping thoughts', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(
          streamOf([
            sse({ candidates: [{ content: { parts: [{ text: 'thinking…', thought: true }] } }] }),
            textChunk('Hello '),
            textChunk('world', { finishReason: 'STOP' }),
          ]),
          { status: 200 },
        ),
      )
    vi.stubGlobal('fetch', fetchMock)

    expect(await run()).toBe('Hello world')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/gemini/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse')
    expect(JSON.parse(init.body).generationConfig.thinkingConfig).toEqual({ thinkingBudget: 0 })
  })

  it.each([
    [429, 'rate_limit'],
    [403, 'auth'],
    [503, 'server'],
  ])('maps HTTP %i to a %s error', async (status, kind) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status })))
    await expect(run()).rejects.toMatchObject({ kind })
  })

  it('reports safety blocks as non-retryable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(streamOf([textChunk('', { finishReason: 'SAFETY' })]))),
    )
    const error = await run().catch((e) => e)
    expect(error).toBeInstanceOf(AiRequestError)
    expect(error).toMatchObject({ kind: 'blocked', retryable: false })
  })

  it('reports network failures as retryable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(run()).rejects.toMatchObject({ kind: 'network', retryable: true })
  })
})
