import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Buttons } from "./Buttons"

describe("Buttons", () => {
    it("permite cancelar enquanto aguarda um oponente", async () => {
        const onCancelSearch = vi.fn()
        const user = userEvent.setup()
        render(<Buttons onPlay={() => undefined} isSearching onCancelSearch={onCancelSearch} />)

        await user.click(screen.getByRole("button", { name: "Sair da fila" }))

        expect(onCancelSearch).toHaveBeenCalledOnce()
    })

    it.each([{ isJoining: true }, { isCancelling: true }])("bloqueia cancelamentos sobrepostos: %o", (pending) => {
        render(<Buttons onPlay={() => undefined} isSearching onCancelSearch={vi.fn()} {...pending} />)

        expect(screen.getByRole("button", { name: /Sair da fila|Saindo da fila/ })).toBeDisabled()
    })

    it("mostra Jogar agora quando não existe partida", () => {
        render(<Buttons onPlay={() => undefined} />)

        expect(screen.getByRole("button", { name: "Jogar agora" })).toBeEnabled()
    })

    it("bloqueia o botão enquanto procura uma partida", () => {
        render(<Buttons onPlay={() => undefined} isSearching />)

        expect(screen.getByRole("button", { name: "Buscando partida..." })).toBeDisabled()
    })

    it("permite voltar para a partida atual", async () => {
        const onPlay = vi.fn()
        const user = userEvent.setup()
        render(<Buttons onPlay={onPlay} hasCurrentMatch />)

        await user.click(screen.getByRole("button", { name: "Voltar ao jogo" }))

        expect(onPlay).toHaveBeenCalledOnce()
    })
})
