import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('should render the app title', () => {
    render(<App />)
    expect(screen.getByText('Vite + React')).toBeInTheDocument()
  })

  it('should increment counter when button clicked', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /count is 0/ })
    
    fireEvent.click(button)
    
    expect(screen.getByRole('button', { name: /count is 1/ })).toBeInTheDocument()
  })

  it('should display Vite and React logos', () => {
    render(<App />)
    expect(screen.getByAltText('Vite logo')).toBeInTheDocument()
    expect(screen.getByAltText('React logo')).toBeInTheDocument()
  })
})
