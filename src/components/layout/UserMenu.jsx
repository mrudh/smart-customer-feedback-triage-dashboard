import { ChevronDown, Copy, Mail, UsersRound } from 'lucide-react'
import { Popover } from '@/components/ui/Popover'
import { useToastStore } from '@/components/ui/toastStore'
import { CURRENT_AGENT } from '@/config/currentAgent'
import { initials } from '@/utils/format'

function AgentAvatar({ size }) {
  return (
    <span
      aria-hidden
      className={
        size === 'sm'
          ? 'inline-flex size-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800'
          : 'inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-base font-semibold text-brand-800'
      }
    >
      {initials(CURRENT_AGENT.name)}
    </span>
  )
}

export function UserMenu() {
  const showToast = useToastStore((s) => s.showToast)
  const { name, email, role, team } = CURRENT_AGENT

  const copyEmail = async (close) => {
    try {
      await navigator.clipboard.writeText(email)
      showToast({ message: 'Email copied', description: email })
    } catch {
      showToast({
        message: "Couldn't copy email",
        description: "Your browser blocked clipboard access.",
        tone: "error",
      })
    }
    close()
  }

  return (
    <Popover
      label="Your profile"
      className="sm:w-72"
      trigger={(props) => (
        <button
          type="button"
          {...props}
          aria-label={`Account: ${name}`}
          className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-brand-50 aria-expanded:bg-brand-50"
        >
          <AgentAvatar size="sm" />
          <span className="hidden text-sm font-medium sm:inline">{name}</span>
          <ChevronDown
            aria-hidden
            className="size-4 text-muted transition-transform [[aria-expanded=true]>&]:rotate-180"
          />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="flex items-center gap-3">
            <AgentAvatar size="lg" />
            <div className="min-w-0">
              <p className="truncate font-semibold">{name}</p>
              <p className="truncate text-sm text-muted">{role}</p>
            </div>
          </div>

          <dl className="mt-4 flex flex-col gap-2.5 border-t border-line pt-4 text-sm">
            <div className="flex items-center gap-2.5">
              <dt>
                <Mail aria-hidden className="size-4 text-muted" />
                <span className="sr-only">Email</span>
              </dt>
              <dd className="flex min-w-0 flex-1 items-center gap-2">
                <a href={`mailto:${email}`} className="min-w-0 flex-1 truncate hover:text-brand-700 hover:underline">
                  {email}
                </a>
                <button
                  type="button"
                  onClick={() => void copyEmail(close)}
                  aria-label="Copy email address"
                  title="Copy email address"
                  className="shrink-0 rounded-md p-1.5 text-muted hover:bg-brand-50 hover:text-brand-700"
                >
                  <Copy className="size-4" />
                </button>
              </dd>
            </div>
            <div className="flex items-center gap-2.5">
              <dt>
                <UsersRound aria-hidden className="size-4 text-muted" />
                <span className="sr-only">Team</span>
              </dt>
              <dd>{team}</dd>
            </div>
          </dl>
        </>
      )}
    </Popover>
  )
}
