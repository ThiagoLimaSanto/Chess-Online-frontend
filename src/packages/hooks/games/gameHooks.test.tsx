import type { PropsWithChildren } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { api } from "../../auth/axios"
import { useGetLegalMoves } from "./useGetLegalMoves"
import { useMakeMove } from "./useMakeMove"

vi.mock("../../auth/axios", () => ({
    api: { get: vi.fn(), post: vi.fn() },
}))

function testQueryClient() {
    return new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
}

function wrapper(queryClient: QueryClient) {
    return function QueryWrapper({ children }: PropsWithChildren) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }
}

describe("hooks de movimentos", () => {
    beforeEach(() => vi.clearAllMocks())

    it("busca as casas legais usando a origem selecionada", async () => {
        vi.mocked(api.get).mockResolvedValue({ data: ["e3", "e4"] })
        const queryClient = testQueryClient()
        const { result } = renderHook(() => useGetLegalMoves("game-1", "e2"), {
            wrapper: wrapper(queryClient),
        })

        await waitFor(() => expect(result.current.data).toEqual(["e3", "e4"]))
        expect(api.get).toHaveBeenCalledWith("/games/game-1/legal-moves", { params: { from: "e2" } })
    })

    it("não consulta movimentos sem uma casa selecionada", () => {
        const queryClient = testQueryClient()
        const { result } = renderHook(() => useGetLegalMoves("game-1", null), {
            wrapper: wrapper(queryClient),
        })

        expect(result.current.fetchStatus).toBe("idle")
        expect(api.get).not.toHaveBeenCalled()
    })

    it("envia a jogada e invalida partida e movimentos legais", async () => {
        vi.mocked(api.post).mockResolvedValue({ data: {
            id: "move-1", gameId: "game-1", playerId: "white", fromSquare: "e2",
            toSquare: "e4", piece: "PAWN", moveNumber: 1, createdAt: "2026-01-01",
        } })
        const queryClient = testQueryClient()
        const invalidate = vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined)
        const { result } = renderHook(() => useMakeMove(), { wrapper: wrapper(queryClient) })

        await act(async () => {
            await result.current.mutateAsync({
                gameId: "game-1", playerId: "white", fromSquare: "e2", toSquare: "e4",
            })
        })

        expect(api.post).toHaveBeenCalledWith("/games/game-1/moves", {
            playerId: "white", fromSquare: "e2", toSquare: "e4",
        })
        expect(invalidate).toHaveBeenCalledWith({ queryKey: ["game", "game-1"] })
        expect(invalidate).toHaveBeenCalledWith({ queryKey: ["legal-moves", "game-1"] })
    })
})
