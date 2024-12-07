import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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
  beforeEach(() => {
    renderWithRouter(<Index />)
  })

  describe('Hero Section', () => {
    it('renders main heading', () => {
      expect(screen.getByRole('heading', { 
        name: /Encontre Sua Próxima Oportunidade em Dados/i 
      })).toBeInTheDocument()
    })

    it('renders hero description', () => {
      expect(screen.getByText(/Conecte-se com as melhores empresas/i)).toBeInTheDocument()
    })

    it('renders hero illustration', () => {
      const illustration = screen.getByAltText('Data Analysis Illustration')
      expect(illustration).toBeInTheDocument()
      expect(illustration).toHaveAttribute('src', expect.stringContaining('png'))
    })
  })

  describe('Search Section', () => {
    it('renders search input', () => {
      const searchInput = screen.getByPlaceholderText(/Buscar vagas/i)
      expect(searchInput).toBeInTheDocument()
    })

    it('updates search query on input change', () => {
      const searchInput = screen.getByPlaceholderText(/Buscar vagas/i)
      fireEvent.change(searchInput, { target: { value: 'Analista' } })
      expect(searchInput).toHaveValue('Analista')
    })
  })

  describe('Features Section', () => {
    it('renders all feature cards', () => {
      expect(screen.getByText('Vagas Selecionadas')).toBeInTheDocument()
      expect(screen.getByText('Comunidade')).toBeInTheDocument()
      expect(screen.getByText('Match Inteligente')).toBeInTheDocument()
    })

    it('renders feature descriptions', () => {
      expect(screen.getByText(/Oportunidades exclusivas em dados/i)).toBeInTheDocument()
      expect(screen.getByText(/Conecte-se com outros profissionais/i)).toBeInTheDocument()
      expect(screen.getByText(/Encontre oportunidades que combinam/i)).toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('renders footer sections', () => {
      expect(screen.getByText('Data Hire Club')).toBeInTheDocument()
      expect(screen.getByText('Contato')).toBeInTheDocument()
      expect(screen.getByText('Links Úteis')).toBeInTheDocument()
    })

    it('renders footer links', () => {
      const links = screen.getAllByRole('link')
      expect(links.some(link => link.textContent === 'Sobre Nós')).toBeTruthy()
      expect(links.some(link => link.textContent === 'Termos de Uso')).toBeTruthy()
      expect(links.some(link => link.textContent === 'Política de Privacidade')).toBeTruthy()
    })

    it('renders copyright notice', () => {
      expect(screen.getByText(/© 2024 Data Hire Club/i)).toBeInTheDocument()
    })
  })
})