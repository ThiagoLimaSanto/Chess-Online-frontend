import type { PropsWithChildren } from "react"
import { QueryClient, QueryClientProvider, QueryObserver } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
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

    it("atualiza consultas de amizade do jogador ao receber um evento remoto", () => {
        const queryClient = new QueryClient()
        const invalidate = vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined)
        const onGameCreated = vi.fn()
        renderHook(() => usePlayerGameEvents("player-1", onGameCreated), {
            wrapper: createWrapper(queryClient),
        })
        const client = stomp.instances[0]
        act(() => client.onConnect?.())
        invalidate.mockClear()

        act(() => client.handler?.({ body: JSON.stringify({ type: "FRIENDSHIP_UPDATED" }) }))

        expect(invalidate).toHaveBeenCalledTimes(4)
        for (const key of ["friendships", "friendships-requests", "friendships-sent-requests", "players"]) {
            expect(invalidate).toHaveBeenCalledWith({ queryKey: [key, "player-1"] })
        }
        expect(onGameCreated).not.toHaveBeenCalled()
    })

    it.each(["friendships-requests", "friendships-sent-requests", "friendships", "players"])(
        "reconsulta %s sem recarregar a página", async (queryKey) => {
        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
        let requests: string[] = []
        const queryFn = vi.fn(async () => [...requests])
        const observer = new QueryObserver(queryClient, {
            queryKey: [queryKey, "player-1", "", 0, 5],
            queryFn,
            staleTime: Infinity,
        })
        const unsubscribe = observer.subscribe(() => undefined)
        const { unmount } = renderHook(() => usePlayerGameEvents("player-1", vi.fn()), {
            wrapper: createWrapper(queryClient),
        })
        const client = stomp.instances[0]
        await waitFor(() => expect(observer.getCurrentResult().data).toEqual([]))
        act(() => client.onConnect?.())
        await waitFor(() => expect(observer.getCurrentResult().isFetching).toBe(false))
        const previousCalls = queryFn.mock.calls.length

        requests = ["requester-2"]
        act(() => client.handler?.({ body: JSON.stringify({ type: "FRIENDSHIP_UPDATED" }) }))

        await waitFor(() => expect(observer.getCurrentResult().data).toEqual(["requester-2"]))
        expect(queryFn.mock.calls.length).toBeGreaterThan(previousCalls)
        unmount()
        unsubscribe()
        queryClient.clear()
    })

    it("sincroniza as amizades novamente após reconectar", () => {
        const queryClient = new QueryClient()
        const invalidate = vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined)
        renderHook(() => usePlayerGameEvents("player-1", vi.fn()), {
            wrapper: createWrapper(queryClient),
        })
        const client = stomp.instances[0]
        act(() => client.onConnect?.())
        invalidate.mockClear()

        act(() => client.onConnect?.())

        expect(invalidate).toHaveBeenCalledTimes(4)
        expect(invalidate).toHaveBeenCalledWith({ queryKey: ["friendships-requests", "player-1"] })
        expect(invalidate).toHaveBeenCalledWith({ queryKey: ["friendships-sent-requests", "player-1"] })
    })
})
