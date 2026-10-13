import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { api } from "../../../../packages/auth/axios"
import { Home } from "./Home"

const mocks = vi.hoisted(() => ({
    user: { id: "player-1", username: "Jogador" },
    navigate: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
}))

vi.mock("react-router-dom", () => ({ useNavigate: () => mocks.navigate }))
vi.mock("../../../auth/contexts/auth/useAuth", () => ({
    useAuth: () => ({ user: mocks.user, logout: vi.fn() }),
}))
vi.mock("../../../../packages/auth/axios", () => ({
    api: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
}))
vi.mock("../../../../packages/mensagem/mensagemAdapter", () => ({
    mensagemAdapter: { success: mocks.success, error: mocks.error },
}))
vi.mock("../../../../packages/hooks/challenges/useCreateChallenge", () => ({
    useCreateChallenge: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))
vi.mock("../../../../packages/hooks/performances/useGetPerformance", () => ({
    useGetPerformance: () => ({ data: undefined }),
}))
vi.mock("../../../../packages/hooks/players/useGetGameHistory", () => ({
    useGetGameHistory: () => ({ data: [] }),
}))
vi.mock("../../../../packages/hooks/games/usePlayerGameEvents", () => ({ usePlayerGameEvents: vi.fn() }))
vi.mock("../../components/Navbar/Navbar", () => ({ Navbar: () => null }))
vi.mock("../../components/OnlineFriends/OnlineFriends", () => ({ OnlineFriends: () => null }))
vi.mock("../../components/Performance/Performance", () => ({ Performance: () => null }))
vi.mock("../../components/QuickGames/QuickGames", () => ({ QuickGames: () => null }))
vi.mock("../../components/SearchPlayers/SearchPlayers", () => ({ SearchPlayers: () => null }))

function renderHome() {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    const view = render(<QueryClientProvider client={queryClient}><Home /></QueryClientProvider>)
    return { ...view, queryClient }
}

describe("cancelamento de matchmaking no lobby", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(api.get).mockImplementation(async (url) => ({
            data: String(url).endsWith("isinqueue") ? false : null,
        }))
        vi.mocked(api.post).mockResolvedValue({ data: null })
        vi.mocked(api.delete).mockResolvedValue({ data: undefined })
    })

    it("sai da fila e permite procurar outra partida", async () => {
        const user = userEvent.setup()
        const { queryClient } = renderHome()
        await user.click(screen.getByRole("button", { name: "Jogar agora" }))
        await waitFor(() => expect(screen.getByRole("button", { name: "Sair da fila" })).toBeEnabled())

        await user.click(screen.getByRole("button", { name: "Sair da fila" }))

        await waitFor(() => expect(screen.getByRole("button", { name: "Jogar agora" })).toBeEnabled())
        expect(api.delete).toHaveBeenCalledWith("/matchmaking/player-1/leave-queue")
        expect(queryClient.getQueryData(["matchmaking-queue", "player-1"])).toBe(false)
        expect(screen.queryByRole("button", { name: "Sair da fila" })).not.toBeInTheDocument()
        expect(screen.getByRole("button", { name: /Blitz 3 \+ 2/ })).toBeEnabled()
        expect(mocks.success).toHaveBeenCalledWith("Você saiu da fila de matchmaking.")
    })

    it("mantém a opção de cancelar e informa erro se a remoção falhar", async () => {
        const failure = new Error("Falha no cancelamento")
        vi.mocked(api.delete).mockRejectedValue(failure)
        const user = userEvent.setup()
        renderHome()
        await user.click(screen.getByRole("button", { name: "Jogar agora" }))
        await waitFor(() => expect(screen.getByRole("button", { name: "Sair da fila" })).toBeEnabled())

        await user.click(screen.getByRole("button", { name: "Sair da fila" }))

        await waitFor(() => expect(mocks.error).toHaveBeenCalledWith(failure))
        await waitFor(() => expect(screen.getByRole("button", { name: "Sair da fila" })).toBeEnabled())
        expect(screen.getByRole("button", { name: "Buscando partida..." })).toBeDisabled()
    })

    it("recupera a fila ao abrir o lobby e permite sair dela", async () => {
        let isQueued = true
        vi.mocked(api.get).mockImplementation(async (url) => ({
            data: String(url).endsWith("isinqueue") ? isQueued : null,
        }))
        vi.mocked(api.delete).mockImplementation(async () => {
            isQueued = false
            return { data: undefined }
        })
        const user = userEvent.setup()
        renderHome()
        await waitFor(() => expect(screen.getByRole("button", { name: "Sair da fila" })).toBeEnabled())

        await user.click(screen.getByRole("button", { name: "Sair da fila" }))

        await waitFor(() => expect(screen.getByRole("button", { name: "Jogar agora" })).toBeEnabled())
        expect(api.post).not.toHaveBeenCalled()
    })
})
