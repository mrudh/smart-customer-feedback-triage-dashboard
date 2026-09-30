import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

const GEMINI_ORIGIN = 'https://generativelanguage.googleapis.com'

function geminiProxy(apiKey, target) {
  if (!apiKey) return {}
  return {
    '/api/gemini': {
      target,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/gemini/, ''),
      headers: { 'x-goog-api-key': apiKey },
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.GEMINI_API_KEY?.trim() || undefined
  const proxy = geminiProxy(apiKey, env.GEMINI_API_ORIGIN?.trim() || GEMINI_ORIGIN)

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    define: {
      __GEMINI_ENABLED__: JSON.stringify(Boolean(apiKey) && env.AI_PROVIDER !== 'mock'),
      __GEMINI_MODEL__: JSON.stringify(env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash'),
    },
    server: { proxy },
    preview: { proxy },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.js'],
    },
  }
})
