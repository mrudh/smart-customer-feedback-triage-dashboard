import { CircleHelp } from 'lucide-react'
import { Popover } from '@/components/ui/Popover'

const SHORTCUTS = [
  { keys: ['↑', '↓'], description: 'Move between feedback items' },
  { keys: ['J', 'K'], description: 'Next / previous item' },
  { keys: ['Esc'], description: 'Stop AI generation or close a panel' },
  { keys: ['⌘/Ctrl', 'Enter'], description: 'Save an internal note' },
]

export function HelpMenu() {
  return (
    <Popover
      label="Keyboard shortcuts"
      className="sm:w-80"
      trigger={(props) => (
        <button
          type="button"
          {...props}
          aria-label="Help and keyboard shortcuts"
          className="inline-flex size-9 items-center justify-center rounded-full text-muted ring-1 ring-line hover:text-brand-700 aria-expanded:bg-brand-50 aria-expanded:text-brand-700"
        >
          <CircleHelp className="size-5" />
        </button>
      )}
    >
      <p className="font-semibold">Keyboard shortcuts</p>
      <p className="mt-0.5 text-xs text-muted">Arrow keys and J / K work while the inbox list has focus.</p>
      <ul className="mt-3 flex flex-col gap-2.5 text-sm">
        {SHORTCUTS.map(({ keys, description }) => (
          <li key={description} className="flex items-center justify-between gap-4">
            <span>{description}</span>
            <span className="flex shrink-0 gap-1">
              {keys.map((key) => (
                <kbd
                  key={key}
                  className="min-w-6 rounded-md border border-line bg-canvas px-1.5 py-0.5 text-center font-sans text-xs font-medium text-ink shadow-[0_1px_0_var(--color-line)]"
                >
                  {key}
                </kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </Popover>
  )
}
