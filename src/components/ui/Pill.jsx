import clsx from 'clsx'

export function Pill({ children, tone = 'bg-slate-100 text-slate-700 ring-slate-200', dot, icon, dashed, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        dashed ? 'bg-white text-muted ring-0 outline-1 -outline-offset-1 outline-slate-300 outline-dashed' : tone,
        className,
      )}
    >
      {dot && <span aria-hidden className={clsx('size-2 rounded-full', dot)} />}
      {icon}
      {children}
    </span>
  )
}
