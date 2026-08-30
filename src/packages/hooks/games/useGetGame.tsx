import { useQuery } from "@tanstack/react-query";
import { api } from "../../auth/axios";
import type { GameMode } from "../../constants/gameModes";

export type GamePiece = { square: string; type: "KING" | "QUEEN" | "ROOK" | "BISHOP" | "KNIGHT" | "PAWN"; color: "WHITE" | "BLACK" }
export type GameMove = { id: string; playerId: string; fromSquare: string; toSquare: string; promotionType?: GamePiece["type"] | null; moveNumber: number }
export type GameDetailsResponse = { id: string; whitePlayer: string; whitePlayerUsername: string; blackPlayer: string; blackPlayerUsername: string; status: "IN_PROGRESS" | "FINISHED"; initialTimeSeconds: number; incrementSeconds: number; gameMode: GameMode; board: GamePiece[]; moves: GameMove[] }

async function getGame(gameId: string) {
    const { data } = await api.get<GameDetailsResponse>(`/games/${gameId}`)
    return data
}

export function useGetGame(gameId: string) {
    return useQuery({
        queryKey: ["game", gameId],
        queryFn: () => getGame(gameId),
        enabled: Boolean(gameId),
        retry: false,
    })
}
