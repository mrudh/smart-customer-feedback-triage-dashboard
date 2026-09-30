import { StickyNote } from 'lucide-react'
import { useId, useState } from 'react'
import { formatFullTimestamp } from '@/utils/format'
import { useFeedbackStore } from '@/features/feedback/feedbackStore'
import { Button } from '@/components/ui/Button'

export function NotesSection({ item }) {
  const addNote = useFeedbackStore((s) => s.addNote)
  const [draft, setDraft] = useState('')
  const inputId = useId()

  const submit = (event) => {
    event?.preventDefault()
    if (!draft.trim()) return
    addNote(item.id, draft)
    setDraft('')
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) submit()
  }

  return (
    <section aria-labelledby={`${inputId}-heading`}>
      <h3 id={`${inputId}-heading`} className="mb-2 text-sm font-semibold">
        Internal notes <span className="font-normal text-muted">({item.notes.length})</span>
      </h3>

      {item.notes.length > 0 && (
        <ol className="mb-3 flex flex-col gap-2">
          {item.notes.map((note) => (
            <li key={note.id} className="rounded-lg bg-amber-50/70 p-3 text-sm ring-1 ring-amber-100">
              <p className="whitespace-pre-wrap">{note.body}</p>
              <p className="mt-1 text-xs text-muted">
                {note.author} · {formatFullTimestamp(note.createdAt)}
              </p>
            </li>
          ))}
        </ol>
      )}

      <form onSubmit={submit} className="flex flex-col gap-2">
        <label htmlFor={inputId} className="sr-only">
          Add an internal note
        </label>
        <textarea
          id={inputId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder="Add an internal note… (⌘/Ctrl + Enter to save)"
          className="w-full resize-y rounded-lg bg-white px-3 py-2.5 text-sm ring-1 ring-line ring-inset placeholder:text-muted/80 hover:ring-brand-300"
        />

        {draft.trim() && (
          <Button type="submit" size="sm" className="self-end" icon={<StickyNote className="size-3.5" />}>
            Save note
          </Button>
        )}
      </form>
    </section>
  )
}
