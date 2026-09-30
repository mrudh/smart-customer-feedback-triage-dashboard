import { CATEGORY_META, SENTIMENT_META } from '@/features/feedback/feedback.constants'
import { delay } from '@/utils/delay'
import { hasSimulation } from '@/utils/simulation'
import { SECTION_HEADINGS } from './prompt'
import { AiRequestError } from './provider'

const KEYWORDS = [
  ['substitution', /substitut/gi],
  ['delivery', /deliver|driver|\bvan\b|missing|bags|\brain\b|slot changed|driveway/gi],
  ['product_quality', /damaged|leak|defrost|use-by|quality|expired|wrong product|short dated/gi],
  ['refund', /refund|charged|payment|overdraft/gi],
  ['app_website', /\bapp\b|website|checkout|crash|page/gi],
  ['account', /account|password|voucher|address|smart pass/gi],
]

function guessCategory(item) {
  let best = { category: 'other', score: 0 }
  for (const [category, pattern] of KEYWORDS) {
    const score = 2 * (item.subject.match(pattern)?.length ?? 0) + (item.message.match(pattern)?.length ?? 0)
    if (score > best.score) best = { category, score }
  }
  return best.category
}

function guessSentiment(item) {
  const text = `${item.subject} ${item.message}`.toLowerCase()
  const positive = (text.match(/great|thanks|thank|lovely|brilliant|excellent|better|impressed|keep it up/g) ?? [])
    .length
  const negative = (
    text.match(
      /not |missing|damaged|frustrat|ruined|crash|never|charged|wrong|soaked|complain|defrost|throw them away|leak|disappoint/g,
    ) ?? []
  ).length
  if (positive > negative) return 'positive'
  if (negative > positive) return 'negative'
  return 'neutral'
}

function firstSentence(text) {
  return text.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? text
}

export function buildMockMarkdown(item) {
  const sentiment = guessSentiment(item)
  const category = guessCategory(item)
  const firstName = item.customer.name.split(' ')[0]
  const tone = {
    negative: `${firstName} is clearly unhappy and expects this to be put right.`,
    neutral: `${firstName} is matter-of-fact and mainly wants an answer.`,
    positive: `${firstName} is pleased and is sharing praise.`,
  }[sentiment]
  const next = {
    negative:
      'Apologise, confirm the facts on the order and offer an appropriate resolution (refund, redelivery or voucher).',
    neutral: 'Reply with the relevant information and confirm whether any further action is needed.',
    positive: 'Thank the customer and pass the praise on to the relevant team.',
  }[sentiment]

  return [
    `### ${SECTION_HEADINGS.coreIssue}`,
    `${item.subject}${item.orderNumber ? ` on order **#${item.orderNumber}**` : ''}.`,
    '',
    `### ${SECTION_HEADINGS.summary}`,
    `- ${firstSentence(item.message)}`,
    `- ${tone}`,
    '',
    `### ${SECTION_HEADINGS.sentiment}`,
    `**${SENTIMENT_META[sentiment].label}** - based on the language and tone of the message.`,
    '',
    `### ${SECTION_HEADINGS.category}`,
    `**${CATEGORY_META[category].label}** - ${CATEGORY_META[category].description.toLowerCase()}.`,
    '',
    `### ${SECTION_HEADINGS.nextStep}`,
    next,
  ].join('\n')
}

function* chunk(text) {
  const pieces = text.match(/\S+\s*|\s+/g) ?? []
  for (let i = 0; i < pieces.length;) {
    const size = 1 + Math.floor(Math.random() * 3)
    yield pieces.slice(i, i + size).join('')
    i += size
  }
}

export const mockProvider = {
  id: 'mock',
  label: 'Demo model (offline)',

  async *streamAnalysis({ item, signal }) {
    await delay(500 + Math.random() * 500, signal)
    const failMidway = hasSimulation('ai-error')
    let sent = 0
    for (const piece of chunk(buildMockMarkdown(item))) {
      await delay(25 + Math.random() * 55, signal)
      yield piece
      if (failMidway && ++sent === 25) {
        throw new AiRequestError('network', 'The connection dropped while the response was streaming.', true)
      }
    }
  },
}
