const timeFormat = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' })
const shortDateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })
const longDateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

// Inbox-style timestamp
export function formatInboxTime(iso, now = new Date()) {
  const date = new Date(iso)
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000)
  if (days <= 0) return timeFormat.format(date)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return shortDateFormat.format(date)
}

// "10:42, 12 Mar 2026"
export function formatFullTimestamp(iso) {
  const date = new Date(iso)
  return `${timeFormat.format(date)}, ${longDateFormat.format(date)}`
}

export function formatTime(value) {
  return timeFormat.format(new Date(value))
}

export function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}
