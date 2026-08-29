import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "../../auth/axios"

export type PromotionType = "QUEEN" | "ROOK" | "BISHOP" | "KNIGHT"

export type MakeMoveInput = {
    gameId: string
    playerId: string
    fromSquare: string
    toSquare: string
    promotionType?: PromotionType
}

export type MoveResponse = {
    id: string
    gameId: string
    playerId: string
    fromSquare: string
    toSquare: string
    piece: string
    moveNumber: number
    createdAt: string
}

async function makeMove({ gameId, ...move }: MakeMoveInput) {
    const { data } = await api.post<MoveResponse>(`/games/${gameId}/moves`, move)
    return data
}

export function useMakeMove() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: makeMove,
        onSuccess: async (move) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["game", move.gameId] }),
                queryClient.invalidateQueries({ queryKey: ["legal-moves", move.gameId] }),
            ])
        },
    })
}
