import { create } from 'zustand'

export const DEFAULT_TOAST_DURATION_MS = 6000

let nextId = 1

export const useToastStore = create((set) => ({
  toast: null,

  showToast: ({ durationMs = DEFAULT_TOAST_DURATION_MS, ...toast }) => {
    const id = nextId++;
    set({ toast: { ...toast, id, durationMs } });
    return id;
  },

  dismissToast: (id) =>
    set((state) =>
      id === undefined || state.toast?.id === id ? { toast: null } : state,
    ),
}));
