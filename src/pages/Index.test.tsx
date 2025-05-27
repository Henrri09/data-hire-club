
import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
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
      const { getByRole } = renderWithRouter(<Index />)
      expect(getByRole('heading', { 
        name: /Encontre Sua Próxima Oportunidade em Dados/i 
      })).toBeInTheDocument()
    })

    it('renders hero description', () => {
      const { getByText } = renderWithRouter(<Index />)
      expect(getByText(/Conecte-se com as melhores empresas/i)).toBeInTheDocument()
    })

    it('renders hero illustration', () => {
      const { getByAltText } = renderWithRouter(<Index />)
      const illustration = getByAltText('Data Analysis Illustration')
      expect(illustration).toBeInTheDocument()
      expect(illustration).toHaveAttribute('src', expect.stringContaining('png'))
    })
  })

  describe('Search Section', () => {
    it('renders search input', () => {
      const { getByPlaceholderText } = renderWithRouter(<Index />)
      const searchInput = getByPlaceholderText(/Buscar vagas/i)
      expect(searchInput).toBeInTheDocument()
    })
  })

  describe('Features Section', () => {
    it('renders all feature cards', () => {
      const { getByText } = renderWithRouter(<Index />)
      expect(getByText('Vagas Selecionadas')).toBeInTheDocument()
      expect(getByText('Comunidade')).toBeInTheDocument()
      expect(getByText('Match Inteligente')).toBeInTheDocument()
    })

    it('renders feature descriptions', () => {
      const { getByText } = renderWithRouter(<Index />)
      expect(getByText(/Oportunidades exclusivas em dados/i)).toBeInTheDocument()
      expect(getByText(/Conecte-se com outros profissionais/i)).toBeInTheDocument()
      expect(getByText(/Encontre oportunidades que combinam/i)).toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('renders footer sections', () => {
      const { getByText } = renderWithRouter(<Index />)
      expect(getByText('Data Hire Club')).toBeInTheDocument()
      expect(getByText('Contato')).toBeInTheDocument()
      expect(getByText('Links Úteis')).toBeInTheDocument()
    })

    it('renders footer links', () => {
      const { getAllByRole } = renderWithRouter(<Index />)
      const links = getAllByRole('link')
      expect(links.some(link => link.textContent === 'Sobre Nós')).toBeTruthy()
      expect(links.some(link => link.textContent === 'Termos de Uso')).toBeTruthy()
      expect(links.some(link => link.textContent === 'Política de Privacidade')).toBeTruthy()
    })

    it('renders copyright notice', () => {
      const { getByText } = renderWithRouter(<Index />)
      expect(getByText(/© 2024 Data Hire Club/i)).toBeInTheDocument()
    })
  })
})
