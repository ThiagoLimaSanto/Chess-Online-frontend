import { useEffect, useState } from "react"

type GameClockParams = {
    whiteTimeMillis: number
    blackTimeMillis: number
    serverTimeMillis: number
    activeColor: "WHITE" | "BLACK"
    isRunning: boolean
}

function formatTime(milliseconds: number) {
    const totalSeconds = Math.ceil(Math.max(0, milliseconds) / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function useGameClock({
    whiteTimeMillis,
    blackTimeMillis,
    serverTimeMillis,
    activeColor,
    isRunning,
}: GameClockParams) {
    const [tick, setTick] = useState({ syncId: serverTimeMillis, elapsed: 0 })

    useEffect(() => {
        if (!isRunning) return
        const receivedAt = Date.now()
        const interval = window.setInterval(() => setTick({
            syncId: serverTimeMillis,
            elapsed: Date.now() - receivedAt,
        }), 200)
        return () => window.clearInterval(interval)
    }, [isRunning, serverTimeMillis])

    const elapsed = isRunning && tick.syncId === serverTimeMillis ? Math.max(0, tick.elapsed) : 0
    const whiteRemaining = Math.max(
        0,
        whiteTimeMillis - (activeColor === "WHITE" ? elapsed : 0),
    )
    const blackRemaining = Math.max(
        0,
        blackTimeMillis - (activeColor === "BLACK" ? elapsed : 0),
    )

    return {
        whiteTime: formatTime(whiteRemaining),
        blackTime: formatTime(blackRemaining),
        whiteRemaining,
        blackRemaining,
    }
}
