import styles from "./PlayActions.module.css"
import { Buttons } from "../Buttons/Buttons"

type PlayActionsProps = {
    onPlay: () => void | Promise<void>
    isLoading?: boolean
}

export function PlayActions({ onPlay, isLoading = false }: PlayActionsProps) {
    return <section className={styles.playCard}><div className={styles.icon}>◷</div><h2>Jogar</h2><p>Encontre um oponente e<br />jogue agora mesmo.</p><Buttons onPlay={onPlay} isLoading={isLoading} /></section>
}
