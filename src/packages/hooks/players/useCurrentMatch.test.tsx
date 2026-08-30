import type { PropsWithChildren } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { api } from "../../auth/axios"
import { useCurrentMatch } from "./useCurrentMatch"

vi.mock("../../auth/axios", () => ({
    api: { get: vi.fn() },
}))

function createWrapper() {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    return function QueryWrapper({ children }: PropsWithChildren) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }
}

describe("useCurrentMatch", () => {
    beforeEach(() => vi.clearAllMocks())

    it("consulta a partida em andamento ao abrir o lobby", async () => {
        const game = { id: "game-1", whitePlayer: "white", blackPlayer: "black" }
        vi.mocked(api.get).mockResolvedValue({ data: game })
        const { result } = renderHook(() => useCurrentMatch(true), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current.data).toEqual(game))
        expect(api.get).toHaveBeenCalledWith("/matchmaking/current-game")
    })

    it("não consulta antes de existir um usuário autenticado", () => {
        const { result } = renderHook(() => useCurrentMatch(false), { wrapper: createWrapper() })

        expect(result.current.fetchStatus).toBe("idle")
        expect(api.get).not.toHaveBeenCalled()
    })
})
