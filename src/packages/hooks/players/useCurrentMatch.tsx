import { useQuery } from "@tanstack/react-query"

import { api } from "../../auth/axios"
import type { MatchmakingGame } from "./useJoinMatchmaking"

async function getCurrentMatch(): Promise<MatchmakingGame | null> {
    const { data } = await api.post<MatchmakingGame | undefined>("/matchmaking/find-current-game")
    return data ?? null
}

export function useCurrentMatch(enabled: boolean) {
    return useQuery({
        queryKey: ["current-match"],
        queryFn: getCurrentMatch,
        enabled,
        refetchInterval: enabled ? 1_000 : false,
    })
}
