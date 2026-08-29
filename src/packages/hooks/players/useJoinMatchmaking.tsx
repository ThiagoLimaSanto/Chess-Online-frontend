import { useMutation } from "@tanstack/react-query"
import { api } from "../../auth/axios"

export type MatchmakingGame = {
    id: string
    whitePlayer: string
    blackPlayer: string
}

async function joinMatchmaking(userId: string): Promise<MatchmakingGame | null> {
    const { data } = await api.post<MatchmakingGame | undefined>(`/matchmaking/${userId}/join-queue`)
    return data ?? null
}

export function useJoinMatchmaking() {
    return useMutation({
        mutationFn: joinMatchmaking,
    })
}
