import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import type { GameMove, GamePiece } from "../../../../packages/hooks/games/useGetGame"
import { GameSummary } from "./GameSummary"

const initialCounts: Record<GamePiece["type"], number> = {
    KING: 1, QUEEN: 1, ROOK: 2, BISHOP: 2, KNIGHT: 2, PAWN: 8,
}

function boardWithout(...removed: Array<{ color: GamePiece["color"]; type: GamePiece["type"] }>) {
    const removals = [...removed]
    const board: GamePiece[] = []

    for (const color of ["WHITE", "BLACK"] as const) {
        for (const [type, amount] of Object.entries(initialCounts) as [GamePiece["type"], number][]) {
            for (let index = 0; index < amount; index++) {
                const removalIndex = removals.findIndex((piece) => piece.color === color && piece.type === type)
                if (removalIndex >= 0) removals.splice(removalIndex, 1)
                else board.push({ color, type, square: `${color}-${type}-${index}` })
            }
        }
    }
    return board
}

describe("GameSummary", () => {
    it("mostra as capturas dos dois jogadores e a vantagem relativa ao usuário", () => {
        const board = boardWithout(
            { color: "BLACK", type: "QUEEN" },
            { color: "WHITE", type: "ROOK" },
        )

        render(<GameSummary board={board} moves={[]} playerColor="WHITE" whitePlayerId="white" />)

        expect(screen.getByText("Por você")).toBeInTheDocument()
        expect(screen.getByText("Pelo adversário")).toBeInTheDocument()
        expect(screen.getByText("♛")).toBeInTheDocument()
        expect(screen.getByText("♖")).toBeInTheDocument()
        expect(screen.getByText("+4")).toBeInTheDocument()
        expect(screen.getByText("Você está à frente")).toBeInTheDocument()
    })

    it("não considera um peão promovido como capturado", () => {
        const board = boardWithout({ color: "WHITE", type: "PAWN" })
        board.push({ color: "WHITE", type: "QUEEN", square: "a8" })
        const moves: GameMove[] = [{
            id: "move", playerId: "white", fromSquare: "a7", toSquare: "a8",
            promotionType: "QUEEN", moveNumber: 1,
        }]

        render(<GameSummary board={board} moves={moves} playerColor="WHITE" whitePlayerId="white" />)

        expect(screen.getByText("Nenhuma peça capturada")).toBeInTheDocument()
        expect(screen.getByText("+8")).toBeInTheDocument()
    })

    it("mostra estado neutro quando o material está equilibrado", () => {
        render(<GameSummary board={boardWithout()} moves={[]} playerColor="BLACK" whitePlayerId="white" />)

        expect(screen.getByText("0")).toBeInTheDocument()
        expect(screen.getByText("Material equilibrado")).toBeInTheDocument()
    })
})
