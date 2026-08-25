import { useAuth } from "../../../auth/contexts/auth/useAuth"
import { useNavigate } from "react-router-dom"
import { useLobbyData } from "../../hooks/useLobbyData"
import { OnlineFriends } from "../../components/OnlineFriends/OnlineFriends"
import { Performance } from "../../components/Performance/Performance"
import { PlayActions } from "../../components/PlayActions/PlayActions"
import { Navbar } from "../../components/Navbar/Navbar"
import { QuickGames } from "../../components/QuickGames/QuickGames"
import styles from "./Home.module.css"

export function Home() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const { games, friends } = useLobbyData()
    const username = user?.username || "João"

    return (
        <main className={styles.home}>
            <section className={styles.content}>
                <Navbar username={username} onLogout={() => void logout()} />

                <div className={styles.pageIntro}>
                    <p className={styles.eyebrow}>PAINEL PRINCIPAL</p>
                    <h1>Bem-vindo de volta, {username}! <span>👋</span></h1>
                    <p>Pronto para jogar?</p>
                </div>

                <div className={styles.dashboard}>
                    <PlayActions onPlay={() => navigate("/game")} />

                    <div className={styles.featureImage} role="img" aria-label="Peças de xadrez em um tabuleiro" />

                    <QuickGames username={username} games={games} onOpenGame={() => navigate("/game")} />

                    <aside className={styles.rightRail}>
                        <OnlineFriends friends={friends} />
                        <Performance />
                    </aside>
                </div>
            </section>
        </main>
    )
}