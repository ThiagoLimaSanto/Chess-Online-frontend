import { useQuery } from "@tanstack/react-query"

import { api } from "../../auth/axios"

async function getMatchmakingQueueStatus(userId: string): Promise<boolean> {
    const { data } = await api.get<boolean>(`/matchmaking/${userId}/isinqueue`)
    return data
}

export function useMatchmakingQueueStatus(userId: string, isSearching: boolean) {
    return useQuery({
        queryKey: ["matchmaking-queue", userId],
        queryFn: () => getMatchmakingQueueStatus(userId),
        enabled: Boolean(userId) && isSearching,
        refetchInterval: isSearching ? 2_000 : false,
    })
}
