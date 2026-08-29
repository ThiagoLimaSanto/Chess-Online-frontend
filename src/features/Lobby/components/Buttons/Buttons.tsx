import styles from "./Buttons.module.css"

type ButtonsProps = {
    onPlay: () => void | Promise<void>
    isSearching?: boolean
}

export function Buttons({ onPlay, isSearching = false }: ButtonsProps) {
    return (
        <div className={styles.actions}>
            <button className={styles.primary} onClick={() => void onPlay()} disabled={isSearching}>
                {isSearching ? "Buscando partida..." : "Jogar agora"}
            </button>
        </div>
    )
}
