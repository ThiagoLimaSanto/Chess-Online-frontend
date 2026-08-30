import styles from "./PlayActions.module.css"
import { Buttons } from "../Buttons/Buttons"

type PlayActionsProps = {
    onPlay: () => void | Promise<void>
    isSearching?: boolean
    hasCurrentMatch?: boolean
}

export function PlayActions({ onPlay, isSearching = false, hasCurrentMatch = false }: PlayActionsProps) {
    return <section className={styles.playCard}><div className={styles.icon}>◷</div><h2>Jogar</h2><p>{hasCurrentMatch ? <>Você tem uma partida<br />em andamento.</> : <>Encontre um oponente e<br />jogue agora mesmo.</>}</p><Buttons onPlay={onPlay} isSearching={isSearching} hasCurrentMatch={hasCurrentMatch} /></section>
}
