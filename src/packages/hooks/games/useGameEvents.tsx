import { useEffect } from "react"
import { Client } from "@stomp/stompjs"
import { useQueryClient } from "@tanstack/react-query"

import { getAuthToken } from "../../auth/axios"

type GameEvent = {
    type: "MOVE_MADE" | "GAME_FINISHED" | "GAME_ABANDONED"
    gameId: string
}

function websocketUrl() {
    if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL

    const apiUrl = new URL(import.meta.env.VITE_API_URL ?? window.location.origin, window.location.origin)
    apiUrl.protocol = apiUrl.protocol === "https:" ? "wss:" : "ws:"
    apiUrl.pathname = "/ws"
    apiUrl.search = ""
    apiUrl.hash = ""
    return apiUrl.toString()
}

export function useGameEvents(gameId: string) {
    const queryClient = useQueryClient()

    useEffect(() => {
        const token = getAuthToken()
        if (!gameId || !token) return

        const client = new Client({
            brokerURL: websocketUrl(),
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 3000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            debug: () => undefined,
        })

        client.onConnect = () => {
            client.subscribe(`/topic/games/${gameId}`, (message) => {
                try {
                    const event = JSON.parse(message.body) as GameEvent
                    if (event.gameId === gameId) {
                        void queryClient.invalidateQueries({ queryKey: ["game", gameId] })
                        if (event.type === "GAME_FINISHED" || event.type === "GAME_ABANDONED") {
                            void queryClient.invalidateQueries({ queryKey: ["performance"] })
                        }
                    }
                } catch {
                    // Ignora mensagens que não pertencem ao contrato de eventos da partida.
                }
            })
        }

        client.activate()
        return () => { void client.deactivate() }
    }, [gameId, queryClient])
}
