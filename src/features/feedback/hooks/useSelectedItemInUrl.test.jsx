import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/app/App'
import { useFeedbackStore } from '@/features/feedback/feedbackStore'
import { DEFAULT_FILTERS } from '@/features/feedback/filters.model'

const itemParam = () => new URLSearchParams(window.location.search).get('item')
const openHeading = (name) => screen.findByRole('heading', { level: 2, name }, { timeout: 3000 })
const waitForInbox = () =>
  screen.findAllByRole('button', { name: /order arrived with missing items/i }, { timeout: 3000 })

describe('useSelectedItemInUrl', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
    window.history.replaceState(null, '', '/')
    act(() => useFeedbackStore.setState({ items: [], loadStatus: 'idle', selectedId: null, filters: DEFAULT_FILTERS }))
  })

  it('opens the item named in the URL once feedback has loaded', async () => {
    window.history.replaceState(null, '', '/?item=ofb_0002')
    render(<App />)
    expect(await openHeading('Substitution not suitable')).toBeInTheDocument()
    expect(itemParam()).toBe('ofb_0002')
  })

  it('writes the selection to the URL, replacing history when moving between items', async () => {
    const user = userEvent.setup()
    render(<App />)
    const [row] = await waitForInbox()
    const startLength = window.history.length

    await user.click(row)
    expect(itemParam()).toBe('ofb_0001')
    expect(window.history.length).toBe(startLength + 1)

    await user.click(screen.getByRole('button', { name: /substitution not suitable/i }))
    expect(itemParam()).toBe('ofb_0002')
    expect(window.history.length).toBe(startLength + 1)

    await user.click(screen.getByRole('button', { name: 'Back to inbox' }))
    expect(itemParam()).toBeNull()
  })

  it('drops an unknown item id from the URL and opens nothing', async () => {
    window.history.replaceState(null, '', '/?item=ofb_9999&simulate=slow')
    render(<App />)
    await screen.findAllByRole('button', { name: /order arrived with missing items/i }, { timeout: 5000 })
    expect(itemParam()).toBeNull()
    expect(new URLSearchParams(window.location.search).get('simulate')).toBe('slow')
    expect(screen.getByText('Select feedback to triage')).toBeInTheDocument()
  })

  it('follows the browser back and forward buttons', async () => {
    render(<App />)
    await waitForInbox()

    act(() => {
      window.history.pushState(null, '', '/?item=ofb_0003')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(await openHeading('Great delivery experience')).toBeInTheDocument()

    act(() => {
      window.history.pushState(null, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(await screen.findByText('Select feedback to triage')).toBeInTheDocument()
  })
})
