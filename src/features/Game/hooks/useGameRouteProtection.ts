import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import type { GameDetailsResponse } from "../../../packages/hooks/games/useGetGame"

type GamePlayers = Pick<GameDetailsResponse, "whitePlayer" | "blackPlayer">

type GameRouteProtectionParams = {
    gameId?: string
    userId?: string
    game?: GamePlayers
    isLoading: boolean
    isError: boolean
}

export function useGameRouteProtection({
    gameId,
    userId,
    game,
    isLoading,
    isError,
}: GameRouteProtectionParams) {
    const navigate = useNavigate()
    const gameDoesNotExist = Boolean(gameId) && !isLoading && !game
    const userIsNotAPlayer = Boolean(
        game
        && userId
        && game.whitePlayer !== userId
        && game.blackPlayer !== userId,
    )
    const shouldNavigateBack = Boolean(
        userId
        && (!gameId || isError || gameDoesNotExist || userIsNotAPlayer),
    )

    useEffect(() => {
        if (shouldNavigateBack) navigate(-1)
    }, [navigate, shouldNavigateBack])

    return shouldNavigateBack
}
