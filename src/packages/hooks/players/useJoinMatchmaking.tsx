import { useMutation } from "@tanstack/react-query"
import { api } from "../../auth/axios"
import type { GameMode } from "../../constants/gameModes"

export type MatchmakingGame = {
    id: string
    whitePlayer: string
    blackPlayer: string
    gameMode: GameMode
}

async function joinMatchmaking({ userId, gameMode }: { userId: string; gameMode: GameMode }): Promise<MatchmakingGame | null> {
    const { data } = await api.post<MatchmakingGame | undefined>(
        `/matchmaking/${userId}/join-queue`,
        undefined,
        { params: { mode: gameMode } },
    )
    return data ?? null
}

export function useJoinMatchmaking() {
    return useMutation({
        mutationFn: joinMatchmaking,
    })
}
