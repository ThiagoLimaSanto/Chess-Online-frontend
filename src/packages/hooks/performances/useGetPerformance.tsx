import { useQuery } from "@tanstack/react-query";
import { api } from "../../auth/axios";

export type PerformanceResponse = { gamesPlayed: number; victories: number; draws: number; losses: number; rating: number }

async function getPerformanceRequest(userId: string) {
    const response = await api.get<PerformanceResponse>(`/performance/${userId}`)
    return response.data
}

export function useGetPerformance(userId: string) {
    return useQuery({
        queryKey: ["performance", userId],
        queryFn: async () => {
            return await getPerformanceRequest(userId)
        },
        enabled: Boolean(userId),
    })
}
