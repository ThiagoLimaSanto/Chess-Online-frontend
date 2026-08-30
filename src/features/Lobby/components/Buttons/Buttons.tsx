import styles from "./Buttons.module.css"

type ButtonsProps = {
    onPlay: () => void | Promise<void>
    isSearching?: boolean
    hasCurrentMatch?: boolean
}

export function Buttons({ onPlay, isSearching = false, hasCurrentMatch = false }: ButtonsProps) {
    const label = hasCurrentMatch
        ? "Voltar ao jogo"
        : isSearching
            ? "Buscando partida..."
            : "Jogar agora"

    return (
        <div className={styles.actions}>
            <button className={styles.primary} onClick={() => void onPlay()} disabled={isSearching && !hasCurrentMatch}>
                {label}
            </button>
        </div>
    )
}
