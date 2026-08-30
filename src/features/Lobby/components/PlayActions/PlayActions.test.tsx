import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { PlayActions } from "./PlayActions"

describe("PlayActions", () => {
    it("exibe todos os modos com seus controles de tempo", () => {
        render(<PlayActions
            onPlay={() => undefined}
            selectedGameMode="RAPID"
            onGameModeChange={() => undefined}
        />)

        expect(screen.getByRole("button", { name: /Bullet 1 \+ 0/ })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /Blitz 3 \+ 2/ })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /Rápido 10 \+ 0/ })).toHaveAttribute("aria-pressed", "true")
        expect(screen.getByRole("button", { name: /Clássico 30 \+ 0/ })).toBeInTheDocument()
    })

    it("altera o modo selecionado", async () => {
        const onGameModeChange = vi.fn()
        const user = userEvent.setup()
        render(<PlayActions
            onPlay={() => undefined}
            selectedGameMode="RAPID"
            onGameModeChange={onGameModeChange}
        />)

        await user.click(screen.getByRole("button", { name: /Blitz 3 \+ 2/ }))

        expect(onGameModeChange).toHaveBeenCalledWith("BLITZ")
    })

    it("bloqueia a troca de modo durante a busca", () => {
        render(<PlayActions
            onPlay={() => undefined}
            selectedGameMode="BULLET"
            onGameModeChange={() => undefined}
            isSearching
        />)

        expect(screen.getByRole("button", { name: /Bullet 1 \+ 0/ })).toBeDisabled()
        expect(screen.getByRole("button", { name: /Clássico 30 \+ 0/ })).toBeDisabled()
    })
})
