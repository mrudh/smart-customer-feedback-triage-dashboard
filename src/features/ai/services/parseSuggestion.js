import { CATEGORY_META, SENTIMENT_META } from '@/features/feedback/feedback.constants'
import { FEEDBACK_CATEGORIES, SENTIMENTS } from '@/features/feedback/feedback.model'
import { SECTION_HEADINGS } from './prompt'

const normalise = (value) => value.toLowerCase().replace(/[^a-z]/g, '')

export function extractSection(markdown, heading) {
  const lines = markdown.split('\n')
  const target = normalise(heading)
  const start = lines.findIndex((line) => /^#{1,6}\s/.test(line) && normalise(line) === target)
  if (start === -1) return null
  const rest = lines.slice(start + 1)
  const end = rest.findIndex((line) => /^#{1,6}\s/.test(line))
  return (end === -1 ? rest : rest.slice(0, end)).join('\n').trim()
}

function matchEnum(section, values, labelOf) {
  if (!section) return null
  const candidates = values.map((value) => ({ value, keys: [normalise(labelOf(value)), normalise(value)] }))

  const bold = section.match(/\*\*(.+?)\*\*/)?.[1]
  if (bold) {
    const hit = candidates.find((c) => c.keys.includes(normalise(bold)))
    if (hit) return hit.value
  }

  const flat = normalise(section)
  let best = null
  for (const { value, keys } of candidates) {
    for (const key of keys) {
      const index = flat.indexOf(key)
      if (index !== -1 && (!best || index < best.index)) best = { value, index }
    }
  }
  return best?.value ?? null
}

export function parseTriageSuggestion(markdown) {
  const sentiment = matchEnum(
    extractSection(markdown, SECTION_HEADINGS.sentiment),
    SENTIMENTS,
    (s) => SENTIMENT_META[s].label,
  )
  const category = matchEnum(
    extractSection(markdown, SECTION_HEADINGS.category),
    FEEDBACK_CATEGORIES,
    (c) => CATEGORY_META[c].label,
  )
  return sentiment || category ? { sentiment, category } : null
}
