import clsx from 'clsx'
import { useState } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { FeedbackDetailPanel } from '@/features/feedback/components/FeedbackDetail'
import { FilterDrawer } from '@/features/feedback/components/FilterDrawer'
import { FiltersSidebar } from '@/features/feedback/components/FiltersSidebar'
import { InboxPanel } from '@/features/feedback/components/InboxPanel'
import { useFeedbackStore } from '@/features/feedback/feedbackStore'

export function AppLayout() {
  const hasSelection = useFeedbackStore((s) => s.selectedId !== null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <a href="#feedback-inbox" className="skip-link">
        Skip to inbox
      </a>
      <AppHeader />
      <div className="flex min-h-0 flex-1">
        <aside
          aria-label="Views and filters"
          className="relative hidden w-64 shrink-0 overflow-y-auto border-r border-line bg-white xl:block"
        >
          <FiltersSidebar />
        </aside>
        <FilterDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} />

        <main className="flex min-w-0 flex-1 gap-4 p-3 sm:p-4">
          <InboxPanel
            onOpenFilters={() => setFiltersOpen(true)}
            className={clsx('w-full lg:w-[380px] lg:shrink-0 xl:w-[420px]', hasSelection ? 'hidden lg:flex' : 'flex')}
          />

          <FeedbackDetailPanel className={clsx('min-w-0 flex-1', hasSelection ? 'flex' : 'hidden lg:flex')} />
        </main>
      </div>
    </div>
  )
}
