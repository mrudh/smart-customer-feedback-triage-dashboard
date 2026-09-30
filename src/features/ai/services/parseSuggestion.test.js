import { extractSection, parseTriageSuggestion } from './parseSuggestion'

const RESPONSE = `### Core issue
Items missing from the delivery.

### Sentiment
**Negative** - the customer is frustrated.

### Suggested category
**Delivery** - missing items.

### Suggested next step
Refund the missing items.`

describe('parseTriageSuggestion', () => {
  it('extracts sentiment and category from the bold values', () => {
    expect(parseTriageSuggestion(RESPONSE)).toEqual({ sentiment: 'negative', category: 'delivery' })
  })

  it('maps multi-word labels back to their keys', () => {
    const md = RESPONSE.replace('**Delivery**', '**App & website**')
    expect(parseTriageSuggestion(md)?.category).toBe('app_website')
  })

  it('falls back to the first mention when the value is not bold', () => {
    const md = RESPONSE.replace('**Negative**', 'Mostly negative')
    expect(parseTriageSuggestion(md)?.sentiment).toBe('negative')
  })

  it('returns null when nothing recognisable is present', () => {
    expect(parseTriageSuggestion('Just some text')).toBeNull()
  })

  it('does not treat a partially streamed section as complete data', () => {
    expect(parseTriageSuggestion('### Sentiment\n**Neg')).toBeNull()
  })
})

describe('extractSection', () => {
  it('returns only the body up to the next heading', () => {
    expect(extractSection(RESPONSE, 'Core issue')).toBe('Items missing from the delivery.')
  })
})
