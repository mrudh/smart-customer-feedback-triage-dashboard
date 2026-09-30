import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toaster } from '@/components/ui/Toaster'
import { useAiStore } from '@/features/ai/aiStore'
import { useFeedbackStore } from '@/features/feedback/feedbackStore'
import { makeFeedback } from '@/test/fixtures'
import { AiAssistantPanel } from './AiAssistantPanel'

vi.mock('@/features/ai/services', async (importOriginal) => {
  const actual = await importOriginal()
  const { delay } = await import('@/utils/delay')
  return {
    ...actual,
    aiProvider: {
      id: 'fake',
      label: 'Fake model',
      async *streamAnalysis({ signal }) {
        for (const chunk of [
          '### Core issue\nItems missing.\n\n',
          '### Sentiment\n**Negative**\n\n',
          '### Suggested category\n**Delivery**',
        ]) {
          await delay(10, signal)
          yield chunk
        }
      },
    },
  }
})

function Harness({ id }) {
  const item = useFeedbackStore((s) => s.items.find((i) => i.id === id))
  return (
    <>
      <AiAssistantPanel item={item} />
      <Toaster />
    </>
  )
}

const triage = () => useFeedbackStore.getState().items[0].triage

async function runAnalysis() {
  const user = userEvent.setup()
  render(<Harness id="ofb_test" />)
  await user.click(screen.getByRole('button', { name: /summarise & categorise/i }))
  expect(screen.getByRole('button', { name: /stop generating/i })).toBeInTheDocument()
  expect(await screen.findByText('Completed')).toBeInTheDocument()
  const form = screen.getByRole('form', { name: /review before applying/i })
  return { user, form }
}

describe('<AiAssistantPanel />', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
    act(() => {
      useFeedbackStore.setState({ items: [makeFeedback()] })
      useAiStore.setState({ analyses: {} })
    })
  })

  it('streams an analysis and pre-fills an editable review form without changing the item', async () => {
    const { form } = await runAnalysis()
    expect(screen.getByText('Items missing.')).toBeInTheDocument()
    expect(within(form).getByLabelText('Sentiment')).toHaveValue('negative')
    expect(within(form).getByLabelText('Category')).toHaveValue('delivery')
    // Human in the loop, nothing is applied until the agent decides.
    expect(triage()).toMatchObject({ sentiment: null, category: null, status: 'new' })
  })

  it('applies the suggestion as-is without touching status, and can be undone', async () => {
    const { user, form } = await runAnalysis()
    await user.click(within(form).getByRole('button', { name: 'Apply' }))

    expect(triage()).toMatchObject({ sentiment: 'negative', category: 'delivery', status: 'new', classifiedBy: 'ai' })
    expect(screen.getByText('Triage applied to this feedback.')).toBeInTheDocument()
    expect(screen.getByText('Negative · Delivery')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(triage()).toMatchObject({ sentiment: null, category: null, status: 'new', classifiedBy: null })
    expect(screen.getByRole('form', { name: /review before applying/i })).toBeInTheDocument()
  })

  it('lets the agent correct the suggestion, and records the decision as theirs', async () => {
    const { user, form } = await runAnalysis()
    await user.selectOptions(within(form).getByLabelText('Category'), 'refund')

    expect(within(form).getByText('Edited')).toBeInTheDocument()
    expect(within(form).getByText('AI suggested: Delivery')).toBeInTheDocument()

    await user.click(within(form).getByRole('button', { name: 'Apply' }))
    expect(triage()).toMatchObject({ sentiment: 'negative', category: 'refund', classifiedBy: 'agent' })
    expect(screen.getByText('Edited suggestions applied')).toBeInTheDocument()
  })

  it('can dismiss the suggestion without changes, and review it again', async () => {
    const { user, form } = await runAnalysis()
    await user.click(within(form).getByRole('button', { name: 'Dismiss' }))

    expect(screen.queryByRole('form')).not.toBeInTheDocument()
    expect(screen.getByText(/suggestion dismissed/i)).toBeInTheDocument()
    expect(triage()).toMatchObject({ sentiment: null, category: null, status: 'new' })

    await user.click(screen.getByRole('button', { name: 'Review again' }))
    expect(screen.getByRole('form', { name: /review before applying/i })).toBeInTheDocument()
  })

  it('disables Apply when both fields are cleared', async () => {
    const { user, form } = await runAnalysis()
    await user.selectOptions(within(form).getByLabelText('Sentiment'), '')
    await user.selectOptions(within(form).getByLabelText('Category'), '')
    expect(within(form).getByRole('button', { name: 'Apply' })).toBeDisabled()
  })
})
