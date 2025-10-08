import { describe, it, expect, vi } from 'vitest'
import { priceWithSign, getSumFromArr, fakeTimer } from '../../utils/helper'

describe('Helper Functions', () => {
    describe('priceWithSign', () => {
        it('formats valid price correctly', () => {
            expect(priceWithSign(25000)).toBe('25.000 VND')
            expect(priceWithSign(1000000)).toBe('1.000.000 VND')
        })

        it('handles invalid inputs', () => {
            expect(priceWithSign(null)).toBe('')
            expect(priceWithSign(undefined)).toBe('')
            expect(priceWithSign(NaN)).toBe('')
        })

        it('handles zero price', () => {
            expect(priceWithSign(0)).toBe('0 VND')
        })
    })

    describe('getSumFromArr', () => {
        it('calculates sum correctly', () => {
            expect(getSumFromArr([1, 2, 3, 4])).toBe(10)
            expect(getSumFromArr([100, 200, 300])).toBe(600)
        })

        it('handles empty array', () => {
            expect(getSumFromArr([])).toBe(0)
        })

        it('handles single element', () => {
            expect(getSumFromArr([42])).toBe(42)
        })
    })

    describe('fakeTimer', () => {
        it('resolves after specified time', async () => {
            const start = Date.now()
            await fakeTimer(100)
            const end = Date.now()

            expect(end - start).toBeGreaterThanOrEqual(90)
            expect(end - start).toBeLessThan(200)
        })

        it('uses default delay of 1000ms', async () => {
            const start = Date.now()
            await fakeTimer()
            const end = Date.now()

            expect(end - start).toBeGreaterThanOrEqual(900)
            expect(end - start).toBeLessThan(1200)
        })
    })
})
