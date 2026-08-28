import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
                    <PlayActions onPlay={() => navigate("/game")} />

                    <div className={styles.featureImage} role="img" aria-label="Peças de xadrez em um tabuleiro" />

                    <QuickGames username={username} games={games} onOpenGame={() => navigate("/game")} />

                    <aside className={styles.rightRail}>
                        <OnlineFriends
                            onChallenge={() => navigate("/game")}
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
