import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCreateChallenge } from "../../../../packages/hooks/challenges/useCreateChallenge"
import { useGetPerformance } from "../../../../packages/hooks/performances/useGetPerformance"
import { useGetGameHistory } from "../../../../packages/hooks/players/useGetGameHistory"
import { useJoinMatchmaking } from "../../../../packages/hooks/players/useJoinMatchmaking"
import { useMatchmakingQueueStatus } from "../../../../packages/hooks/players/useMatchmakingQueueStatus"
import { mensagemAdapter } from "../../../../packages/mensagem/mensagemAdapter"
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
    const { mutateAsync: createChallenge } = useCreateChallenge()
    const { mutateAsync: joinMatchmaking, isPending: isJoiningMatchmaking } = useJoinMatchmaking()
    const { data: isInMatchmakingQueue, refetch: refetchQueueStatus } = useMatchmakingQueueStatus(
        userId,
        isSearchingMatch,
    )

    useEffect(() => {
        if (isSearchingMatch && isInMatchmakingQueue === false) {
            navigate("/game")
        }
    }, [isInMatchmakingQueue, isSearchingMatch, navigate])

    if (!user) return null

    const username = user.username

    const handleJoinMatchmaking = async () => {
        if (!user?.id) return

        try {
            await joinMatchmaking(user.id)
            const queueStatus = await refetchQueueStatus()
            setIsSearchingMatch(queueStatus.data === true)
            mensagemAdapter.success("Buscando um oponente...")
        } catch (error) {
            mensagemAdapter.error(error)
        }
    }

    const handleCreateChallenge = async (friendUsername: string) => {
        if (!user?.id) return

        try {
            await createChallenge({
                challengedUsername: friendUsername,
                initialTimeSeconds: 30,
                incrementSeconds: 10,
            })
            mensagemAdapter.success("Solicitação de desafio enviada.")
            navigate("/game")
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
                        isSearching={isJoiningMatchmaking || isSearchingMatch}
                    />

                    <div className={styles.featureImage} role="img" aria-label="Peças de xadrez em um tabuleiro" />

                    <QuickGames username={username} games={games} onOpenGame={(gameId) => navigate(`/game/${gameId}`)} />

                    <aside className={styles.rightRail}>
                        <OnlineFriends
                            onChallenge={(friendUsername) => handleCreateChallenge(friendUsername)}
                            onSearchPanelChange={setIsPlayerSearchOpen}
                        />
                        {isPlayerSearchOpen && <SearchPlayers />}
                        <Performance performance={performance} />
                    </aside>
                </div>
            </section>
        </main>
    )
}
