import type { PropsWithChildren } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { api } from "../../auth/axios"
import { useAcceptChallenge } from "./useAcceptChallenge"
import { useCreateChallenge } from "./useCreateChallenge"

vi.mock("../../auth/axios", () => ({
    api: { post: vi.fn() },
}))

function createWrapper(queryClient: QueryClient) {
    return function QueryWrapper({ children }: PropsWithChildren) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }
}

describe("hooks de desafios", () => {
    beforeEach(() => vi.clearAllMocks())

    it("envia o desafio com o controle de tempo escolhido", async () => {
        vi.mocked(api.post).mockResolvedValue({ data: undefined })
        const queryClient = new QueryClient()
        const { result } = renderHook(() => useCreateChallenge(), { wrapper: createWrapper(queryClient) })
        const request = { challengedUsername: "friend", initialTimeSeconds: 600, incrementSeconds: 0 }

        await act(async () => {
            await result.current.mutateAsync(request)
        })

        expect(api.post).toHaveBeenCalledWith("/challenges/create", request)
    })

    it("retorna e armazena a partida criada ao aceitar", async () => {
        const game = { id: "game-1", whitePlayer: "challenger", blackPlayer: "challenged" }
        vi.mocked(api.post).mockResolvedValue({ data: game })
        const queryClient = new QueryClient()
        const { result } = renderHook(() => useAcceptChallenge(), { wrapper: createWrapper(queryClient) })

        let acceptedGame: typeof game | undefined
        await act(async () => {
            acceptedGame = await result.current.mutateAsync("challenge-1")
        })

        expect(api.post).toHaveBeenCalledWith("/challenges/challenge-1/accept")
        expect(acceptedGame).toEqual(game)
        expect(queryClient.getQueryData(["current-match"])).toEqual(game)
    })
})
