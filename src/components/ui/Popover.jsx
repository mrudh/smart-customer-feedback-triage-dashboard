import clsx from 'clsx'
import { useCallback, useId, useRef, useState } from 'react'
import { useDismiss } from '@/hooks/useDismiss'

export function Popover({ trigger, label, children, className }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const panelId = useId()
  const close = useCallback(() => setOpen(false), [])

  useDismiss(containerRef, triggerRef, open, close)

  return (
    <div ref={containerRef} className="relative">
      {trigger({
        ref: triggerRef,
        onClick: () => setOpen((o) => !o),
        'aria-expanded': open,
        'aria-controls': panelId,
      })}
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className={clsx(
            'z-40 animate-[toast-in_140ms_ease-out] rounded-xl border border-line bg-white p-4 shadow-lg',
            'fixed inset-x-3 top-[4.25rem] max-h-[calc(100dvh-5rem)] overflow-y-auto',
            'sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:max-w-[calc(100vw-2rem)]',
            className,
          )}
        >
          {typeof children === 'function' ? children(close) : children}
        </div>
      )}
    </div>
  )
}
