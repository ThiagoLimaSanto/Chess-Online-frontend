import type { QuickGame } from "../../hooks/useLobbyData";
import styles from "./QuickGames.module.css";

type QuickGamesProps = { username: string; games: QuickGame[]; onOpenGame: () => void }
export function QuickGames({ username, games, onOpenGame }: QuickGamesProps) {
    return <section className={styles.recentGames}><div className={styles.heading}><h2>Partidas rápidas</h2></div>{games.map((game) => <div className={styles.row} key={game.opponent}><span className={styles.clock}>◷</span><span>10 min</span><span className={styles.avatar}>{username[0].toUpperCase()}</span><span>{username} <small>(1520)</small> 🇧🇷</span><b>×</b><span className={styles.avatar}>{game.avatar}</span><span>{game.opponent} <small>({game.rating})</small> 🇧🇷</span><strong className={styles[game.tone]}>{game.result}</strong><button className={styles.play} onClick={onOpenGame}>▶</button></div>)}</section>
}
