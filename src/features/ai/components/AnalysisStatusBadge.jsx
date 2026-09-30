import clsx from 'clsx'

const BADGES = {
  connecting: { label: 'Connecting', className: 'bg-brand-50 text-brand-700 ring-brand-200' },
  streaming: { label: 'Generating', className: 'bg-brand-50 text-brand-700 ring-brand-200' },
  complete: { label: 'Completed', className: 'bg-green-50 text-green-800 ring-green-200' },
  cancelled: { label: 'Stopped', className: 'bg-slate-100 text-slate-700 ring-slate-200' },
  error: { label: 'Failed', className: 'bg-red-50 text-red-800 ring-red-200' },
}

export function AnalysisStatusBadge({ status }) {
  if (status === 'idle') return null
  const badge = BADGES[status]
  const live = status === 'connecting' || status === 'streaming'
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset',
        badge.className,
      )}
    >
      {live && (
        <span aria-hidden className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-brand-600" />
        </span>
      )}
      {badge.label}
    </span>
  )
}
