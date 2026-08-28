import { useEffect } from "react"
import { api } from "../../auth/axios"

const HEARTBEAT_INTERVAL_MS = 60_000

async function sendHeartbeat(userId: string) {
    await api.post(`/players/${userId}/online/heartbeat`)
}

export function useHeartbeat(userId?: string) {
    useEffect(() => {
        if (!userId) return

        const heartbeat = () => {
            void sendHeartbeat(userId).catch(() => {
                // A autenticação global lida com falhas de sessão.
            })
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                heartbeat()
            }
        }

        heartbeat()
        const interval = window.setInterval(heartbeat, HEARTBEAT_INTERVAL_MS)
        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            window.clearInterval(interval)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [userId])
}
