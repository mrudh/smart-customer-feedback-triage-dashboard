import { act, fireEvent, render, screen } from '@testing-library/react'
import { useToastStore } from './toastStore'
import { Toaster } from './Toaster'

describe('<Toaster />', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    act(() => useToastStore.setState({ toast: null }))
  })
  afterEach(() => vi.useRealTimers())

  const show = () => act(() => void useToastStore.getState().showToast({ message: 'Saved', durationMs: 1000 }))

  it('auto-dismisses after its duration', () => {
    render(<Toaster />)
    show()
    expect(screen.getByText('Saved')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.queryByText('Saved')).not.toBeInTheDocument()
  })

  it('stays open while hovered, then resumes', () => {
    render(<Toaster />)
    show()
    fireEvent.mouseEnter(screen.getByText('Saved'))
    act(() => vi.advanceTimersByTime(5000))
    expect(screen.getByText('Saved')).toBeInTheDocument()
    fireEvent.mouseLeave(screen.getByText('Saved'))
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.queryByText('Saved')).not.toBeInTheDocument()
  })

  it('ignores dismissals aimed at an older toast', () => {
    const first = useToastStore.getState().showToast({ message: 'First' })
    useToastStore.getState().showToast({ message: 'Second' })
    useToastStore.getState().dismissToast(first)
    expect(useToastStore.getState().toast?.message).toBe('Second')
  })
})
