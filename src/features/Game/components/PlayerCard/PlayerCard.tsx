import styles from "./PlayerCard.module.css"

type PlayerCardProps = { name: string; rating: string; time: string; tone: "opponent" | "you" }

export function PlayerCard({ name, rating, time, tone }: PlayerCardProps) {
    return <article className={`${styles.card} ${styles[tone]}`}>
        <div className={styles.identity}>
            <span className={styles.avatar}>{name[0].toUpperCase()}</span>
            <div><strong>{name}</strong><small>Rating {rating}</small></div>
        </div>
        <time>{time}</time>
    </article>
}
