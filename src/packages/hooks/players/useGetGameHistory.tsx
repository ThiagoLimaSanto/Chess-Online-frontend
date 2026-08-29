import { useQuery } from "@tanstack/react-query"
import { api } from "../../auth/axios"

export type PlayerGameHistory = {
    id: string
    opponent: string
    playerWhite: boolean
    result: "DRAW" | "WHITE_WIN" | "BLACK_WIN"
    initialTimeSeconds: number
    incrementSeconds: number
    finishedAt: string
}

type GameHistoryPage = {
    content: PlayerGameHistory[]
}

async function getGameHistory(userId: string): Promise<PlayerGameHistory[]> {
    const { data } = await api.get<GameHistoryPage>(`/games/history/${userId}`, {
        params: { size: 5 },
    })
    return data.content
}

export function useGetGameHistory(userId: string) {
    return useQuery({
        queryKey: ["game-history", userId],
        queryFn: () => getGameHistory(userId),
        enabled: Boolean(userId),
    })
}
