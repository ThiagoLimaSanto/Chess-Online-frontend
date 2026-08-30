import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "../../auth/axios"

export type DrawOfferResponse = { offeredByPlayerId: string | null }

async function getDrawOffer(gameId: string) {
    const { data } = await api.get<DrawOfferResponse>(`/games/${gameId}/draw-offer`)
    return data
}

export function useGetDrawOffer(gameId: string, enabled = true) {
    return useQuery({
        queryKey: ["draw-offer", gameId],
        queryFn: () => getDrawOffer(gameId),
        enabled: Boolean(gameId) && enabled,
        retry: false,
    })
}

export function useOfferDraw() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (gameId: string) => {
            const { data } = await api.post<DrawOfferResponse>(`/games/${gameId}/draw-offer`)
            return data
        },
        onSuccess: (offer, gameId) => {
            queryClient.setQueryData(["draw-offer", gameId], offer)
        },
    })
}

export function useRespondDrawOffer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ gameId, accepted }: { gameId: string; accepted: boolean }) =>
            api.post(`/games/${gameId}/draw-offer/respond`, { accepted }),
        onSuccess: (_, { gameId, accepted }) => {
            queryClient.setQueryData(["draw-offer", gameId], { offeredByPlayerId: null })
            if (accepted) {
                void queryClient.invalidateQueries({ queryKey: ["game", gameId] })
                void queryClient.invalidateQueries({ queryKey: ["performance"] })
            }
        },
    })
}

export function useAbandonGame() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (gameId: string) => api.post(`/games/${gameId}/abandon`),
        onSuccess: (_, gameId) => {
            void queryClient.invalidateQueries({ queryKey: ["game", gameId] })
            void queryClient.invalidateQueries({ queryKey: ["performance"] })
            void queryClient.invalidateQueries({ queryKey: ["game-history"] })
        },
    })
}
