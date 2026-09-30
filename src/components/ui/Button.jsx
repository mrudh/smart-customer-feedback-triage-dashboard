import clsx from 'clsx'

const VARIANTS = {
  primary: 'bg-brand-700 text-white shadow-sm hover:bg-brand-800 disabled:bg-brand-300',
  secondary:
    'bg-white text-ink ring-1 ring-inset ring-line shadow-xs hover:bg-brand-25 hover:ring-brand-200 disabled:text-muted',
  ghost: 'text-muted hover:bg-brand-50 hover:text-brand-700',
  danger: 'bg-white text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-50',
}

const SIZES = {
  sm: 'h-8 gap-1.5 rounded-md px-2.5 text-[13px]',
  md: 'h-10 gap-2 rounded-lg px-4 text-sm',
}

export function Button({ variant = 'secondary', size = 'md', icon, className, children, type = 'button', ...rest }) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed [&>svg]:shrink-0',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
