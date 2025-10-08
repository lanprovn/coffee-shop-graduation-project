import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import BaseButton from '../../components/shared/button/BaseButton'

describe('BaseButton Component', () => {
    it('renders button with children', () => {
        render(<BaseButton>Click me</BaseButton>)
        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('handles click events', () => {
        const handleClick = vi.fn()
        render(<BaseButton onClick={handleClick}>Click me</BaseButton>)

        fireEvent.click(screen.getByRole('button'))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('applies custom className', () => {
        render(<BaseButton className="custom-class">Button</BaseButton>)
        expect(screen.getByRole('button')).toHaveClass('custom-class')
    })

    it('can be disabled', () => {
        render(<BaseButton disabled>Disabled Button</BaseButton>)
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('has correct default type', () => {
        render(<BaseButton>Button</BaseButton>)
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })

    it('can have submit type', () => {
        render(<BaseButton type="submit">Submit</BaseButton>)
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })
})
