import styles from "./PlayActions.module.css"
import { Buttons } from "../Buttons/Buttons"

type PlayActionsProps = {
    onPlay: () => void | Promise<void>
    isSearching?: boolean
}

export function PlayActions({ onPlay, isSearching = false }: PlayActionsProps) {
    return <section className={styles.playCard}><div className={styles.icon}>◷</div><h2>Jogar</h2><p>Encontre um oponente e<br />jogue agora mesmo.</p><Buttons onPlay={onPlay} isSearching={isSearching} /></section>
}
