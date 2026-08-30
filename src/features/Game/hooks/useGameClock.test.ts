import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useGameClock } from "./useGameClock"

describe("useGameClock", () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    })

    afterEach(() => vi.useRealTimers())

    it("reduz somente o relógio do jogador ativo", () => {
        const { result } = renderHook(() => useGameClock({
            whiteTimeMillis: 60_000,
            blackTimeMillis: 60_000,
            serverTimeMillis: 1,
            activeColor: "WHITE",
            isRunning: true,
        }))

        act(() => vi.advanceTimersByTime(2_000))

        expect(result.current.whiteTime).toBe("0:58")
        expect(result.current.blackTime).toBe("1:00")
    })

    it("congela os dois relógios quando a partida termina", () => {
        const { result } = renderHook(() => useGameClock({
            whiteTimeMillis: 12_000,
            blackTimeMillis: 8_000,
            serverTimeMillis: 1,
            activeColor: "BLACK",
            isRunning: false,
        }))

        act(() => vi.advanceTimersByTime(5_000))

        expect(result.current.whiteTime).toBe("0:12")
        expect(result.current.blackTime).toBe("0:08")
    })
})
