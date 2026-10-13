import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCreateChallenge } from "../../../../packages/hooks/challenges/useCreateChallenge"
import { useGetPerformance } from "../../../../packages/hooks/performances/useGetPerformance"
import { useGetGameHistory } from "../../../../packages/hooks/players/useGetGameHistory"
import { useJoinMatchmaking } from "../../../../packages/hooks/players/useJoinMatchmaking"
import { useLeaveMatchmaking } from "../../../../packages/hooks/players/useLeaveMatchmaking"
import { useMatchmakingQueueStatus } from "../../../../packages/hooks/players/useMatchmakingQueueStatus"
import { useCurrentMatch } from "../../../../packages/hooks/players/useCurrentMatch"
import { usePlayerGameEvents } from "../../../../packages/hooks/games/usePlayerGameEvents"
import { mensagemAdapter } from "../../../../packages/mensagem/mensagemAdapter"
import { getGameMode, type GameMode } from "../../../../packages/constants/gameModes"
import { useAuth } from "../../../auth/contexts/auth/useAuth"
import { Navbar } from "../../components/Navbar/Navbar"
import { OnlineFriends } from "../../components/OnlineFriends/OnlineFriends"
import { Performance } from "../../components/Performance/Performance"
import { PlayActions } from "../../components/PlayActions/PlayActions"
import { QuickGames } from "../../components/QuickGames/QuickGames"
import { SearchPlayers } from "../../components/SearchPlayers/SearchPlayers"
import styles from "./Home.module.css"

export function Home() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const userId = user?.id ?? ""
    const { data: performance } = useGetPerformance(userId);
    const { data: games = [] } = useGetGameHistory(userId);
    const [isPlayerSearchOpen, setIsPlayerSearchOpen] = useState(false)
    const [isSearchingMatch, setIsSearchingMatch] = useState(false)
    const [selectedGameMode, setSelectedGameMode] = useState<GameMode>("RAPID")
    const { mutateAsync: createChallenge, isPending: isCreatingChallenge } = useCreateChallenge()
    const { mutateAsync: joinMatchmaking, isPending: isJoiningMatchmaking } = useJoinMatchmaking()
    const { mutateAsync: leaveMatchmaking, isPending: isLeavingMatchmaking } = useLeaveMatchmaking()
    const { data: isInQueue = false } = useMatchmakingQueueStatus(userId, isSearchingMatch)
    const isSearching = isSearchingMatch || isInQueue
    const { data: currentMatch } = useCurrentMatch(Boolean(userId), isSearching && !isLeavingMatchmaking)
    const handleGameCreated = useCallback((createdGameId: string) => {
        navigate(`/game/${createdGameId}`)
    }, [navigate])
    usePlayerGameEvents(userId, handleGameCreated)

    useEffect(() => {
        if (isSearching && currentMatch) {
            navigate(`/game/${currentMatch.id}`)
        }
    }, [currentMatch, isSearching, navigate])

    if (!user) return null

    const username = user.username

    const handleJoinMatchmaking = async () => {
        if (!user?.id) return

        if (currentMatch) {
            navigate(`/game/${currentMatch.id}`)
            return
        }

        try {
            setIsSearchingMatch(true)
            const game = await joinMatchmaking({ userId: user.id, gameMode: selectedGameMode })

            if (game) {
                navigate(`/game/${game.id}`)
                return
            }

            mensagemAdapter.success("Buscando um oponente...")
        } catch (error) {
            setIsSearchingMatch(false)
            mensagemAdapter.error(error)
        }
    }

    const handleCreateChallenge = async (friendUsername: string, gameMode: GameMode) => {
        if (!user?.id) return
        if (currentMatch) {
            mensagemAdapter.error(null, "Você já está em uma partida em andamento.")
            return
        }

        try {
            const mode = getGameMode(gameMode)
            await createChallenge({
                challengedUsername: friendUsername,
                initialTimeSeconds: mode.initialTimeSeconds,
                incrementSeconds: mode.incrementSeconds,
            })
            mensagemAdapter.success("Solicitação de desafio enviada.")
        } catch (error) {
            mensagemAdapter.error(error)
        }
    }

    const handleLeaveMatchmaking = async () => {
        if (!user?.id || isJoiningMatchmaking || isLeavingMatchmaking) return

        try {
            await leaveMatchmaking(user.id)
            setIsSearchingMatch(false)
            mensagemAdapter.success("Você saiu da fila de matchmaking.")
        } catch (error) {
            mensagemAdapter.error(error)
        }
    }

    return (
        <main className={styles.home}>
            <section className={styles.content}>
                <Navbar username={username} onLogout={() => void logout()} />

                <div className={styles.pageIntro}>
                    <p className={styles.eyebrow}>PAINEL PRINCIPAL</p>
                    <h1>Bem-vindo de volta, {username}! <span>👋</span></h1>
                    <p>Pronto para jogar?</p>
                </div>

                <div className={`${styles.dashboard} ${isPlayerSearchOpen ? styles.dashboardSearchOpen : ""}`}>
                    <PlayActions
                        onPlay={handleJoinMatchmaking}
                        isSearching={isJoiningMatchmaking || isSearching}
                        onCancelSearch={handleLeaveMatchmaking}
                        isJoining={isJoiningMatchmaking}
                        isCancelling={isLeavingMatchmaking}
                        hasCurrentMatch={Boolean(currentMatch)}
                        selectedGameMode={selectedGameMode}
                        onGameModeChange={setSelectedGameMode}
                    />

                    <div className={styles.featureImage} role="img" aria-label="Peças de xadrez em um tabuleiro" />

                    <QuickGames username={username} games={games} onOpenGame={(gameId) => navigate(`/game/${gameId}`)} />

                    <aside className={styles.rightRail}>
                        <OnlineFriends
                            onChallenge={handleCreateChallenge}
                            onSearchPanelChange={setIsPlayerSearchOpen}
                            challengeDisabled={Boolean(currentMatch)}
                            isChallengePending={isCreatingChallenge}
                        />
                        {isPlayerSearchOpen && <SearchPlayers />}
                        <Performance performance={performance} />
                    </aside>
                </div>
            </section>
        </main>
    )
}
