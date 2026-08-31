import { useEffect } from "react"
import { Client } from "@stomp/stompjs"
import { useQueryClient } from "@tanstack/react-query"

import { getAuthToken, getValidAuthToken } from "../../auth/axios"

type PlayerGameEvent = {
    type: "GAME_CREATED"
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

export function usePlayerGameEvents(playerId: string, onGameCreated: (gameId: string) => void) {
    const queryClient = useQueryClient()

    useEffect(() => {
        const token = getAuthToken()
        if (!playerId || !token) return

        const client = new Client({
            brokerURL: websocketUrl(),
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 3000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            debug: () => undefined,
        })

        client.beforeConnect = async () => {
            const validToken = await getValidAuthToken()
            client.connectHeaders = { Authorization: `Bearer ${validToken}` }
        }

        client.onConnect = () => {
            client.subscribe(`/topic/players/${playerId}`, (message) => {
                try {
                    const event = JSON.parse(message.body) as PlayerGameEvent
                    if (event.type === "GAME_CREATED" && event.gameId) {
                        void queryClient.invalidateQueries({ queryKey: ["current-match"] })
                        onGameCreated(event.gameId)
                    }
                } catch {
                    // Ignora eventos fora do contrato de criação de partidas.
                }
            })
        }

        client.activate()
        return () => { void client.deactivate() }
    }, [onGameCreated, playerId, queryClient])
}
