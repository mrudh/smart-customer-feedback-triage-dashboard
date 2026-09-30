import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { FiltersSidebar } from './FiltersSidebar'

export function FilterDrawer({ open, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()} // backdrop click
      aria-label="Filters"
      className="m-0 h-full max-h-none w-80 overflow-y-auto overscroll-contain max-w-[85vw] bg-white shadow-xl backdrop:bg-ink/30"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="font-semibold">Views & filters</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="rounded-md p-1.5 text-muted hover:bg-brand-50"
        >
          <X className="size-5" />
        </button>
      </div>
      <FiltersSidebar onNavigate={onClose} />
    </dialog>
  )
}
