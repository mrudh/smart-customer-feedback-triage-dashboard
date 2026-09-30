import { CircleAlert, Inbox, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ListSkeleton({ rows = 6 }) {
  return (
    <ul aria-hidden className="flex flex-col gap-3 p-4">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex gap-3 rounded-xl border border-line bg-white p-4">
          <div className="skeleton size-10 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex justify-between gap-4">
              <div className="skeleton h-4 w-2/3" />
              <div className="skeleton h-3 w-10" />
            </div>
            <div className="skeleton h-3 w-1/2" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-4/5" />
            <div className="mt-1 flex gap-2">
              <div className="skeleton h-5 w-20 rounded-full" />
              <div className="skeleton h-5 w-16 rounded-full" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function StateMessage({ icon, title, body, action, role = 'status' }) {
  return (
    <div role={role} className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">{icon}</span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 max-w-xs text-sm text-muted">{body}</p>
      </div>
      {action}
    </div>
  )
}

export const LoadErrorState = ({ message, onRetry }) => (
  <StateMessage
    role="alert"
    icon={<CircleAlert className="size-6" />}
    title="Couldn't load feedback"
    body={message}
    action={
      <Button variant="primary" size="sm" onClick={onRetry}>
        Try again
      </Button>
    }
  />
)

export const EmptyInboxState = () => (
  <StateMessage
    icon={<Inbox className="size-6" />}
    title="Inbox zero"
    body="There's no customer feedback yet. New feedback will appear here as it arrives."
  />
)

export const NoResultsState = ({ onClear }) => (
  <StateMessage
    icon={<SearchX className="size-6" />}
    title="No feedback matches"
    body="Try a different search term or remove some filters."
    action={
      <Button size="sm" onClick={onClear}>
        Clear search & filters
      </Button>
    }
  />
)
