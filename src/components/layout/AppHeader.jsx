import ocadoLogo from '@/assets/ocado-logo.png'
import { HelpMenu } from './HelpMenu'
import { UserMenu } from './UserMenu'

export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-white px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <img src={ocadoLogo} alt="Ocado" width={505} height={112} className="h-7 w-auto" />
        <span aria-hidden className="hidden h-7 w-px bg-line sm:block" />
        <h1 className="sr-only text-base font-semibold sm:not-sr-only">Customer Feedback Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <HelpMenu />
        <span aria-hidden className="hidden h-7 w-px bg-line sm:block" />
        <UserMenu />
      </div>
    </header>
  )
}
