import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorBoundary from '../components/ErrorBoundary'

function Bomb() {
  throw new Error('test error')
}

function Fine() {
  return <p>tudo certo</p>
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  console.error.mockRestore()
})

describe('ErrorBoundary', () => {
  it('renderiza filhos normalmente quando não há erro', () => {
    render(
      <ErrorBoundary>
        <Fine />
      </ErrorBoundary>
    )
    expect(screen.getByText('tudo certo')).toBeInTheDocument()
  })

  it('exibe tela de fallback quando filho explode', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    )
    expect(screen.getByText('Algo deu errado')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /recarregar/i })).toBeInTheDocument()
  })

  it('botão recarregar chama window.location.reload', async () => {
    const reload = vi.fn()
    vi.stubGlobal('location', { reload })

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    )

    await userEvent.click(screen.getByRole('button', { name: /recarregar/i }))
    expect(reload).toHaveBeenCalledOnce()

    vi.unstubAllGlobals()
  })
})
