import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll, vi } from 'vitest'

// Cleanup after each test case
afterEach(() => {
    cleanup()
})

// Mock IntersectionObserver
beforeAll(() => {
    global.IntersectionObserver = class IntersectionObserver {
        constructor() { }
        disconnect() { }
        observe() { }
        unobserve() { }
    }
})

// Mock ResizeObserver
beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
        constructor() { }
        disconnect() { }
        observe() { }
        unobserve() { }
    }
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock performance
global.performance = {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
} as any
