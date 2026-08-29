import { useState } from "react"
import axios from "axios"
import { useGetLegalMoves } from "../../../../packages/hooks/games/useGetLegalMoves"
import { useMakeMove, type PromotionType } from "../../../../packages/hooks/games/useMakeMove"
import { mensagemAdapter } from "../../../../packages/mensagem/mensagemAdapter"
import styles from "./GameBoard.module.css"

type GameBoardProps = {
    gameId: string
    playerId: string
    board: string[][]
    perspective: "WHITE" | "BLACK"
    isPlayerTurn: boolean
    gameStatus: "IN_PROGRESS" | "FINISHED"
    turnPlayerName: string
}

type PendingPromotion = { toSquare: string }

const promotionPieces: Record<PromotionType, string> = {
    QUEEN: "Dama",
    ROOK: "Torre",
    BISHOP: "Bispo",
    KNIGHT: "Cavalo",
}

export function GameBoard({ gameId, playerId, board, perspective, isPlayerTurn, gameStatus, turnPlayerName }: GameBoardProps) {
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
    const [selectedPiece, setSelectedPiece] = useState("")
    const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null)
    const { data: legalMoves = [], isFetching, error } = useGetLegalMoves(gameId, selectedSquare)
    const { mutateAsync: makeMove, isPending: isMoving } = useMakeMove()
    const errorMessage = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined
    const files = perspective === "WHITE" ? "abcdefgh" : "hgfedcba"
    const ranks = perspective === "WHITE" ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8]

    const submitMove = async (toSquare: string, promotionType?: PromotionType) => {
        if (!selectedSquare) return

        try {
            await makeMove({ gameId, playerId, fromSquare: selectedSquare, toSquare, promotionType })
            setSelectedSquare(null)
            setSelectedPiece("")
            setPendingPromotion(null)
        } catch (moveError) {
            setPendingPromotion(null)
            mensagemAdapter.error(moveError, "Não foi possível realizar esse movimento.")
        }
    }

    const selectSquare = (square: string, piece: string, isOwnPiece: boolean) => {
        if (isMoving || gameStatus !== "IN_PROGRESS") return

        if (isOwnPiece) {
            if (!isPlayerTurn) {
                mensagemAdapter.error(null, "Aguarde a jogada do adversário.")
                return
            }

            setSelectedSquare((current) => {
                const next = current === square ? null : square
                setSelectedPiece(next ? piece : "")
                return next
            })
            setPendingPromotion(null)
            return
        }

        if (!selectedSquare) return

        const isPawn = selectedPiece === "♙" || selectedPiece === "♟"
        const reachesLastRank = square.endsWith("8") || square.endsWith("1")
        if (isPawn && reachesLastRank) {
            setPendingPromotion({ toSquare: square })
            return
        }

        void submitMove(square)
    }

    return <div className={styles.frame}>
        <div className={`${styles.turnIndicator} ${isPlayerTurn ? styles.yourTurn : ""}`} role="status">
            <span aria-hidden="true" />
            {gameStatus === "FINISHED"
                ? <strong>Partida encerrada</strong>
                : <><small>Vez de</small><strong>{isPlayerTurn ? `${turnPlayerName} (você)` : turnPlayerName}</strong></>}
        </div>
        <div className={styles.files} aria-hidden="true">{files.split("").map((file) => <span key={file}>{file}</span>)}</div>
        <div className={styles.board} aria-label="Tabuleiro de xadrez">
            {board.flatMap((row, rowIndex) => row.map((piece, columnIndex) => {
                const pieceColor = "♚♛♜♝♞♟".includes(piece) ? "BLACK" : "WHITE"
                const ownership = pieceColor === perspective ? styles.ownPiece : styles.enemyPiece
                const square = `${files[columnIndex]}${ranks[rowIndex]}`
                const isOwnPiece = Boolean(piece) && pieceColor === perspective
                const isSelected = square === selectedSquare
                const isLegalMove = legalMoves.includes(square)
                const squareClasses = [
                    (rowIndex + columnIndex) % 2 === 0 ? styles.lightSquare : styles.darkSquare,
                    isSelected ? styles.selectedSquare : "",
                    isLegalMove ? styles.legalSquare : "",
                ].filter(Boolean).join(" ")

                return <div className={squareClasses} key={square}>
                    {columnIndex === 0 && <small>{ranks[rowIndex]}</small>}
                    <button
                        type="button"
                        className={piece ? `${styles.piece} ${ownership} ${isSelected ? styles.selectedPiece : ""} ${pieceColor === "BLACK" ? styles.blackPiece : styles.whitePiece}` : styles.emptySquare}
                        onClick={() => selectSquare(square, piece, isOwnPiece)}
                        disabled={isMoving || gameStatus !== "IN_PROGRESS" || (!isOwnPiece && !selectedSquare)}
                        aria-label={piece ? `${isOwnPiece ? "Sua peça" : "Peça adversária"} em ${square}` : `Casa ${square}`}
                        aria-pressed={isOwnPiece ? isSelected : undefined}
                    >{piece}</button>
                </div>
            }))}
        </div>
        {pendingPromotion && <div className={styles.promotion} role="dialog" aria-label="Escolha a promoção do peão">
            <strong>Promover peão para:</strong>
            <div>
                {(Object.entries(promotionPieces) as [PromotionType, string][]).map(([type, label]) => (
                    <button key={type} type="button" disabled={isMoving} onClick={() => void submitMove(pendingPromotion.toSquare, type)}>
                        {label}
                    </button>
                ))}
            </div>
            <button type="button" className={styles.cancelPromotion} onClick={() => setPendingPromotion(null)}>Cancelar</button>
        </div>}
        {selectedSquare && <div className={`${styles.selectionStatus} ${error ? styles.selectionError : ""}`}>
            {isMoving
                ? "Enviando movimento..."
                : isFetching
                ? "Calculando movimentos..."
                : error
                    ? errorMessage ?? "Não foi possível calcular os movimentos desta peça."
                    : `${legalMoves.length} movimento${legalMoves.length === 1 ? "" : "s"} possível${legalMoves.length === 1 ? "" : "is"}`}
        </div>}
    </div>
}
