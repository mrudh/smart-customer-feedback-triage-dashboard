import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

export function Select({ leading, className, children, ...rest }) {
  return (
    <div className={clsx('relative', className)}>
      {leading && <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">{leading}</span>}
      <select
        className={clsx(
          'h-10 w-full cursor-pointer appearance-none rounded-lg bg-white pr-9 text-sm text-ink ring-1 ring-line ring-inset hover:ring-brand-300',
          leading ? 'pl-8' : 'pl-3',
        )}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
      />
    </div>
  )
}
