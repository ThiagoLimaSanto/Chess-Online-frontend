import type { GameMove, GamePiece } from "../../../../packages/hooks/games/useGetGame"

import styles from "./GameSummary.module.css"

type PieceColor = GamePiece["color"]
type PieceType = GamePiece["type"]
type Inventory = Record<PieceType, number>

type GameSummaryProps = {
    board: GamePiece[]
    moves: GameMove[]
    playerColor: PieceColor
    whitePlayerId: string
}

const initialInventory: Inventory = {
    KING: 1, QUEEN: 1, ROOK: 2, BISHOP: 2, KNIGHT: 2, PAWN: 8,
}

const materialValue: Record<PieceType, number> = {
    KING: 0, QUEEN: 9, ROOK: 5, BISHOP: 3, KNIGHT: 3, PAWN: 1,
}

const pieceOrder: PieceType[] = ["QUEEN", "ROOK", "BISHOP", "KNIGHT", "PAWN"]

const symbols: Record<PieceColor, Record<PieceType, string>> = {
    WHITE: { KING: "♔", QUEEN: "♕", ROOK: "♖", BISHOP: "♗", KNIGHT: "♘", PAWN: "♙" },
    BLACK: { KING: "♚", QUEEN: "♛", ROOK: "♜", BISHOP: "♝", KNIGHT: "♞", PAWN: "♟" },
}

function emptyInventory(): Inventory {
    return { KING: 0, QUEEN: 0, ROOK: 0, BISHOP: 0, KNIGHT: 0, PAWN: 0 }
}

function capturedPieces(board: GamePiece[], moves: GameMove[], color: PieceColor, whitePlayerId: string) {
    const expected = { ...initialInventory }
    const current = emptyInventory()

    board.filter((piece) => piece.color === color).forEach((piece) => {
        current[piece.type] += 1
    })

    moves.forEach((move) => {
        const moveColor: PieceColor = move.playerId === whitePlayerId ? "WHITE" : "BLACK"
        if (moveColor === color && move.promotionType) {
            expected.PAWN -= 1
            expected[move.promotionType] += 1
        }
    })

    return pieceOrder.flatMap((type) =>
        Array.from({ length: Math.max(0, expected[type] - current[type]) }, () => ({ color, type })),
    )
}

function materialScore(board: GamePiece[], color: PieceColor) {
    return board
        .filter((piece) => piece.color === color)
        .reduce((score, piece) => score + materialValue[piece.type], 0)
}

export function GameSummary({ board, moves, playerColor, whitePlayerId }: GameSummaryProps) {
    const opponentColor = playerColor === "WHITE" ? "BLACK" : "WHITE"
    const opponentCaptured = capturedPieces(board, moves, opponentColor, whitePlayerId)
    const playerCaptured = capturedPieces(board, moves, playerColor, whitePlayerId)
    const advantage = materialScore(board, playerColor) - materialScore(board, opponentColor)
    const advantageClass = advantage > 0 ? styles.ahead : advantage < 0 ? styles.behind : styles.equal
    const advantageText = advantage > 0
        ? "Você está à frente"
        : advantage < 0
            ? "O adversário está à frente"
            : "Material equilibrado"

    return <>
        <section className={styles.card}>
            <h2>Peças capturadas</h2>
            {opponentCaptured.length === 0 && playerCaptured.length === 0
                ? <p className={styles.empty}>Nenhuma peça capturada</p>
                : <div className={styles.capturedGroups}>
                    {opponentCaptured.length > 0 && <div className={styles.capturedRow}>
                        <small>Por você</small>
                        <div className={styles.captured}>
                            {opponentCaptured.map(({ color, type }, index) => <span className={color === "WHITE" ? styles.whitePiece : styles.blackPiece} key={`${color}-${type}-${index}`}>{symbols[color][type]}</span>)}
                        </div>
                    </div>}
                    {playerCaptured.length > 0 && <div className={styles.capturedRow}>
                        <small>Pelo adversário</small>
                        <div className={styles.captured}>
                            {playerCaptured.map(({ color, type }, index) => <span className={color === "WHITE" ? styles.whitePiece : styles.blackPiece} key={`${color}-${type}-${index}`}>{symbols[color][type]}</span>)}
                        </div>
                    </div>}
                </div>}
        </section>
        <section className={styles.card}>
            <h2>Vantagem material</h2>
            <strong className={advantageClass}>{advantage > 0 ? "+" : ""}{advantage}</strong>
            <p>{advantageText}</p>
        </section>
    </>
}
