import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCreateChallenge } from "../../../../packages/hooks/challenges/useCreateChallenge"
import { useJoinMatchmaking } from "../../../../packages/hooks/players/useJoinMatchmaking"
import { mensagemAdapter } from "../../../../packages/mensagem/mensagemAdapter"
import { useAuth } from "../../../auth/contexts/auth/useAuth"
import { Navbar } from "../../components/Navbar/Navbar"
import { OnlineFriends } from "../../components/OnlineFriends/OnlineFriends"
import { Performance } from "../../components/Performance/Performance"
import { PlayActions } from "../../components/PlayActions/PlayActions"
import { QuickGames } from "../../components/QuickGames/QuickGames"
import { SearchPlayers } from "../../components/SearchPlayers/SearchPlayers"
import { useLobbyData } from "../../hooks/useLobbyData"
import styles from "./Home.module.css"

export function Home() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const { games } = useLobbyData()
    const username = user?.username || "João"
    const [isPlayerSearchOpen, setIsPlayerSearchOpen] = useState(false)
    const { mutateAsync: createChallenge } = useCreateChallenge()
    const { mutateAsync: joinMatchmaking, isPending: isJoiningMatchmaking } = useJoinMatchmaking()

    const handleJoinMatchmaking = async () => {
        if (!user?.id) return

        try {
            await joinMatchmaking(user.id)
            mensagemAdapter.success("Você entrou na fila de matchmaking.")
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
                    <PlayActions onPlay={handleJoinMatchmaking} isLoading={isJoiningMatchmaking} />

                    <div className={styles.featureImage} role="img" aria-label="Peças de xadrez em um tabuleiro" />

                    <QuickGames username={username} games={games} onOpenGame={() => navigate("/game")} />

                    <aside className={styles.rightRail}>
                        <OnlineFriends
                            onChallenge={(friendUsername) => handleCreateChallenge(friendUsername)}
                            onSearchPanelChange={setIsPlayerSearchOpen}
                        />
                        {isPlayerSearchOpen && <SearchPlayers />}
                        <Performance />
                    </aside>
                </div>
            </section>
        </main>
    )
}
