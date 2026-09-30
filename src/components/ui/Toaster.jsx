import { CircleAlert, CircleCheck, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useToastStore } from './toastStore'

export function Toaster() {
  const toast = useToastStore((s) => s.toast)
  const dismissToast = useToastStore((s) => s.dismissToast)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!toast || paused) return
    const timer = setTimeout(() => dismissToast(toast.id), toast.durationMs)
    return () => clearTimeout(timer)
  }, [toast, paused, dismissToast])

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 sm:bottom-24"
    >
      {toast && (
        <div
          key={toast.id}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="pointer-events-auto flex w-full max-w-md animate-[toast-in_180ms_ease-out] items-center gap-3 rounded-xl bg-ink py-3 pr-2 pl-4 text-sm text-white shadow-lg"
        >
          {toast.tone === 'error' ? (
            <CircleAlert aria-hidden className="size-5 shrink-0 text-red-400" />
          ) : (
            <CircleCheck aria-hidden className="size-5 shrink-0 text-green-400" />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-medium">{toast.message}</p>
            {toast.description && <p className="truncate text-white/70">{toast.description}</p>}
          </div>
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action.onAction()
                dismissToast(toast.id)
              }}
              className="rounded-md px-3 py-1.5 font-semibold text-brand-200 hover:bg-white/10 hover:text-white focus-visible:outline-brand-300"
            >
              {toast.action.label}
            </button>
          )}
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => dismissToast(toast.id)}
            className="rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
