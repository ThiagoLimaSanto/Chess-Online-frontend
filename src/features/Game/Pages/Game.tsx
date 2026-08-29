import { useNavigate, useParams } from "react-router-dom"

import { mensagemAdapter } from "../../../packages/mensagem/mensagemAdapter"
import { useGetGame, type GamePiece } from "../../../packages/hooks/games/useGetGame"
import { useGameEvents } from "../../../packages/hooks/games/useGameEvents"
import { useGetPerformance } from "../../../packages/hooks/performances/useGetPerformance"
import { useAuth } from "../../auth/contexts/auth/useAuth"
import { Navbar } from "../../Lobby/components/Navbar/Navbar"
import { GameBoard } from "../components/GameBoard/GameBoard"
import { GameDetails } from "../components/GameDetails/GameDetails"
import { GameSummary } from "../components/GameSummary/GameSummary"
import { PlayerCard } from "../components/PlayerCard/PlayerCard"

import styles from "./Game.module.css"

const pieces = {
    WHITE: { KING: "♔", QUEEN: "♕", ROOK: "♖", BISHOP: "♗", KNIGHT: "♘", PAWN: "♙" },
    BLACK: { KING: "♚", QUEEN: "♛", ROOK: "♜", BISHOP: "♝", KNIGHT: "♞", PAWN: "♟" },
} as const

function createBoard(boardPieces: GamePiece[], perspective: "WHITE" | "BLACK") {
    const board = Array.from({ length: 8 }, () => Array<string>(8).fill(""))
    boardPieces.forEach(({ square, type, color }) => {
        board[8 - Number(square[1])][square.charCodeAt(0) - 97] = pieces[color][type]
    })
    return perspective === "WHITE"
        ? board
        : board.toReversed().map((row) => row.toReversed())
}

export function Game() {
    const navigate = useNavigate()
    const { gameId } = useParams()
    const { user, logout } = useAuth()
    const { data: game, isLoading, isError } = useGetGame(gameId ?? "")
    useGameEvents(gameId ?? "")
    const { data: whitePerformance } = useGetPerformance(game?.whitePlayer ?? "")
    const { data: blackPerformance } = useGetPerformance(game?.blackPlayer ?? "")

    if (!user) return null
    if (!gameId) return <main className={styles.gamePage}><div className={styles.feedback}>Nenhuma partida foi selecionada.</div></main>
    if (isLoading) return <main className={styles.gamePage}><div className={styles.feedback}>Carregando partida...</div></main>
    if (isError || !game) return <main className={styles.gamePage}><div className={styles.feedback}>Não foi possível carregar a partida.</div></main>

    const playerIsWhite = game.whitePlayer === user.id
    const playerColor = playerIsWhite ? "WHITE" : "BLACK"
    const opponentColor = playerIsWhite ? "BLACK" : "WHITE"
    const opponentName = playerIsWhite ? game.blackPlayerUsername : game.whitePlayerUsername
    const playerPerformance = playerIsWhite ? whitePerformance : blackPerformance
    const opponentPerformance = playerIsWhite ? blackPerformance : whitePerformance
    const board = createBoard(game.board, playerColor)
    const isPlayerTurn = game.status === "IN_PROGRESS"
        && (game.moves.length % 2 === 0 ? playerColor === "WHITE" : playerColor === "BLACK")
    const turnPlayerName = game.moves.length % 2 === 0
        ? game.whitePlayerUsername
        : game.blackPlayerUsername
    const moves = game.moves.reduce<string[][]>((rows, move, index) => {
        const notation = `${move.fromSquare}–${move.toSquare}`
        if (index % 2 === 0) rows.push([notation, ""])
        else rows[rows.length - 1][1] = notation
        return rows
    }, [])

    const unavailable = () => {
        mensagemAdapter.error("Essa ação estará disponível quando a partida estiver conectada à API.")
    }

    return (
        <main className={styles.gamePage}>
            <div className={styles.content}>
                <Navbar username={user.username} onLogout={() => void logout()} />

                <div className={styles.breadcrumb}><button type="button" onClick={() => navigate("/")}>← Voltar ao lobby</button><span>{gameId ? `Partida ${gameId.slice(0, 8)}` : "Partida rápida"}</span></div>

                <section className={styles.gameLayout} aria-label="Partida de xadrez">
                    <aside className={styles.leftPanel}>
                        <PlayerCard name={opponentName} color={opponentColor} rating={opponentPerformance?.rating} gamesPlayed={opponentPerformance?.gamesPlayed} victories={opponentPerformance?.victories} time="10:00" tone="opponent" />
                        <GameSummary
                            board={game.board}
                            moves={game.moves}
                            playerColor={playerColor}
                            whitePlayerId={game.whitePlayer}
                        />
                    </aside>

                    <div className={styles.boardColumn}>
                        <GameBoard
                            key={`${game.id}-${game.moves.length}`}
                            gameId={game.id}
                            playerId={user.id}
                            board={board}
                            perspective={playerColor}
                            isPlayerTurn={isPlayerTurn}
                            gameStatus={game.status}
                            turnPlayerName={turnPlayerName}
                        />

                        <PlayerCard name={user.username} color={playerColor} rating={playerPerformance?.rating} gamesPlayed={playerPerformance?.gamesPlayed} victories={playerPerformance?.victories} time="10:00" tone="you" />
                    </div>

                    <GameDetails
                        moves={moves}
                        initialTimeSeconds={game.initialTimeSeconds}
                        incrementSeconds={game.incrementSeconds}
                        playerRating={playerPerformance?.rating}
                        opponentRating={opponentPerformance?.rating}
                        onUnavailable={unavailable}
                    />
                </section>
            </div>
        </main>
    )
}
