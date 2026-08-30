import { useQuery } from "@tanstack/react-query"

import { api } from "../../auth/axios"
import type { MatchmakingGame } from "./useJoinMatchmaking"

async function getCurrentMatch(): Promise<MatchmakingGame | null> {
    const { data } = await api.get<MatchmakingGame | undefined>("/matchmaking/current-game")
    return data ?? null
}

export function useCurrentMatch(enabled: boolean, shouldPoll = false) {
    return useQuery({
        queryKey: ["current-match"],
        queryFn: getCurrentMatch,
        enabled,
        refetchInterval: shouldPoll ? 1_000 : false,
    })
}
