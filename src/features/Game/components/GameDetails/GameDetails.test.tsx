import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { GameDetails } from "./GameDetails"

describe("GameDetails", () => {
    it("renderiza o histórico agrupado por turno", () => {
        render(<GameDetails
            moves={[["e2–e4", "e7–e5"], ["g1–f3", ""]]}
            initialTimeSeconds={600}
            incrementSeconds={5}
            onUnavailable={() => undefined}
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
            onUnavailable={() => undefined}
        />)

        expect(screen.getByText("+8")).toBeInTheDocument()
        expect(screen.getByText("-24")).toBeInTheDocument()
    })

    it("encaminha as ações ainda indisponíveis", async () => {
        const onUnavailable = vi.fn()
        const user = userEvent.setup()
        render(<GameDetails moves={[]} initialTimeSeconds={600} incrementSeconds={0} onUnavailable={onUnavailable} />)

        await user.click(screen.getByRole("button", { name: "Oferecer empate" }))
        await user.click(screen.getByRole("button", { name: "Abandonar partida" }))

        expect(onUnavailable).toHaveBeenCalledTimes(2)
    })
})
