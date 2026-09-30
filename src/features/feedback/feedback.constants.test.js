import { CATEGORY_META, CHANNEL_META, SENTIMENT_META, STATUS_META, VIEW_META } from './feedback.constants'
import { FEEDBACK_CATEGORIES, FEEDBACK_CHANNELS, FEEDBACK_STATUSES, SENTIMENTS } from './feedback.model'
import { INBOX_VIEWS } from './filters.model'

describe('feedback.constants', () => {
  it.each([
    ['sentiment', SENTIMENTS, SENTIMENT_META],
    ['status', FEEDBACK_STATUSES, STATUS_META],
    ['category', FEEDBACK_CATEGORIES, CATEGORY_META],
    ['channel', FEEDBACK_CHANNELS, CHANNEL_META],
    ['view', INBOX_VIEWS, VIEW_META],
  ])('every %s has a label', (_, values, meta) => {
    for (const value of values) expect(meta[value]?.label, value).toBeTruthy()
  })
})
