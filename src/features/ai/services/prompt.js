import { CATEGORY_META, CHANNEL_META, SENTIMENT_META } from '@/features/feedback/feedback.constants'
import { FEEDBACK_CATEGORIES, SENTIMENTS } from '@/features/feedback/feedback.model'

export const SECTION_HEADINGS = {
  coreIssue: 'Core issue',
  summary: 'Summary',
  sentiment: 'Sentiment',
  category: 'Suggested category',
  nextStep: 'Suggested next step',
}

const sentimentLabels = SENTIMENTS.map((s) => SENTIMENT_META[s].label).join(' | ')
const categoryLabels = FEEDBACK_CATEGORIES.map((c) => CATEGORY_META[c].label).join(' | ')

export const SYSTEM_INSTRUCTION = `You are a triage assistant for Ocado Retail's customer service team (UK online grocery).
Analyse ONE piece of customer feedback and reply in concise British English markdown using EXACTLY this structure:

### ${SECTION_HEADINGS.coreIssue}
One sentence stating the underlying problem (or praise).

### ${SECTION_HEADINGS.summary}
- 2 to 3 short bullet points with the key facts.

### ${SECTION_HEADINGS.sentiment}
**<one of: ${sentimentLabels}>** - a short justification.

### ${SECTION_HEADINGS.category}
**<one of: ${categoryLabels}>** - a short justification.

### ${SECTION_HEADINGS.nextStep}
One sentence recommending what the agent should do next.

Rules: do not invent order details, amounts or policies that are not in the feedback. Do not add any other sections, preamble or closing remarks.`

export function buildUserPrompt(item) {
  return [
    `Channel: ${CHANNEL_META[item.channel].label}`,
    `Order: ${item.orderNumber ? `#${item.orderNumber}` : 'not provided'}`,
    `Subject: ${item.subject}`,
    '',
    'Customer message:',
    '"""',
    item.message,
    '"""',
  ].join('\n')
}
