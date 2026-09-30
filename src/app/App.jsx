import { useEffect } from 'react'
import { Toaster } from '@/components/ui/Toaster'
import { useFeedbackStore } from '@/features/feedback/feedbackStore'
import { useSelectedItemInUrl } from '@/features/feedback/hooks/useSelectedItemInUrl'
import { AppLayout } from './AppLayout'

export default function App() {
  const loadFeedback = useFeedbackStore((s) => s.loadFeedback)

  useEffect(() => {
    void loadFeedback()
  }, [loadFeedback])

  useSelectedItemInUrl()

  return (
    <>
      <AppLayout />
      <Toaster />
    </>
  )
}
