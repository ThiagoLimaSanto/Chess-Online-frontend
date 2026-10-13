import styles from "./Buttons.module.css"

type ButtonsProps = {
    onPlay: () => void | Promise<void>
    isSearching?: boolean
    hasCurrentMatch?: boolean
    onCancelSearch?: () => void | Promise<void>
    isJoining?: boolean
    isCancelling?: boolean
}

export function Buttons({ onPlay, isSearching = false, hasCurrentMatch = false,
    onCancelSearch, isJoining = false, isCancelling = false }: ButtonsProps) {
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
            {isSearching && !hasCurrentMatch && onCancelSearch && (
                <button
                    type="button"
                    className={styles.cancel}
                    onClick={() => void onCancelSearch()}
                    disabled={isJoining || isCancelling}
                >
                    {isCancelling ? "Saindo da fila..." : "Sair da fila"}
                </button>
            )}
        </div>
    )
}
