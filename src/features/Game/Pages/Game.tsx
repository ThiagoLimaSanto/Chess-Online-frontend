import { useNavigate, useParams } from "react-router-dom"

import { mensagemAdapter } from "../../../packages/mensagem/mensagemAdapter"
import { useAuth } from "../../auth/contexts/auth/useAuth"
import { Navbar } from "../../Lobby/components/Navbar/Navbar"
import { GameBoard } from "../components/GameBoard/GameBoard"
import { GameDetails } from "../components/GameDetails/GameDetails"
import { GameSummary } from "../components/GameSummary/GameSummary"
import { PlayerCard } from "../components/PlayerCard/PlayerCard"

import styles from "./Game.module.css"

const board = [
    ["♜", "♞", "♝", "♛", "♚", "♝", "", "♜"],
    ["♟", "♟", "♟", "♟", "", "♟", "♟", "♟"],
    ["♟", "", "♞", "", "", "", "", ""],
    ["", "♗", "", "", "♟", "", "", ""],
    ["♗", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "♘", "", ""],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
]

const moves = [["e4", "e5"], ["Nf3", "Nc6"], ["Bb5", "a6"], ["Ba4", "Nf6"], ["O-O", "Be7"], ["Re1", "b5"], ["Bb3", "d6"]]

export function Game() {
    const navigate = useNavigate()
    const { gameId } = useParams()
    const { user, logout } = useAuth()

    if (!user) return null

    const unavailable = () => {
        mensagemAdapter.error("Essa ação estará disponível quando a partida estiver conectada à API.")
    }

    return (
        <main className={styles.gamePage}>
            <div className={styles.content}>
                <Navbar username={user.username} onLogout={() => void logout()} />

                <div className={styles.breadcrumb}><button type="button" onClick={() => navigate("/")}>← Voltar ao lobby</button><span>{gameId ? `Partida ${gameId.slice(0, 8)}` : "Partida rápida"}</span></div>

                <section className={styles.gameLayout} aria-label="Partida de xadrez">
                    <aside className={styles.leftPanel}>
                        <PlayerCard name="Carlos" rating="1248" time="09:42" tone="opponent" />
                        <GameSummary />
                    </aside>

                    <div className={styles.boardColumn}>
                        <GameBoard board={board} />

                        <PlayerCard name={user.username} rating="1200" time="09:56" tone="you" />
                    </div>

                    <GameDetails moves={moves} onUnavailable={unavailable} />
                </section>
            </div>
        </main>
    )
}
