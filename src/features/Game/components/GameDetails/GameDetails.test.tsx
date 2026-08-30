import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { GameDetails } from "./GameDetails"

const actions = {
    gameStatus: "IN_PROGRESS" as const,
    playerId: "white-player",
    gameMode: "RAPID" as const,
    onOfferDraw: vi.fn(),
    onAcceptDraw: vi.fn(),
    onDeclineDraw: vi.fn(),
    onAbandon: vi.fn(),
}

describe("GameDetails", () => {
    it("renderiza o histórico agrupado por turno", () => {
        render(<GameDetails
            moves={[["e2–e4", "e7–e5"], ["g1–f3", ""]]}
            initialTimeSeconds={600}
            incrementSeconds={5}
            {...actions}
        />)

        expect(screen.getByText("e2–e4")).toBeInTheDocument()
        expect(screen.getByText("e7–e5")).toBeInTheDocument()
        expect(screen.getByText("g1–f3")).toBeInTheDocument()
        expect(screen.getByText("◷ 10 min + 5s")).toBeInTheDocument()
    })

    it("calcula a variação Elo com os ratings atuais", () => {
        render(<GameDetails
            moves={[]}
            initialTimeSeconds={600}
            incrementSeconds={0}
            playerRating={1400}
            opponentRating={1200}
            {...actions}
        />)

        expect(screen.getByText("+8")).toBeInTheDocument()
        expect(screen.getByText("-24")).toBeInTheDocument()
    })

    it("permite oferecer empate e abandonar a partida", async () => {
        const onOfferDraw = vi.fn()
        const onAbandon = vi.fn()
        const user = userEvent.setup()
        render(<GameDetails
            moves={[]}
            initialTimeSeconds={600}
            incrementSeconds={0}
            {...actions}
            onOfferDraw={onOfferDraw}
            onAbandon={onAbandon}
        />)

        await user.click(screen.getByRole("button", { name: "Oferecer empate" }))
        await user.click(screen.getByRole("button", { name: "Abandonar partida" }))

        expect(onOfferDraw).toHaveBeenCalledOnce()
        expect(onAbandon).toHaveBeenCalledOnce()
    })

    it("mostra as opções de aceitar ou recusar a oferta do adversário", async () => {
        const onAcceptDraw = vi.fn()
        const onDeclineDraw = vi.fn()
        const user = userEvent.setup()
        render(<GameDetails
            moves={[]}
            initialTimeSeconds={600}
            incrementSeconds={0}
            {...actions}
            drawOfferedByPlayerId="black-player"
            onAcceptDraw={onAcceptDraw}
            onDeclineDraw={onDeclineDraw}
        />)

        expect(screen.getByText("Seu adversário solicitou empate.")).toBeInTheDocument()
        await user.click(screen.getByRole("button", { name: "Aceitar empate" }))
        await user.click(screen.getByRole("button", { name: "Recusar empate" }))

        expect(onAcceptDraw).toHaveBeenCalledOnce()
        expect(onDeclineDraw).toHaveBeenCalledOnce()
    })

    it("bloqueia uma segunda oferta do mesmo jogador", () => {
        render(<GameDetails
            moves={[]}
            initialTimeSeconds={600}
            incrementSeconds={0}
            {...actions}
            drawOfferedByPlayerId="white-player"
        />)

        expect(screen.getByRole("button", { name: "Empate solicitado" })).toBeDisabled()
    })
})
