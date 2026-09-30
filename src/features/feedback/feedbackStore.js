import { create } from 'zustand'
import { CURRENT_AGENT } from '@/config/currentAgent'
import { fetchFeedback } from './feedbackApi'
import { DEFAULT_FILTERS } from './filters.model'

let inflightLoad = null

const isAbort = (error) => error instanceof DOMException && error.name === 'AbortError'

const newId = (prefix) =>
  `${prefix}_${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now().toString(36)}`

export const useFeedbackStore = create((set) => {
  const updateItem = (id, update) =>
    set((state) => ({ items: state.items.map((item) => (item.id === id ? update(item) : item)) }))

  return {
    items: [],
    loadStatus: 'idle',
    loadError: null,
    selectedId: null,
    filters: DEFAULT_FILTERS,

    loadFeedback: async () => {
      inflightLoad?.abort()
      const controller = new AbortController()
      inflightLoad = controller
      set({ loadStatus: 'loading', loadError: null })
      try {
        const items = await fetchFeedback(controller.signal)
        if (inflightLoad !== controller) return
        set({ items, loadStatus: 'ready' })
      } catch (error) {
        if (isAbort(error) || controller.signal.aborted) return
        set({ loadStatus: 'error', loadError: error instanceof Error ? error.message : 'Something went wrong.' })
      } finally {
        if (inflightLoad === controller) inflightLoad = null
      }
    },

    selectFeedback: (id) => set({ selectedId: id }),

    setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),

    toggleFilterValue: (key, value) =>
      set((state) => {
        const current = state.filters[key]
        const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
        return { filters: { ...state.filters, [key]: next } }
      }),

    clearFilters: () =>
      set((state) => ({
        filters: { ...state.filters, sentiments: [], categories: [], dateRange: 'all', query: '' },
      })),

    updateTriage: (id, patch, source) =>
      updateItem(id, (item) => {
        const classificationChanged =
          ('sentiment' in patch && patch.sentiment !== item.triage.sentiment) ||
          ('category' in patch && patch.category !== item.triage.category)
        return {
          ...item,
          triage: {
            ...item.triage,
            ...patch,
            classifiedBy: classificationChanged ? source : item.triage.classifiedBy,
            updatedAt: new Date().toISOString(),
          },
        }
      }),

    restoreTriage: (id, snapshot) => updateItem(id, (item) => ({ ...item, triage: { ...snapshot } })),

    addNote: (id, body) =>
      updateItem(id, (item) => ({
        ...item,
        notes: [
          ...item.notes,
          { id: newId('note'), body: body.trim(), author: CURRENT_AGENT.name, createdAt: new Date().toISOString() },
        ],
      })),
  }
})

export const selectSelectedItem = (state) =>
  state.selectedId ? (state.items.find((item) => item.id === state.selectedId) ?? null) : null
