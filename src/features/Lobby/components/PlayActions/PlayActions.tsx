import styles from "./PlayActions.module.css"
import { Buttons } from "../Buttons/Buttons"

type PlayActionsProps = { onPlay: () => void }
export function PlayActions({ onPlay }: PlayActionsProps) {
    return <section className={styles.playCard}><div className={styles.icon}>◷</div><h2>Jogar</h2><p>Encontre um oponente e<br />jogue agora mesmo.</p><Buttons onPlay={onPlay} /></section>
}
