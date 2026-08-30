import styles from "./PlayerCard.module.css"

type PlayerCardProps = { name: string; color: "WHITE" | "BLACK"; rating?: number; gamesPlayed?: number; victories?: number; time: string; isClockActive?: boolean; isLowTime?: boolean; tone: "opponent" | "you" }

export function PlayerCard({ name, color, rating, gamesPlayed, victories, time, isClockActive = false, isLowTime = false, tone }: PlayerCardProps) {
    return <article className={`${styles.card} ${styles[tone]}`}>
        <div className={styles.identity}>
            <span className={styles.avatar}>{name[0].toUpperCase()}</span>
            <div>
                <strong>{name}</strong>
                <small>Rating {rating ?? "—"}</small>
                <span>{color === "WHITE" ? "♙ Brancas" : "♟ Pretas"}</span>
                {gamesPlayed !== undefined && <span>{gamesPlayed} partidas · {victories ?? 0} vitórias</span>}
            </div>
        </div>
        <time className={`${isClockActive ? styles.activeClock : ""} ${isLowTime ? styles.lowTime : ""}`}>{time}</time>
    </article>
}
