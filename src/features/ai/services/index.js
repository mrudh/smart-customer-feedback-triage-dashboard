import { createGeminiProvider } from './geminiProvider'
import { mockProvider } from './mockProvider'

export const aiProvider = __GEMINI_ENABLED__ ? createGeminiProvider(__GEMINI_MODEL__) : mockProvider

export { AiRequestError, StreamAbort } from './provider'
