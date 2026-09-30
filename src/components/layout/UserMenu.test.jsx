import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useToastStore } from '@/components/ui/toastStore'
import { CURRENT_AGENT } from '@/config/currentAgent'
import { UserMenu } from './UserMenu'

describe('<UserMenu />', () => {
  beforeEach(() => act(() => useToastStore.setState({ toast: null })))

  it("opens a profile panel with the agent's details and closes on Escape", async () => {
    const user = userEvent.setup()
    render(<UserMenu />)
    const trigger = screen.getByRole('button', { name: `Account: ${CURRENT_AGENT.name}` })

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const panel = screen.getByRole('dialog', { name: 'Your profile' })
    expect(panel).toHaveTextContent(CURRENT_AGENT.email)
    expect(panel).toHaveTextContent(CURRENT_AGENT.role)
    expect(panel).toHaveTextContent(CURRENT_AGENT.team)

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('copies the email address and confirms with a toast', async () => {
    const user = userEvent.setup()
    render(<UserMenu />)
    await user.click(screen.getByRole('button', { name: /account/i }))
    await user.click(screen.getByRole('button', { name: 'Copy email address' }))

    await expect(navigator.clipboard.readText()).resolves.toBe(CURRENT_AGENT.email)
    expect(useToastStore.getState().toast?.message).toBe('Email copied')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <>
        <UserMenu />
        <p>outside</p>
      </>,
    )
    await user.click(screen.getByRole('button', { name: /account/i }))
    await user.click(screen.getByText('outside'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
