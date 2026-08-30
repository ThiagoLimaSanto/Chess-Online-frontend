import type { PropsWithChildren } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePlayerGameEvents } from "./usePlayerGameEvents"

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
        subscribe = vi.fn((_topic: string, handler: MessageHandler) => { this.handler = handler })

        constructor() {
            stomp.instances.push(this)
        }
    },
}))

vi.mock("../../auth/axios", () => ({
    getAuthToken: () => "jwt-token",
}))

function createWrapper(queryClient: QueryClient) {
    return function QueryWrapper({ children }: PropsWithChildren) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }
}

describe("usePlayerGameEvents", () => {
    beforeEach(() => {
        stomp.instances.length = 0
    })

    it("abre a partida criada para o jogador desafiador", () => {
        const queryClient = new QueryClient()
        const invalidate = vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined)
        const onGameCreated = vi.fn()
        renderHook(() => usePlayerGameEvents("player-1", onGameCreated), {
            wrapper: createWrapper(queryClient),
        })
        const client = stomp.instances[0]

        act(() => client.onConnect?.())
        expect(client.subscribe).toHaveBeenCalledWith("/topic/players/player-1", expect.any(Function))
        act(() => client.handler?.({ body: JSON.stringify({ type: "GAME_CREATED", gameId: "game-1" }) }))

        expect(invalidate).toHaveBeenCalledWith({ queryKey: ["current-match"] })
        expect(onGameCreated).toHaveBeenCalledWith("game-1")
    })

    it("ignora eventos inválidos", () => {
        const queryClient = new QueryClient()
        const onGameCreated = vi.fn()
        renderHook(() => usePlayerGameEvents("player-1", onGameCreated), {
            wrapper: createWrapper(queryClient),
        })
        const client = stomp.instances[0]

        act(() => client.onConnect?.())
        act(() => client.handler?.({ body: "invalid" }))

        expect(onGameCreated).not.toHaveBeenCalled()
    })
})
