import type { PropsWithChildren } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useGameEvents } from "./useGameEvents"

type MessageHandler = (message: { body: string }) => void

const stomp = vi.hoisted(() => ({
    instances: [] as Array<{
        onConnect?: () => void
        activate: ReturnType<typeof vi.fn>
        deactivate: ReturnType<typeof vi.fn>
        subscribe: ReturnType<typeof vi.fn>
        handler?: MessageHandler
    }>,
}))

vi.mock("@stomp/stompjs", () => ({
    Client: class {
        onConnect?: () => void
        activate = vi.fn()
        deactivate = vi.fn().mockResolvedValue(undefined)
        handler?: MessageHandler
        subscribe = vi.fn((_topic: string, handler: MessageHandler) => {
            this.handler = handler
        })

        constructor() {
            stomp.instances.push(this)
        }
    },
}))

vi.mock("../../auth/axios", () => ({
    getAuthToken: () => "jwt-token",
}))

function wrapper(queryClient: QueryClient) {
    return function QueryWrapper({ children }: PropsWithChildren) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }
}

describe("useGameEvents", () => {
    beforeEach(() => {
        stomp.instances.length = 0
    })

    it("atualiza a partida quando recebe uma jogada", () => {
        const queryClient = new QueryClient()
        const invalidate = vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined)
        renderHook(() => useGameEvents("game-1"), { wrapper: wrapper(queryClient) })
        const client = stomp.instances[0]

        act(() => client.onConnect?.())
        expect(client.subscribe).toHaveBeenCalledWith("/topic/games/game-1", expect.any(Function))
        act(() => client.handler?.({ body: JSON.stringify({ type: "MOVE_MADE", gameId: "game-1" }) }))

        expect(invalidate).toHaveBeenCalledWith({ queryKey: ["game", "game-1"] })
    })

    it("atualiza também as performances quando a partida termina", () => {
        const queryClient = new QueryClient()
        const invalidate = vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined)
        renderHook(() => useGameEvents("game-1"), { wrapper: wrapper(queryClient) })
        const client = stomp.instances[0]

        act(() => client.onConnect?.())
        act(() => client.handler?.({ body: JSON.stringify({ type: "GAME_FINISHED", gameId: "game-1" }) }))

        expect(invalidate).toHaveBeenCalledWith({ queryKey: ["game", "game-1"] })
        expect(invalidate).toHaveBeenCalledWith({ queryKey: ["performance"] })
    })

    it("ignora eventos de outra partida e mensagens inválidas", () => {
        const queryClient = new QueryClient()
        const invalidate = vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined)
        renderHook(() => useGameEvents("game-1"), { wrapper: wrapper(queryClient) })
        const client = stomp.instances[0]

        act(() => client.onConnect?.())
        act(() => client.handler?.({ body: JSON.stringify({ type: "MOVE_MADE", gameId: "game-2" }) }))
        act(() => client.handler?.({ body: "not-json" }))

        expect(invalidate).not.toHaveBeenCalled()
    })
})
