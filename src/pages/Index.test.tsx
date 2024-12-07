import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Index from './Index'
import { BrowserRouter } from 'react-router-dom'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Index Page', () => {
  it('renders main heading', () => {
    renderWithRouter(<Index />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders call-to-action buttons', () => {
    renderWithRouter(<Index />)
    expect(screen.getByText(/Sou Candidato/i)).toBeInTheDocument()
    expect(screen.getByText(/Sou Empresa/i)).toBeInTheDocument()
  })

  it('renders the main illustration', () => {
    renderWithRouter(<Index />)
    const illustration = screen.getByRole('img')
    expect(illustration).toBeInTheDocument()
    expect(illustration).toHaveAttribute('alt', /ilustração/i)
  })
})