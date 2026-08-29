import { useQuery } from "@tanstack/react-query"
import { api } from "../../auth/axios"

async function getLegalMoves(gameId: string, from: string) {
    const { data } = await api.get<string[]>(`/games/${gameId}/legal-moves`, { params: { from } })
    return data
}

export function useGetLegalMoves(gameId: string, from: string | null) {
    return useQuery({
        queryKey: ["legal-moves", gameId, from],
        queryFn: () => getLegalMoves(gameId, from!),
        enabled: Boolean(gameId && from),
        retry: false,
    })
}
