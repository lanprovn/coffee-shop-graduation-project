import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

// Mock the providers
vi.mock('../hooks/provider/AuthProvider', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-provider">{children}</div>
}))

vi.mock('../hooks/provider/ProductProvider', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="product-provider">{children}</div>
}))

vi.mock('../hooks/provider/ShoppingCartProvider', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="cart-provider">{children}</div>
}))

vi.mock('../hooks/provider/ModalProvider', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="modal-provider">{children}</div>
}))

vi.mock('../hooks/provider/UserAddressProvider', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="address-provider">{children}</div>
}))

vi.mock('../hooks/useNotification', () => ({
    NotificationProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="notification-provider">{children}</div>
}))

vi.mock('../components/shared/ScrollToTop', () => ({
    default: () => <div data-testid="scroll-to-top" />
}))

vi.mock('../Router', () => ({
    default: () => <div data-testid="router">Router Component</div>
}))

vi.mock('../hooks/useSupportChat', () => ({
    SupportChatWidget: () => <div data-testid="support-chat" />
}))

vi.mock('../hooks/useSocialShare', () => ({
    ShareModal: () => <div data-testid="share-modal" />
}))

describe('App Component', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        )

        expect(screen.getByTestId('auth-provider')).toBeInTheDocument()
        expect(screen.getByTestId('product-provider')).toBeInTheDocument()
        expect(screen.getByTestId('cart-provider')).toBeInTheDocument()
        expect(screen.getByTestId('modal-provider')).toBeInTheDocument()
        expect(screen.getByTestId('address-provider')).toBeInTheDocument()
        expect(screen.getByTestId('notification-provider')).toBeInTheDocument()
    })

    it('renders all provider components in correct order', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        )

        const providers = screen.getAllByTestId(/provider/)
        expect(providers).toHaveLength(6)
    })
})
