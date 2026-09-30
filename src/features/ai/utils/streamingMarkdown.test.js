import { balanceStreamingMarkdown } from './streamingMarkdown'

describe('balanceStreamingMarkdown', () => {
  it('closes a dangling bold marker mid-stream', () => {
    expect(balanceStreamingMarkdown('**Nega')).toBe('**Nega**')
  })
  it('leaves balanced markdown untouched', () => {
    expect(balanceStreamingMarkdown('**Negative** - upset')).toBe('**Negative** - upset')
  })
})
