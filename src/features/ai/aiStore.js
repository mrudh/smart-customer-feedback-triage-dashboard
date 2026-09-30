import { create } from 'zustand'
import { createFrameBuffer } from '@/utils/frameBuffer'
import { aiProvider, AiRequestError, StreamAbort } from '@/features/ai/services'
import { parseTriageSuggestion } from '@/features/ai/services/parseSuggestion'
import { EMPTY_ANALYSIS } from './ai.model'

export const STREAM_IDLE_TIMEOUT_MS = 20_000

function toAiError(error) {
  if (error instanceof AiRequestError) return { kind: error.kind, message: error.message, retryable: error.retryable }
  if (error instanceof StreamAbort && error.cause === 'timeout')
    return { kind: 'timeout', message: 'The AI stopped responding. Please try again.', retryable: true }
  return { kind: 'unknown', message: 'Something went wrong while generating the analysis.', retryable: true }
}

export function createAiStore(provider = aiProvider) {
  const controllers = new Map()

  return create((set, get) => {
    const patch = (id, update) =>
      set((state) => {
        const prev = state.analyses[id] ?? EMPTY_ANALYSIS
        const next = typeof update === 'function' ? update(prev) : update
        return { analyses: { ...state.analyses, [id]: { ...prev, ...next } } }
      })

    return {
      analyses: {},

      startAnalysis: async (item) => {
        const id = item.id
        controllers.get(id)?.abort(new StreamAbort('superseded'))
        const controller = new AbortController()
        controllers.set(id, controller)
        const isCurrent = () => controllers.get(id) === controller

        patch(id, { ...EMPTY_ANALYSIS, status: 'connecting', startedAt: Date.now(), provider: provider.label })

        const buffer = createFrameBuffer((text) => {
          if (!isCurrent()) return
          patch(id, (prev) => ({ markdown: prev.markdown + text, status: 'streaming' }))
        })

        let watchdog
        const armWatchdog = () => {
          clearTimeout(watchdog)
          watchdog = setTimeout(() => controller.abort(new StreamAbort('timeout')), STREAM_IDLE_TIMEOUT_MS)
        }

        try {
          armWatchdog()
          for await (const text of provider.streamAnalysis({ item, signal: controller.signal })) {
            armWatchdog()
            buffer.push(text)
          }
          buffer.flush()
          if (!isCurrent()) return
          const { markdown } = get().analyses[id] ?? EMPTY_ANALYSIS
          if (!markdown.trim()) throw new AiRequestError('server', 'The AI returned an empty response.')
          patch(id, { status: 'complete', completedAt: Date.now(), suggestion: parseTriageSuggestion(markdown) })
        } catch (error) {
          buffer.flush()
          if (!isCurrent()) return
          const reason = controller.signal.aborted ? controller.signal.reason : error
          if (reason instanceof StreamAbort && reason.cause === 'user') {
            patch(id, { status: 'cancelled', completedAt: Date.now() })
          } else {
            patch(id, { status: 'error', error: toAiError(reason), completedAt: Date.now() })
          }
        } finally {
          clearTimeout(watchdog)
          buffer.dispose()
          if (isCurrent()) controllers.delete(id)
        }
      },

      cancelAnalysis: (feedbackId) => controllers.get(feedbackId)?.abort(new StreamAbort('user')),

      rateAnalysis: (feedbackId, rating) => patch(feedbackId, { rating }),

      setReview: (feedbackId, review) => patch(feedbackId, { review }),
    }
  })
}

export const useAiStore = createAiStore()

export const selectAnalysis = (feedbackId) => (state) => state.analyses[feedbackId] ?? EMPTY_ANALYSIS
