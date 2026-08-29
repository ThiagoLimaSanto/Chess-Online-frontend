import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { GameBoard } from "./GameBoard"

const mocks = vi.hoisted(() => ({
    legalMoves: [] as string[],
    makeMove: vi.fn(),
    messageError: vi.fn(),
}))

vi.mock("../../../../packages/hooks/games/useGetLegalMoves", () => ({
    useGetLegalMoves: () => ({ data: mocks.legalMoves, isFetching: false, error: null }),
}))

vi.mock("../../../../packages/hooks/games/useMakeMove", () => ({
    useMakeMove: () => ({ mutateAsync: mocks.makeMove, isPending: false }),
}))

vi.mock("../../../../packages/mensagem/mensagemAdapter", () => ({
    mensagemAdapter: { error: mocks.messageError },
}))

function boardWith(piece: string, row: number, column: number) {
    const board = Array.from({ length: 8 }, () => Array<string>(8).fill(""))
    board[row][column] = piece
    return board
}

const defaultProps = {
    gameId: "game-1",
    playerId: "white-player",
    perspective: "WHITE" as const,
    isPlayerTurn: true,
    gameStatus: "IN_PROGRESS" as const,
    turnPlayerName: "nyamh",
}

describe("GameBoard", () => {
    beforeEach(() => {
        mocks.legalMoves = []
        mocks.makeMove.mockReset().mockResolvedValue({})
        mocks.messageError.mockReset()
    })

    it("seleciona o peão e envia o avanço inicial de duas casas ao backend", async () => {
        mocks.legalMoves = ["a3", "a4"]
        const user = userEvent.setup()
        render(<GameBoard {...defaultProps} board={boardWith("♙", 6, 0)} />)

        await user.click(screen.getByRole("button", { name: "Sua peça em a2" }))
        await user.click(screen.getByRole("button", { name: "Casa a4" }))

        await waitFor(() => expect(mocks.makeMove).toHaveBeenCalledWith({
            gameId: "game-1",
            playerId: "white-player",
            fromSquare: "a2",
            toSquare: "a4",
            promotionType: undefined,
        }))
    })

    it("solicita e envia o tipo de promoção", async () => {
        mocks.legalMoves = ["a8"]
        const user = userEvent.setup()
        render(<GameBoard {...defaultProps} board={boardWith("♙", 1, 0)} />)

        await user.click(screen.getByRole("button", { name: "Sua peça em a7" }))
        await user.click(screen.getByRole("button", { name: "Casa a8" }))
        expect(screen.getByRole("dialog", { name: "Escolha a promoção do peão" })).toBeInTheDocument()
        await user.click(screen.getByRole("button", { name: "Dama" }))

        await waitFor(() => expect(mocks.makeMove).toHaveBeenCalledWith(expect.objectContaining({
            fromSquare: "a7",
            toSquare: "a8",
            promotionType: "QUEEN",
        })))
    })

    it("bloqueia a seleção fora do turno e informa o jogador", async () => {
        const user = userEvent.setup()
        render(<GameBoard {...defaultProps} board={boardWith("♙", 6, 4)} isPlayerTurn={false} turnPlayerName="Carlos" />)

        expect(screen.getByText("Carlos")).toBeInTheDocument()
        await user.click(screen.getByRole("button", { name: "Sua peça em e2" }))

        expect(mocks.makeMove).not.toHaveBeenCalled()
        expect(mocks.messageError).toHaveBeenCalledWith(null, "Aguarde a jogada do adversário.")
    })

    it("mostra partida encerrada e desabilita as casas", () => {
        render(<GameBoard {...defaultProps} board={boardWith("♙", 6, 4)} gameStatus="FINISHED" isPlayerTurn={false} />)

        expect(screen.getByText("Partida encerrada")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Sua peça em e2" })).toBeDisabled()
    })
})
