import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { ChallengeModePicker } from "./ChallengeModePicker"

describe("ChallengeModePicker", () => {
    it("oferece os quatro modos de jogo", () => {
        render(<ChallengeModePicker friendUsername="Carlos" onSelect={() => undefined} onCancel={() => undefined} />)

        expect(screen.getByRole("button", { name: "Bullet 1 + 0" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Blitz 3 + 2" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Rápido 10 + 0" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Clássico 30 + 0" })).toBeInTheDocument()
    })

    it("envia o modo escolhido", async () => {
        const onSelect = vi.fn()
        const user = userEvent.setup()
        render(<ChallengeModePicker friendUsername="Carlos" onSelect={onSelect} onCancel={() => undefined} />)

        await user.click(screen.getByRole("button", { name: "Blitz 3 + 2" }))

        expect(onSelect).toHaveBeenCalledWith("BLITZ")
    })

    it("permite cancelar a escolha", async () => {
        const onCancel = vi.fn()
        const user = userEvent.setup()
        render(<ChallengeModePicker friendUsername="Carlos" onSelect={() => undefined} onCancel={onCancel} />)

        await user.click(screen.getByRole("button", { name: "Cancelar desafio" }))

        expect(onCancel).toHaveBeenCalledOnce()
    })
})
