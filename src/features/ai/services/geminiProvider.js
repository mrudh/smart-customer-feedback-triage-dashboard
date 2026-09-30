import { buildUserPrompt, SYSTEM_INSTRUCTION } from './prompt'
import { readSseData } from './sse'
import { AiRequestError } from './provider'

const BLOCKED_FINISH_REASONS = new Set(['SAFETY', 'RECITATION', 'BLOCKLIST', 'PROHIBITED_CONTENT', 'SPII'])

function prettyModelName(model) {
  return model
    .replace(/^gemini-/, 'Gemini ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

async function toHttpError(response) {
  let detail = ''
  try {
    const body = await response.json()
    const err = Array.isArray(body) ? body[0]?.error : body.error
    detail = err?.message ?? ''
  } catch {
    /* non-JSON error body */
  }

  const { status } = response
  if (status === 429)
    return new AiRequestError('rate_limit', 'The AI service is busy (rate limit reached). Wait a moment and try again.')
  if (status === 401 || status === 403 || /api key/i.test(detail))
    return new AiRequestError('auth', 'The AI service rejected our credentials. Check GEMINI_API_KEY in .env.local.')
  if (status === 404)
    return new AiRequestError('unknown', `The configured model was not found. ${detail}`.trim(), false)
  if (status >= 500) return new AiRequestError('server', 'The AI service had a problem. Please try again.')
  return new AiRequestError('unknown', detail || `Request failed (${status}).`)
}

export function createGeminiProvider(model) {
  const thinkingConfig = model.startsWith('gemini-2.5-flash') ? { thinkingBudget: 0 } : undefined

  return {
    id: 'gemini',
    label: prettyModelName(model),

    async *streamAnalysis({ item, signal }) {
      let response
      try {
        response = await fetch(`/api/gemini/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal,
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            contents: [{ role: 'user', parts: [{ text: buildUserPrompt(item) }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 1024, thinkingConfig },
          }),
        })
      } catch {
        if (signal.aborted) throw signal.reason
        throw new AiRequestError(
          'network',
          'Could not reach the AI service. Check your connection and try again.',
          true,
        )
      }

      if (!response.ok) throw await toHttpError(response)
      if (!response.body) throw new AiRequestError('server', 'The AI service returned an empty response.')

      try {
        for await (const data of readSseData(response.body)) {
          const chunk = JSON.parse(data)
          if (chunk.error)
            throw new AiRequestError('server', chunk.error.message ?? 'The AI service reported an error.')
          if (chunk.promptFeedback?.blockReason)
            throw new AiRequestError('blocked', 'This feedback could not be analysed by the AI safety filters.')

          const candidate = chunk.candidates?.[0]
          const text = candidate?.content?.parts
            ?.filter((part) => !part.thought)
            .map((part) => part.text ?? '')
            .join('')
          if (text) yield text

          if (candidate?.finishReason && BLOCKED_FINISH_REASONS.has(candidate.finishReason))
            throw new AiRequestError('blocked', 'The AI stopped this response because of its content filters.')
        }
      } catch (error) {
        if (signal.aborted) throw signal.reason
        if (error instanceof AiRequestError) throw error
        throw new AiRequestError('network', 'The connection dropped while the response was streaming.', true)
      }
    },
  }
}
