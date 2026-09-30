import { streamOf } from '@/test/fixtures'
import { readSseData } from './sse'

async function collect(stream) {
  const out = []
  for await (const data of readSseData(stream)) out.push(data)
  return out
}

describe('readSseData', () => {
  it('yields the data payload of each event', async () => {
    expect(await collect(streamOf(['data: one\n\ndata: two\n\n']))).toEqual(['one', 'two'])
  })

  it('reassembles events split across network chunks', async () => {
    expect(await collect(streamOf(['da', 'ta: {"a":', '1}\n', '\ndata: b\n\n']))).toEqual(['{"a":1}', 'b'])
  })

  it('handles CRLF line endings, comments and multi-line data', async () => {
    expect(await collect(streamOf([': keep-alive\r\n\r\ndata: line1\r\ndata: line2\r\n\r\n']))).toEqual([
      'line1\nline2',
    ])
  })

  it('decodes multi-byte characters split across chunks', async () => {
    const bytes = new TextEncoder().encode('data: £10\n\n')
    const split = bytes.indexOf(0xa3) // second byte of "£"
    expect(await collect(streamOf([bytes.slice(0, split), bytes.slice(split)]))).toEqual(['£10'])
  })

  it('flushes a final event with no trailing blank line', async () => {
    expect(await collect(streamOf(['data: last']))).toEqual(['last'])
  })
})
