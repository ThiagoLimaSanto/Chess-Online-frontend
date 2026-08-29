import { useQuery } from "@tanstack/react-query";
import { api } from "../../auth/axios";

async function getPerformanceRequest(userId: string) {
    const response = await api.get(`/performance/${userId}`)
    return response.data
}

export function useGetPerformance(userId: string) {
    return useQuery({
        queryKey: ["performance", userId],
        queryFn: async () => {
            return await getPerformanceRequest(userId)
        },
    })
}