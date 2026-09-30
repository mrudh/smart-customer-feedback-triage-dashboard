import { Check, Clock, RotateCcw } from 'lucide-react'
import { useFeedbackStore } from '@/features/feedback/feedbackStore'
import { Button } from '@/components/ui/Button'

export function DetailActions({ item }) {
  const updateTriage = useFeedbackStore((s) => s.updateTriage)
  const setStatus = (status) => updateTriage(item.id, { status }, 'agent')
  const { status } = item.triage

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-line bg-white px-4 py-3 sm:px-6">
      {status === 'new' && (
        <Button variant="primary" onClick={() => setStatus('in_progress')} icon={<Clock className="size-4" />}>
          Mark as in progress
        </Button>
      )}
      {status !== 'resolved' ? (
        <Button onClick={() => setStatus('resolved')} icon={<Check className="size-4" />}>
          Mark as resolved
        </Button>
      ) : (
        <Button onClick={() => setStatus('in_progress')} icon={<RotateCcw className="size-4" />}>
          Reopen
        </Button>
      )}
    </div>
  )
}
