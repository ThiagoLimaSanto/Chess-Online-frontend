import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it } from "vitest"

import { useGameRouteProtection } from "./useGameRouteProtection"

const whitePlayer = "00000000-0000-0000-0000-000000000001"
const blackPlayer = "00000000-0000-0000-0000-000000000002"
const outsider = "00000000-0000-0000-0000-000000000003"
const game = { whitePlayer, blackPlayer }

type ProbeProps = {
    gameId?: string
    userId?: string
    loadedGame?: typeof game
    isLoading?: boolean
    isError?: boolean
}

function Probe({ gameId, userId, loadedGame, isLoading = false, isError = false }: ProbeProps) {
    useGameRouteProtection({ gameId, userId, game: loadedGame, isLoading, isError })
    return <div>Partida protegida</div>
}

function renderRoute(props: ProbeProps) {
    return render(
        <MemoryRouter initialEntries={["/lobby", "/game"]} initialIndex={1}>
            <Routes>
                <Route path="/lobby" element={<div>Lobby</div>} />
                <Route path="/game" element={<Probe {...props} />} />
            </Routes>
        </MemoryRouter>,
    )
}

describe("useGameRouteProtection", () => {
    it("volta para a rota anterior quando não há id da partida", async () => {
        renderRoute({ userId: whitePlayer })

        await waitFor(() => expect(screen.getByText("Lobby")).toBeInTheDocument())
    })

    it("volta quando a partida não foi encontrada", async () => {
        renderRoute({ gameId: "game-1", userId: whitePlayer })

        await waitFor(() => expect(screen.getByText("Lobby")).toBeInTheDocument())
    })

    it("volta quando o usuário não participa da partida", async () => {
        renderRoute({ gameId: "game-1", userId: outsider, loadedGame: game })

        await waitFor(() => expect(screen.getByText("Lobby")).toBeInTheDocument())
    })

    it("mantém um dos jogadores na partida", () => {
        renderRoute({ gameId: "game-1", userId: blackPlayer, loadedGame: game })

        expect(screen.getByText("Partida protegida")).toBeInTheDocument()
        expect(screen.queryByText("Lobby")).not.toBeInTheDocument()
    })
})
